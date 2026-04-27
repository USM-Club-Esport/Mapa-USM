import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Marker, Circle } from 'react-native-maps';
import * as Location from 'expo-location';
import { Alert } from 'react-native';

export default function UserLocationMarker({ onLocationChange, onPermissionChange }) {
    const [location, setLocation] = useState(null);
    const [hasPermission, setHasPermission] = useState(false);

    useEffect(() => {
        let subscription = null;

        const startWatching = async () => {
            const { status } = await Location.requestForegroundPermissionsAsync();
            const granted = status === 'granted';
            setHasPermission(granted);
            onPermissionChange?.(granted);

            if (!granted) {
                Alert.alert(
                    'Permiso de ubicación',
                    'Necesitamos acceso a tu ubicación para mostrar dónde te encuentras en el campus.'
                );
                return;
            }

            const currentLocation = await Location.getCurrentPositionAsync({
                accuracy: Location.Accuracy.Balanced,
            });
            setLocation(currentLocation.coords);
            onLocationChange?.(currentLocation.coords);

            subscription = await Location.watchPositionAsync(
                {
                    accuracy: Location.Accuracy.Balanced,
                    timeInterval: 2000,
                    distanceInterval: 5,
                },
                (newLocation) => {
                    setLocation(newLocation.coords);
                    onLocationChange?.(newLocation.coords);
                }
            );
        };

        startWatching();

        return () => {
            subscription?.remove();
        };
    }, []);

    if (!location || !hasPermission) return null;

    return (
        <>
            <Circle
                center={{ latitude: location.latitude, longitude: location.longitude }}
                radius={location.accuracy || 20}
                strokeColor="rgba(0, 122, 255, 0.3)"
                fillColor="rgba(0, 122, 255, 0.15)"
            />
            <Marker
                coordinate={{ latitude: location.latitude, longitude: location.longitude }}
                title="Tu ubicación"
                anchor={{ x: 0.5, y: 0.5 }}
            >
                <View style={styles.dot} />
            </Marker>
        </>
    );
}

const styles = StyleSheet.create({
    dot: {
        width: 16,
        height: 16,
        borderRadius: 8,
        backgroundColor: '#007AFF',
        borderWidth: 2,
        borderColor: 'white',
    },
});
