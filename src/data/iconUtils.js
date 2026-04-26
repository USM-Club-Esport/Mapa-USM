import React from 'react';
import { FontAwesome5, Ionicons, MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { MENU_DATA, FACULTIES_DATA, CAFETERIA_DATA, ENTERTAINMENT_DATA } from './menuData';

/**
 * Renderiza un icono vectorial de @expo/vector-icons.
 * @param {string} family - Familia del icono (ej. 'FontAwesome5', 'MaterialIcons').
 * @param {string} name - Nombre exacto del icono.
 * @param {number} size - Tamaño en píxeles.
 * @param {string} [color='white'] - Color del icono.
 * @returns {JSX.Element|null} Elemento React del icono o null si la familia no existe.
 */
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
/**
 * Devuelve la familia y nombre del icono correspondiente a un marcador.
 * Busca primero en el sub-ítem; si no existe, recurre al icono de la categoría.
 * @param {import('./markersData').Marker} marker - Objeto marcador.
 * @returns {{family: string, name: string}} Objeto con la familia y nombre del icono.
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
