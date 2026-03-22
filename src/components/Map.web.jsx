import React, { useEffect, useState } from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { getMarkerIcon } from '../data/iconUtils';
import { Map as PigeonMap, Overlay, ZoomControl } from 'pigeon-maps';
import { FontAwesome5, Ionicons, MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';

const INITIAL_CENTER = [10.4912244, -66.7805869];
const INITIAL_ZOOM = 17;

const MarkerView = ({ marker, onPress }) => {
    const iconDef = getMarkerIcon(marker);
    let IconComponent = MaterialIcons;
    switch (iconDef.family) {
        case 'FontAwesome5': IconComponent = FontAwesome5; break;
        case 'Ionicons': IconComponent = Ionicons; break;
        case 'MaterialCommunityIcons': IconComponent = MaterialCommunityIcons; break;
    }

    return (
        <TouchableOpacity style={styles.markerWrapper} onPress={() => onPress?.(marker)} activeOpacity={0.8}>
            <View style={[styles.markerSquare, { backgroundColor: marker.color }]}>
                <View style={styles.markerCircle}>
                    <IconComponent name={iconDef.name} size={14} color={marker.color} />
                </View>
            </View>
        </TouchableOpacity>
    );
};

export default function Map({ markers = [], focusRegion = null, selectedMarkerId = null, onMarkerPress }) {
    const [center, setCenter] = useState(INITIAL_CENTER);
    const [zoom, setZoom] = useState(INITIAL_ZOOM);

    useEffect(() => {
        if (focusRegion) {
            setCenter([focusRegion.latitude, focusRegion.longitude]);
            setZoom(18);
        }
    }, [focusRegion]);

    useEffect(() => {
        if (selectedMarkerId) {
            const marker = markers.find((item) => item.id === selectedMarkerId);
            if (marker) {
                setCenter([marker.latitude, marker.longitude]);
                setZoom(19);
            }
        }
    }, [selectedMarkerId, markers]);

    return (
        <View style={styles.container}>
            <PigeonMap 
                center={center} 
                zoom={zoom} 
                onBoundsChanged={({ center, zoom }) => { 
                    setCenter(center); 
                    setZoom(zoom); 
                }}
            >
                <ZoomControl />
                {markers.map((marker) => (
                    <Overlay 
                        key={marker.id} 
                        anchor={[marker.latitude, marker.longitude]} 
                        offset={[15, 30]} // offset centers the bottom middle of a 30x30 square
                    >
                        <MarkerView marker={marker} onPress={onMarkerPress} />
                    </Overlay>
                ))}
            </PigeonMap>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        height: '100%',
        width: '100%',
        backgroundColor: '#f0f0f0'
    },
    markerWrapper: {
        width: 30,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 5,
        cursor: 'pointer',
    },
    markerSquare: {
        width: 30,
        height: 30,
        borderRadius: 6,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1.5,
        borderColor: 'rgba(255,255,255,0.4)',
    },
    markerCircle: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
    }
});

