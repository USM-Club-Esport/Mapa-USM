import React, { useEffect, useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import Svg, { Path, G } from 'react-native-svg';

const INITIAL_REGION = {
    latitude: 10.4912244,
    longitude: -66.7805869,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
};

export default function Map({ markers = [], focusRegion = null, selectedMarkerId = null, onMarkerPress }) {
    const mapRef = useRef(null);
    const markerRefs = useRef({});

 useEffect(() => {
        if (mapRef.current && focusRegion) {
            mapRef.current.animateToRegion(focusRegion, 700);
        }
    }, [focusRegion]);


    // Optional: Animate to region when markers change or fit to markers
    useEffect(() => {
        if (markers.length > 0 && mapRef.current) {
            // mapRef.current.fitToCoordinates(markers, { edgePadding: { top: 50, right: 50, bottom: 50, left: 50 }, animated: true });
        }
    }, [markers]);

    useEffect(() => {
        if (!selectedMarkerId || !mapRef.current) return;

        const marker = markers.find((item) => item.id === selectedMarkerId);
        if (!marker) return;

        mapRef.current.animateToRegion(
            {
                latitude: marker.latitude,
                longitude: marker.longitude,
                latitudeDelta: 0.006,
                longitudeDelta: 0.006,
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
                    >
                        <View style={styles.markerTouchArea}>
                            <Svg width="40" height="40" viewBox="0 0 1200 1200" fill={marker.color} stroke="#1E1E1E" strokeWidth="20">
                                <G id="SVGRepo_iconCarrier">
                                    <Path d="M600,0C350.178,0,147.656,202.521,147.656,452.344 c0,83.547,16.353,169.837,63.281,232.031L600,1200l389.062-515.625c42.625-56.49,63.281-156.356,63.281-232.031 C1052.344,202.521,849.822,0,600,0z M600,261.987c105.116,0,190.356,85.241,190.356,190.356C790.356,557.46,705.116,642.7,600,642.7 s-190.356-85.24-190.356-190.356S494.884,261.987,600,261.987z" />
                                </G>
                            </Svg>
                        </View>
                    </Marker>
                ))}
            </MapView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    map: {
        flex: 1,
        width: '100%',
        height: '100%',
    },
    markerTouchArea: {
        width: 56,
        height: 56,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent',
    },
});
