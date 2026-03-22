import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, Image } from 'react-native';
import MapView, { Marker } from 'react-native-maps';


const INITIAL_REGION = {
    latitude: 10.4912244,
    longitude: -66.7805869,
    latitudeDelta: 0.0035,
    longitudeDelta: 0.0035,
};

const MARKER_IMAGES = {
    'f1': require('../assets/markers/f1.png'),
    'f2': require('../assets/markers/f2.png'),
    'f3': require('../assets/markers/f3.png'),
    'f4': require('../assets/markers/f4.png'),
    'f5': require('../assets/markers/f5.png'),
    'f19': require('../assets/markers/f19.png'), // Default fallback
    'a1': require('../assets/markers/a1.png'),
    'c1': require('../assets/markers/c1.png'),
    'c2': require('../assets/markers/c2.png'),
    'c3': require('../assets/markers/c3.png'),
    'c4': require('../assets/markers/c4.png'),
    'c5': require('../assets/markers/c5.png'),
    'c6': require('../assets/markers/c6.png'),
    'e1': require('../assets/markers/e1.png'),
    'e2': require('../assets/markers/e2.png'),
    'e3': require('../assets/markers/e3.png'),
    'm1': require('../assets/markers/m1.png'),
    'b1': require('../assets/markers/b1.png'),
    'ee1': require('../assets/markers/ee1.png'),
};

export default function Map({ markers = [], focusRegion = null, selectedMarkerId = null, onMarkerPress }) {
    const mapRef = useRef(null);

    const markerRefs = useRef({});

    useEffect(() => {
        if (mapRef.current && focusRegion) {
            mapRef.current.animateToRegion(focusRegion, 700);
        }
    }, [focusRegion]);

    useEffect(() => {
        if (!selectedMarkerId || !mapRef.current) return;

        const marker = markers.find((item) => item.id === selectedMarkerId);
        if (!marker) return;

        mapRef.current.animateToRegion(
            {
                latitude: marker.latitude,
                longitude: marker.longitude,
                latitudeDelta: 0.0025,
                longitudeDelta: 0.0025,
            },
            500
        );

        setTimeout(() => {
            const markerRef = markerRefs.current[selectedMarkerId];
            if (markerRef && markerRef.showCallout) {
                markerRef.showCallout();
            }
        }, 550);
    }, [selectedMarkerId, markers]);

    return (
        <View style={styles.container}>
            <MapView
                ref={mapRef}
                style={styles.map}
                initialRegion={INITIAL_REGION}
                showsUserLocation={true}
            >
                {markers.map((marker) => (
                    <Marker
                        key={marker.id}
                        ref={(ref) => {
                            if (ref) {
                                markerRefs.current[marker.id] = ref;
                            }
                        }}
                        coordinate={{ latitude: marker.latitude, longitude: marker.longitude }}
                        title={marker.title}
                        onPress={() => onMarkerPress?.(marker)}
                        anchor={{ x: 0.5, y: 0.5 }}
                        image={MARKER_IMAGES[marker.subItemId] || MARKER_IMAGES['f19']}
                    />
                ))}
            </MapView>
        </View>
    );

}

const styles = StyleSheet.create({
// ... rest of styles

    container: {
        flex: 1,
    },
    map: {
        flex: 1,
        width: '100%',
        height: '100%',
    },
});
