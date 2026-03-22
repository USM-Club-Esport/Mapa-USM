import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { renderIcon } from '../../data/iconUtils';

export const MenuItem = ({ item, onPress }) => (
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

const styles = StyleSheet.create({
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255, 255, 255, 0.15)',
        width: '100%'
    },
    menuItemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    menuIconContainer: {
        width: 38,
        height: 38,
        borderRadius: 8,
        backgroundColor: 'rgba(255,255,255,0.15)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    menuItemText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '500',
    }
});
