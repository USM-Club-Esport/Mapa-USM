import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

export default function CenterLocationButton({ onPress, isActive }) {
    return (
        <TouchableOpacity
            style={[styles.button, !isActive && styles.buttonInactive]}
            onPress={onPress}
            activeOpacity={0.8}
        >
            <MaterialIcons
                name="my-location"
                size={24}
                color={isActive ? '#007AFF' : '#9E9E9E'}
            />
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        position: 'absolute',
        right: 16,
        bottom: 100,
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        elevation: 4,
        zIndex: 1100,
    },
    buttonInactive: {
        backgroundColor: '#F5F5F5',
    },
});
