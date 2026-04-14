import React from 'react';
import { FontAwesome5, Ionicons, MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { MENU_DATA, FACULTIES_DATA, CAFETERIA_DATA, ENTERTAINMENT_DATA } from './menuData';

export const renderIcon = (family, name, size, color = "white") => {
    switch (family) {
        case 'FontAwesome5': return <FontAwesome5 name={name} size={size} color={color} />;
        case 'Ionicons': return <Ionicons name={name} size={size} color={color} />;
        case 'MaterialCommunityIcons': return <MaterialCommunityIcons name={name} size={size} color={color} />;
        case 'MaterialIcons':
        default:
            return <MaterialIcons name={name} size={size} color={color} />;
    }
};

/**
 * Returns the icon family and name for a given marker based on its category and sub-item.
 * Falls back to the category icon if no sub-item icon is found.
 */
export const getMarkerIcon = (marker) => {
    let subItem;
    
    // Check for sub-item icons first
    switch (marker.categoryId) {
        case '1': // Facultades
            subItem = FACULTIES_DATA.find(f => f.id === marker.subItemId);
            break;
        case '3': // Cafetería
            subItem = CAFETERIA_DATA.find(c => c.id === marker.subItemId);
            break;
        case '4': // Entretenimiento
            subItem = ENTERTAINMENT_DATA.find(e => e.id === marker.subItemId);
            break;
        default:
            subItem = null;
    }

    if (subItem) {
        return { family: subItem.iconFamily, name: subItem.iconName };
    }

    // Fallback to category icon
    const category = MENU_DATA.find(c => c.id === marker.categoryId);
    if (category) {
        return { family: category.iconFamily, name: category.iconName };
    }

    // Default fallback
    return { family: 'MaterialIcons', name: 'place' };
};
