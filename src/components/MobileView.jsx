import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView, Animated, Platform, TouchableWithoutFeedback, BackHandler, Alert } from 'react-native';
import { useRef, useState, useEffect, useMemo } from 'react';
import { MaterialIcons, FontAwesome5, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { styles } from '../styles/MobileViewStyles';
import { MENU_DATA, FACULTIES_DATA, CAFETERIA_DATA, ENTERTAINMENT_DATA } from '../data/menuData';
import { MARKERS_DATA } from '../data/markersData';
import Map from './Map';

const renderIcon = (family, name, size) => {
    switch (family) {
        case 'FontAwesome5': return <FontAwesome5 name={name} size={size} color="white" />;
        case 'Ionicons': return <Ionicons name={name} size={size} color="white" />;
        case 'MaterialCommunityIcons': return <MaterialCommunityIcons name={name} size={size} color="white" />;
        case 'MaterialIcons':
        default:
            return <MaterialIcons name={name} size={size} color="white" />;
    }
};

const getRegionWithMostNodes = (markers) => {
    if (!markers || markers.length === 0) return null;

    const CELL_SIZE = 0.0015; // tamaño de celda (aprox), puedes ajustarlo
    const cells = {};

    markers.forEach((marker) => {
        const latitude = marker?.coordinate?.latitude ?? marker?.latitude;
        const longitude = marker?.coordinate?.longitude ?? marker?.longitude;

        if (typeof latitude !== 'number' || typeof longitude !== 'number') return;

        const latCell = Math.floor(latitude / CELL_SIZE);
        const lngCell = Math.floor(longitude / CELL_SIZE);
        const key = `${latCell}_${lngCell}`;

        if (!cells[key]) cells[key] = [];
        cells[key].push({ latitude, longitude });
    });

    const allKeys = Object.keys(cells);
    if (allKeys.length === 0) return null;

    // Buscar la celda con más nodos
    let bestKey = allKeys[0];
    allKeys.forEach((key) => {
        if (cells[key].length > cells[bestKey].length) {
            bestKey = key;
        }
    });

    const bestPoints = cells[bestKey];

    // Calcular límites para centrar el mapa
    let minLat = bestPoints[0].latitude;
    let maxLat = bestPoints[0].latitude;
    let minLng = bestPoints[0].longitude;
    let maxLng = bestPoints[0].longitude;

    bestPoints.forEach((p) => {
        if (p.latitude < minLat) minLat = p.latitude;
        if (p.latitude > maxLat) maxLat = p.latitude;
        if (p.longitude < minLng) minLng = p.longitude;
        if (p.longitude > maxLng) maxLng = p.longitude;
    });

    const centerLat = (minLat + maxLat) / 2;
    const centerLng = (minLng + maxLng) / 2;

       // Ajuste manual del foco (vertical)
    const LATITUDE_OFFSET = 0.0006;


    return {
        latitude: centerLat + LATITUDE_OFFSET,
        longitude: centerLng,
        latitudeDelta: Math.max((maxLat - minLat) * 3, 0.0025),
        longitudeDelta: Math.max((maxLng - minLng) * 3, 0.0025),
    };
};

const MenuItem = ({ item, onPress }) => (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
        <View style={styles.menuItemLeft}>
            <View style={styles.menuIconContainer}>
                {renderIcon(item.iconFamily, item.iconName, item.size)}
            </View>
            <Text style={styles.menuItemText}>{item.title}</Text>
        </View>
        <MaterialIcons name="chevron-right" size={24} color="#88aadd" />
    </TouchableOpacity>
);

export default function MobileView() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [currentMenu, setCurrentMenu] = useState('main'); // 'main' | 'faculties'
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [activeMarkers, setActiveMarkers] = useState(MARKERS_DATA);
    const [selectedMarkerId, setSelectedMarkerId] = useState(null);

 // ============ ESTADOS PARA EL LEGEND (NUEVOS) ============
    // selectedMarker: guarda el objeto completo del marcador seleccionado
    // Esto nos permite acceder a title, address, departments, etc.
    const [selectedMarker, setSelectedMarker] = useState(null);
    
    // expandedSection: controla qué sección del legend está expandida
    // Valores posibles: null (ninguna), 'address', 'departments'
    // Funciona como un accordion: solo una sección abierta a la vez
    const [expandedSection, setExpandedSection] = useState(null);

    // Valores animados para desplegar/ocultar cada panel con transición suave.
    const addressAnim = useRef(new Animated.Value(0)).current;
    const departmentsAnim = useRef(new Animated.Value(0)).current;


    // Empezamos ocultos abajo del todo
    const slideAnim = useRef(new Animated.Value(0)).current;

    // Animación para el título de la categoría
    const titleAnim = useRef(new Animated.Value(0)).current;

    // Animación de transición entre menús (fade/slide)
    const menuTransitionAnim = useRef(new Animated.Value(1)).current;

    // Animación de escala para el botón hamburguesa
    const buttonScale = useRef(new Animated.Value(1)).current;

        // Región automática: zona con más nodos
    const focusRegion = useMemo(() => {
        return getRegionWithMostNodes(activeMarkers);
    }, [activeMarkers]);

     const showAlert = () => {
        Alert.alert('Aún en desarrollo');
    };

    // Resetea el panel de información (Dirección / Departamentos)
    const resetLegend = () => {
        setExpandedSection(null);
        addressAnim.setValue(0);
        departmentsAnim.setValue(0);
    };

    const handleButtonPressIn = () => {
        Animated.spring(buttonScale, {
            toValue: 0.94,
            useNativeDriver: false,
            friction: 5,
            tension: 40,
        }).start();
    };

    const handleButtonPressOut = () => {
        Animated.spring(buttonScale, {
            toValue: 1,
            useNativeDriver: false,
            friction: 5,
            tension: 40,
        }).start();
    };

/**
 * selectMarker() - Se ejecuta cuando el usuario toca un marcador en el mapa
 * 
 * ¿Qué hace?
 * - Guarda el marcador completo en selectedMarker (no solo el nombre)
 * - Guarda el ID del marcador
 * - Reinicia el estado expandedSection para que las secciones estén cerradas
 * 
 * @param {Object} marker - El objeto marcador completo que contiene:
 *                          {id, title, address, departments, latitude, longitude, ...}
 */

    const selectMarker = (marker) => {
    if (!marker) {
        setSelectedMarkerId(null);
        setSelectedMarker(null);
        resetLegend();
        return;
    }

    setSelectedMarkerId(marker.id);
    setSelectedMarker(marker); // Guardamos el objeto completo
    resetLegend(); // Reiniciamos las secciones y sus animaciones
};

/**
 * clearSelectedMarker() - Limpia la selección actual del marcador
 * Se ejecuta cuando el usuario toca el botón [X] del legend
 * 
 * ¿Qué hace?
 * - Resetea el ID del marcador
 * - Borra el objeto marcador
 * - Cierra cualquier sección expandida
 * - Vuelve a mostrar todos los marcadores en el mapa
 */
    const clearSelectedMarker = () => {
        setSelectedMarkerId(null);
        setSelectedMarker(null);
        resetLegend();
        setActiveMarkers(MARKERS_DATA);
    };

  /**
 * toggleSection() - Abre/cierra una sección del legend (accordion)
 * 
 * Comportamiento:
 * - Si la sección que toco ya está abierta → la cierro
 * - Si toco otra sección → cierro la anterior y abro la nueva
 * - Solo una sección puede estar abierta a la vez
 * 
 * Ejemplo:
 * - expandedSection = null → toco "Dirección" → expandedSection = 'address'
 * - expandedSection = 'address' → toco "Dirección" de nuevo → expandedSection = null
 * - expandedSection = 'address' → toco "Departamentos" → expandedSection = 'departments'
 * 
 * @param {string} section - 'address' o 'departments'
 */
const toggleSection = (section) => {
    if (expandedSection === section) {
        // Si es la misma sección, la cerramos
        setExpandedSection(null);
    } else {
        // Si es otra sección, abrimos la nueva (la anterior se cierra automáticamente)
        setExpandedSection(section);
    }
};  

    // Animamos la apertura/cierre de cada bloque cuando cambia la sección expandida.
    useEffect(() => {
        Animated.parallel([
            Animated.timing(addressAnim, {
                toValue: expandedSection === 'address' ? 1 : 0,
                duration: 260,
                useNativeDriver: false,
            }),
            Animated.timing(departmentsAnim, {
                toValue: expandedSection === 'departments' ? 1 : 0,
                duration: 260,
                useNativeDriver: false,
            }),
        ]).start();
    }, [expandedSection, addressAnim, departmentsAnim]);

    const toggleMenu = () => {
        const toValue = menuOpen ? 0 : 1;
        if (menuOpen) {
            // Reset state sin animación porque el menú mismo se está ocultando
            setCurrentMenu('main');
            setSelectedCategory(null);
            menuTransitionAnim.setValue(1);
        } else {
            setCurrentMenu('main');
            setSelectedCategory(null);
            menuTransitionAnim.setValue(1);
            // Al abrir el menú del índice, cerramos todo lo que estuviera abierto antes
            setSelectedMarkerId(null);
            setSelectedMarker(null);
            resetLegend();
            setActiveMarkers(MARKERS_DATA);
        }

        Animated.spring(slideAnim, {
            toValue,
            useNativeDriver: false, // height/bottom en layout no soportan driver nativo en React Native core
            friction: 7,
            tension: 40,
        }).start();
        setMenuOpen(!menuOpen);
    };

    const animateMenuTransition = (callback) => {
        Animated.timing(menuTransitionAnim, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
        }).start(() => {
            callback();
            Animated.timing(menuTransitionAnim, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
            }).start();
        });
    };

    const handleMenuPress = (item) => {
        if (item.title === 'Facultades' || item.title === 'Cafetería' || item.title === 'Entretenimiento') {
            animateMenuTransition(() => {
                setSelectedCategory(item);

                if (item.title === 'Facultades') {
                    setCurrentMenu('faculties');
                } else if (item.title === 'Cafetería') {
                    setCurrentMenu('cafeteria');
                } else if (item.title === 'Entretenimiento') {
                    setCurrentMenu('entertainment');
                }

                // Filter markers by category
                const filtered = MARKERS_DATA.filter(m => m.categoryId === item.id);
                setActiveMarkers(filtered);

                // Cuando se selecciona una categoría con un solo marcador
                if (filtered.length === 1) {
                 selectMarker(filtered[0]);
                } else {
                setSelectedMarkerId(null);
                setSelectedMarker(null);
                resetLegend();
                }
                // Iniciar animación del título
                titleAnim.setValue(0);
                Animated.timing(titleAnim, {
                    toValue: 1,
                    duration: 400,
                    useNativeDriver: true,
                    delay: 100 // Un pequeño delay para que entre después del fade in general
                }).start();
            });
        } else {
            // Si es un ítem principal sin submenú (Ej. Biblioteca), filtramos esos marcadores
            const filtered = MARKERS_DATA.filter(m => m.categoryId === item.id);
            setActiveMarkers(filtered);

            if (filtered.length === 1) {
                selectMarker(filtered[0]);
            } else {
                setSelectedMarkerId(null);
                setSelectedMarker(null);
                resetLegend();
            }

            toggleMenu(); // Opcional: Cerrar el menú al seleccionar
        }
    };

    const handleBackToMain = () => {
        if (currentMenu !== 'main') {
            animateMenuTransition(() => {
                setCurrentMenu('main');
                setSelectedCategory(null);
                setActiveMarkers(MARKERS_DATA); // Return all markers on back
                setSelectedMarkerId(null);
                setSelectedMarker(null);
                resetLegend();
            });
        }
    };

    // Hardware Back Button logic (Android)
    useEffect(() => {
        const backAction = () => {
            if (menuOpen) {
                if (currentMenu !== 'main') {
                    handleBackToMain();
                    return true; // Previene comportamiento default (salir de app)
                } else {
                    toggleMenu(); // Cierra el menú en vez de salir de app
                    return true;
                }
            }
            return false; // Deja que Android decida si cerrar app o volver atrás (fuera del mapa)
        };

        const backHandler = BackHandler.addEventListener(
            "hardwareBackPress",
            backAction
        );

        return () => backHandler.remove();
    }, [menuOpen, currentMenu]);

    // Interpolamos de 0 a 1. 0 = fuera por la izquierda, 1 = panel visible.
    const menuTranslateX = slideAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [-340, 0],
    });

    // Desvanece el botón del mapa cuando se abre el menú
    const buttonOpacity = slideAnim.interpolate({
        inputRange: [0, 0.5, 1],
        outputRange: [1, 0, 0],
    });

    return (
        

             <View style={styles.mobileContainer}>
            <View style={styles.mapContainer}>
                <Map
                    markers={activeMarkers}
                    focusRegion={focusRegion}
                    selectedMarkerId={selectedMarkerId}
                    onMarkerPress={(marker) => selectMarker(marker)}
                />
            </View>
            {/* ...existing code... */}
        

            <View style={styles.uiOverlay} pointerEvents="box-none">

                {/* Fondo oscuro para cerrar al hacer tap fuera */}
                <TouchableWithoutFeedback onPress={menuOpen ? toggleMenu : null}>
                    <Animated.View style={[
                        StyleSheet.absoluteFillObject,
                        {
                            backgroundColor: 'rgba(0,0,0,0.3)',
                            zIndex: 40,
                            opacity: slideAnim // Se desvanece al unísono con el menú
                        }
                    ]} pointerEvents={menuOpen ? 'auto' : 'none'} />
                </TouchableWithoutFeedback>
                {/* Botón hamburguesa flotante dentro de un botón azul animado */}
                <Animated.View
                    style={[
                        {
                            opacity: buttonOpacity,
                            zIndex: 1300,
                            position: 'absolute',
                            top: 24,
                            left: 16,
                            height: 90,
                            justifyContent: 'center',
                        },
                        { transform: [{ scale: buttonScale }] },
                    ]}
                    pointerEvents={menuOpen ? 'none' : 'auto'}
                >
                    <TouchableOpacity
                        style={styles.mapButton}
                        onPress={toggleMenu}
                        onPressIn={handleButtonPressIn}
                        onPressOut={handleButtonPressOut}
                        activeOpacity={0.85}
                    >
                        <MaterialIcons name="menu" size={30} color="white" />
                    </TouchableOpacity>
                </Animated.View>

                {!!selectedMarker && (
                    <>
                        {/* Encabezado superior: nombre del sitio seleccionado y botón de cerrar */}
                        <View
                            style={{
                                position: 'absolute',
                                top: 40,
                                left: 96,
                                right: 12,
                                zIndex: 1200,
                                borderRadius: 12,
                                overflow: 'hidden',
                                backgroundColor: '#002B7F',
                                borderWidth: 1,
                                borderColor: 'rgba(255,255,255,0.18)',
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                paddingHorizontal: 14,
                                paddingVertical: 10,
                            }}
                        >
                            <Text
                                style={{
                                    color: 'white',
                                    fontWeight: '700',
                                    fontSize: 15,
                                    flex: 1,
                                    paddingRight: 8,
                                    textAlign: 'center',
                                }}
                            >
                                {selectedMarker.title}
                            </Text>
                            <TouchableOpacity
                                onPress={clearSelectedMarker}
                                activeOpacity={0.8}
                                style={{
                                    width: 30,
                                    height: 30,
                                    borderRadius: 15,
                                    backgroundColor: 'rgba(255,255,255,0.16)',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}
                            >
                                <MaterialIcons name="close" size={18} color="white" />
                            </TouchableOpacity>
                        </View>

                        {/* Panel inferior con scroll: aquí se ve Dirección/Departamentos y su contenido */}
                        <Animated.View
                            style={{
                                position: 'absolute',
                                left: 12,
                                right: 12,
                                bottom: 24,
                                zIndex: 1200,
                                maxHeight: '55%',
                                borderRadius: 14,
                                // overflow: 'hidden', // dejamos visible para que el texto de módulos pueda salir por arriba
                                backgroundColor: '#012564',
                                borderWidth: 1,
                                borderColor: 'rgba(255,255,255,0.15)',
                                elevation: 18,
                                shadowColor: '#000',
                                shadowOpacity: 0.35,
                                shadowOffset: { width: 0, height: 8 },
                                shadowRadius: 10,
                            }}
                        >
                            {/* Etiqueta de módulos (solo si el marcador tiene módulos definidos) */}
                            {(selectedMarker.modules || []).length > 0 && (
                                <View
                                    style={{
                                        position: 'absolute',
                                        top: -40,
                                        right: 0,
                                        paddingHorizontal: 10,
                                        paddingVertical: 6,
                                        borderRadius: 8,
                                        backgroundColor: 'rgba(0,0,0,0.65)',
                                    }}
                                >
                                    <Text
                                        style={{
                                            color: 'white',
                                            fontWeight: '800',
                                            fontSize: 20,
                                            letterSpacing: 0.5,
                                        }}
                                    >
                                        {`Modulos: ${(selectedMarker.modules || []).join(', ')}`}
                                    </Text>
                                </View>
                            )}

                            <ScrollView
                                showsVerticalScrollIndicator={true}
                                nestedScrollEnabled={true}
                                contentContainerStyle={{ paddingBottom: 12 }}
                            >
                                {/* Sección Dirección: al abrirla, la de departamentos se cierra automáticamente */}
                                <TouchableOpacity
                                    onPress={() => toggleSection('address')}
                                    activeOpacity={0.75}
                                    style={{
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        paddingHorizontal: 14,
                                        paddingVertical: 12,
                                        borderTopWidth: 1,
                                        borderTopColor: 'rgba(255,255,255,0.08)',
                                        backgroundColor: '#012564',
                                    }}
                                >
                                    <Text style={{ color: 'white', fontWeight: '600', fontSize: 15 }}>Direccion</Text>
                                    <MaterialIcons
                                        name={expandedSection === 'address' ? 'keyboard-arrow-up' : 'keyboard-arrow-down'}
                                        size={24}
                                        color="#9DC6FF"
                                    />
                                </TouchableOpacity>

                                <Animated.View
                                    style={{
                                        overflow: 'hidden',
                                        backgroundColor: '#012564',
                                        maxHeight: addressAnim.interpolate({
                                            inputRange: [0, 1],
                                            outputRange: [0, 140],
                                        }),
                                        opacity: addressAnim,
                                    }}
                                >
                                    <View
                                        style={{
                                            paddingHorizontal: 14,
                                            paddingBottom: 14,
                                        }}
                                    >
                                        <Text style={{ color: 'white', opacity: 0.92, lineHeight: 20 }}>
                                            {selectedMarker.address || 'Direccion no disponible'}
                                        </Text>
                                    </View>
                                </Animated.View>

                                {/* Sección Departamentos: al abrirla, la de dirección se cierra automáticamente */}
                                <TouchableOpacity
                                    onPress={() => toggleSection('departments')}
                                    activeOpacity={0.75}
                                    style={{
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        paddingHorizontal: 14,
                                        paddingVertical: 12,
                                        borderTopWidth: 1,
                                        borderTopColor: 'rgba(255,255,255,0.08)',
                                        backgroundColor: '#012564',
                                    }}
                                >
                                    <Text style={{ color: 'white', fontWeight: '600', fontSize: 15 }}>Departamentos</Text>
                                    <MaterialIcons
                                        name={expandedSection === 'departments' ? 'keyboard-arrow-up' : 'keyboard-arrow-down'}
                                        size={24}
                                        color="#9DC6FF"
                                    />
                                </TouchableOpacity>

                                <Animated.View
                                    style={{
                                        overflow: 'hidden',
                                        backgroundColor: '#012564',
                                        maxHeight: departmentsAnim.interpolate({
                                            inputRange: [0, 1],
                                            outputRange: [0, 240],
                                        }),
                                        opacity: departmentsAnim,
                                    }}
                                >
                                    <View
                                        style={{
                                            paddingHorizontal: 14,
                                            paddingBottom: 14,
                                        }}
                                    >
                                        {(selectedMarker.departments || []).length > 0 ? (
                                            (selectedMarker.departments || []).map((department) => (
                                                <Text
                                                    key={department}
                                                    style={{ color: 'white', opacity: 0.92, lineHeight: 22 }}
                                                >
                                                    - {department}
                                                </Text>
                                            ))
                                        ) : (
                                            <Text
                                                style={{
                                                    color: 'rgba(255,255,255,0.6)',
                                                    fontSize: 14,
                                                }}
                                            >
                                                No hay departamentos disponibles
                                            </Text>
                                        )}
                                    </View>
                                </Animated.View>
                            </ScrollView>
                        </Animated.View>
                    </>
                )}

                {/* Menú lateral animado: entra desde la izquierda hacia la derecha */}
                <Animated.View
                    style={[
                        styles.menuPanel,
                        {
                            top: 70,
                            bottom: 20,
                            left: 0,
                            right: undefined,
                            width: '82%',
                            height: undefined,
                            borderTopRightRadius: 25,
                            borderTopLeftRadius: 0,
                            borderBottomRightRadius: 25,
                            borderBottomLeftRadius: 0,
                            transform: [{ translateX: menuTranslateX }],
                        },
                    ]}
                    pointerEvents={menuOpen ? 'auto' : 'none'}
                >

                    {/* Botón simple para cerrar el panel lateral */}
                    <TouchableOpacity
                        onPress={toggleMenu}
                        activeOpacity={0.8}
                        style={{ position: 'absolute', top: 14, right: 14, zIndex: 20 }}
                    >
                        <MaterialIcons name="close" size={24} color="white" />
                    </TouchableOpacity>

                    <View style={styles.menuHeader}>
                        {currentMenu !== 'main' && (
                            <TouchableOpacity
                                style={{ position: 'absolute', left: -10, top: 18, zIndex: 10, padding: 10 }}
                                onPress={handleBackToMain}
                                activeOpacity={0.8}
                            >
                                <MaterialIcons name="arrow-back" size={28} color="white" />
                            </TouchableOpacity>
                        )}
                        <Image
                            style={styles.headerLogo}
                            source={require('../assets/logousm/images.png')}
                            resizeMode="contain"
                        />
                        <Text style={styles.headerText}>MAPA USEMISTA</Text>
                    </View>

                    <Animated.ScrollView
                        style={[styles.menuItems, {
                            opacity: menuTransitionAnim,
                            transform: [{
                                translateX: menuTransitionAnim.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [20, 0] // Pequeño desplazamiento al aparecer
                                })
                            }]
                        }]}
                        showsVerticalScrollIndicator={false}
                    >
                        {currentMenu === 'main' ? (
                            MENU_DATA.map((item) => (
                                <MenuItem key={item.id} item={item} onPress={() => handleMenuPress(item)} />
                            ))
                        ) : (
                            <View style={{ width: '100%' }}>
                                {/* Title Header */}
                                {selectedCategory && (
                                    <Animated.View style={{
                                        alignItems: 'center',
                                        marginBottom: 20,
                                        opacity: titleAnim,
                                        transform: [
                                            { translateY: titleAnim.interpolate({ inputRange: [0, 1], outputRange: [-20, 0] }) }
                                        ]
                                    }}>
                                        {renderIcon(selectedCategory.iconFamily, selectedCategory.iconName, 40)}
                                        <Text style={{
                                            color: 'white',
                                            fontSize: 22,
                                            fontWeight: 'bold',
                                            marginTop: 8,
                                            marginBottom: 5
                                        }}>
                                            {selectedCategory.title}
                                        </Text>
                                        <View style={{ height: 2, width: 40, backgroundColor: '#4CA1E7', borderRadius: 1 }} />
                                    </Animated.View>
                                )}

                                {(() => {
                                    let data = [];
                                    if (currentMenu === 'faculties') data = FACULTIES_DATA;
                                    else if (currentMenu === 'cafeteria') data = CAFETERIA_DATA;
                                    else if (currentMenu === 'entertainment') data = ENTERTAINMENT_DATA;

                                    return data.map((item) => (
                                        <MenuItem key={item.id} item={item} onPress={() => {
                                            const singleMarkerInfo = MARKERS_DATA.filter(m => m.subItemId === item.id);
                                            setActiveMarkers(singleMarkerInfo);

                                            if (singleMarkerInfo.length > 0) {
                                                selectMarker(singleMarkerInfo[0]);
                                            } else {
                                                setSelectedMarkerId(null);
                                                setSelectedMarker(null); 
                                                resetLegend();
                                            }

                                            toggleMenu(); // Cerrar menú después de elegir sub-ícono para ver el mapa
                                        }} />
                                    ));
                                })()}
                            </View>
                        )}
                    </Animated.ScrollView>

                    <View style={styles.bottomControls}>
                        <View style={styles.toggleContainer}>
                            <TouchableOpacity style={[styles.toggleButton, styles.toggleActive]}>
                                <MaterialCommunityIcons name="office-building-outline" size={24} color="white" />
                                <Text style={styles.toggleText}>2D</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.toggleButton} onPress={showAlert}>
                                <MaterialCommunityIcons name="cube-outline" size={24} color="white" />
                                <Text style={styles.toggleText}>3D</Text>
                            </TouchableOpacity>
                        </View>
                        <TouchableOpacity onPress={showAlert} style={styles.settingsButton}>
                            <Ionicons name="settings-sharp" size={28} color="white" />
                        </TouchableOpacity>
                    </View>
                </Animated.View>

            </View>

            <StatusBar style="auto" />
        </View>
    );
}
