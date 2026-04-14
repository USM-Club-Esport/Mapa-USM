import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';

export const BottomControls = ({ on3DPress, onSettingsPress, style }) => {
    return (
        <View style={[styles.bottomControls, style]}>
            <View style={styles.toggleContainer}>
                <TouchableOpacity style={[styles.toggleButton, styles.toggleActive]}>
                    <MaterialCommunityIcons name="office-building-outline" size={24} color="white" />
                    <Text style={styles.toggleText}>2D</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.toggleButton} onPress={on3DPress}>
                    <MaterialCommunityIcons name="cube-outline" size={24} color="white" />
                    <Text style={styles.toggleText}>3D</Text>
                </TouchableOpacity>
            </View>
            <TouchableOpacity onPress={onSettingsPress} style={styles.settingsButton}>
                <Ionicons name="settings-sharp" size={28} color="white" />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    bottomControls: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
    },
    toggleContainer: {
        flexDirection: 'row',
        backgroundColor: '#002B7F',
        borderRadius: 30,
        padding: 4,
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.15)'
    },
    toggleButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 26,
    },
    toggleActive: {
        backgroundColor: '#4CA1E7',
    },
    toggleText: {
        color: 'white',
        fontWeight: 'bold',
        marginLeft: 6,
        fontSize: 16,
    },
    settingsButton: {
        backgroundColor: '#002B7F',
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.15)'
    }
});
