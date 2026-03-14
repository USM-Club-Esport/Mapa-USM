import React, { Suspense, useRef, useState, useEffect } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
import { Asset } from 'expo-asset';
import { loadAsync } from 'expo-three';
import { BUILDINGS_3D_DATA, parseSvgPathToCoords } from '../data/buildings3DData';

// Constantes globales para la escala correcta
const SVG_WIDTH = 800;
const SVG_HEIGHT = 1075;
const SVG_ASPECT = SVG_WIDTH / SVG_HEIGHT;
const PLANE_HEIGHT = 20;
const PLANE_WIDTH = PLANE_HEIGHT * SVG_ASPECT;

// Componente reutilizable para cualquier edificio basado en sus coordenadas (SVG path)
export function ExtrudedBuilding({ coords, height = 0.3, color = "#0004fc", opacity = 1 }) {
    const shape = React.useMemo(() => {
        if (!coords || coords.length === 0) return null;

        const s = new THREE.Shape();
        coords.forEach(([x, y], index) => {
            // Mapeo: 0 a ancho/alto del SVG -> -Mitad a Mitad del plano
            const px = (x / SVG_WIDTH - 0.5) * PLANE_WIDTH;
            const py = -(y / SVG_HEIGHT - 0.5) * PLANE_HEIGHT;
            
            if (index === 0) s.moveTo(px, py);
            else s.lineTo(px, py);
        });
        
        return s;
    }, [coords]);

    if (!shape) return null;

    return (
        <mesh position={[0, 0, 0.01]} castShadow receiveShadow>
            <extrudeGeometry args={[shape, { 
                depth: height, // Altura del edificio provista por prop
                bevelEnabled: true, 
                bevelSegments: 2, 
                steps: 1, 
                bevelSize: 0.02, 
                bevelThickness: 0.02 
            }]} />
            <meshStandardMaterial 
                color={color} 
                opacity={opacity} 
                transparent={opacity < 1} 
                roughness={0.1} 
                metalness={0.5} 
            />
        </mesh>
    );
}

function MapPlane() {
    const [texture, setTexture] = useState(null);
    const meshRef = useRef(null);
    const { gl } = useThree();
    const textureRef = useRef(null);

    useEffect(() => {
        let isMounted = true;
        const loadTexture = async () => {
            try {
                // Generamos la textura desde la imagen rasterizada .png
                // que ahora es compatible 100% con web y native WebGL, evitando errores 'document'.
                const tex = await loadAsync(require('../../assets/mapa.png'));

                tex.colorSpace = THREE.SRGBColorSpace;
                tex.generateMipmaps = true;
                tex.minFilter = THREE.LinearMipmapLinearFilter;
                tex.magFilter = THREE.LinearFilter;
                tex.wrapS = THREE.ClampToEdgeWrapping;
                tex.wrapT = THREE.ClampToEdgeWrapping;
                tex.anisotropy = gl?.capabilities?.getMaxAnisotropy?.() ?? 1;
                tex.needsUpdate = true;

                if (isMounted) {
                    textureRef.current?.dispose?.();
                    textureRef.current = tex;
                    setTexture(tex);
                } else {
                    tex.dispose();
                }
            } catch (error) {
                console.error("Error loading PNG texture: ", error);
            }
        };

        loadTexture();
        return () => {
            isMounted = false;
            textureRef.current?.dispose?.();
            textureRef.current = null;
        };
    }, []);

    // Nota: no animamos la rotación del plano para que la interacción
    // de cámara (órbita/zoom/pan) se sienta estable.

    return (
        <mesh ref={meshRef} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
            <planeGeometry args={[PLANE_WIDTH, PLANE_HEIGHT]} />
            {texture ? (
                <>
                    <meshStandardMaterial
                        map={texture}
                        transparent={true}
                        side={THREE.DoubleSide}
                        color="white"
                    />
                    
                    {/* Renderizamos todos los edificios desde el JSON */}
                    {BUILDINGS_3D_DATA.map(building => (
                        <ExtrudedBuilding 
                            key={building.id}
                            coords={parseSvgPathToCoords(building.path)}
                            height={building.height}
                            color={building.color}
                            opacity={building.opacity}
                        />
                    ))}
                </>
            ) : (
                <meshStandardMaterial color="#9a9a9a" side={THREE.DoubleSide} />
            )}
        </mesh>
    );
}

function Controls() {
    const controlsRef = useRef(null);

    // Ángulo polar fijo (desde el eje Y). Con la cámara inicial [0, 15, 15]
    // esto equivale a ~45°: no permite “subir/bajar” la cámara con click izquierdo.
    const FIXED_POLAR_ANGLE = Math.PI / 3;

    useFrame(() => {
        const controls = controlsRef.current;
        if (!controls) return;

        // Bloquea el desplazamiento vertical: el pan no puede alterar la altura
        // del punto objetivo (y por ende, del conjunto cámara/target).
        if (controls.target) controls.target.y = 0;
    });

    return (
        <OrbitControls
            ref={controlsRef}
            makeDefault={true}
            enableRotate={true}
            enableZoom={true}
            enablePan={true}
            // Pan sobre el plano (sin componente vertical en mundo)
            screenSpacePanning={false}
            // Bloquea la rotación vertical (polar): solo permite girar horizontalmente.
            minPolarAngle={FIXED_POLAR_ANGLE}
            maxPolarAngle={FIXED_POLAR_ANGLE}
            // Interacción más suave
            enableDamping={true}
            dampingFactor={0.08}
        />
    );
}

export default function Map3D() {
    return (
        <View style={StyleSheet.absoluteFillObject}>
            <Canvas
                camera={{ position: [0, 15, 15], fov: 50 }}
                style={Platform.OS === 'web' ? { touchAction: 'none' } : undefined}
            >
                <ambientLight intensity={1.2} />
                <directionalLight position={[10, 20, 10]} intensity={1} />
                <Controls />
                <Suspense fallback={null}>
                    <MapPlane />
                </Suspense>
            </Canvas>
        </View>
    );
}
