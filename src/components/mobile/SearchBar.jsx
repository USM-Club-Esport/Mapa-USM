import React, { useState } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

export const SearchBar = ({ onSearch, onClear }) => {
    const [query, setQuery] = useState('');

    const handleChange = (text) => {
        setQuery(text);
        if (text.trim() === '') {
            onClear();
        } else {
            onSearch(text);
        }
    };

    const handleClear = () => {
        setQuery('');
        onClear();
    };

    return (
        <View style={styles.container}>
            <MaterialIcons name="search" size={24} color="#999" style={styles.icon} />
            <TextInput
                style={styles.input}
                placeholder="Buscar (ej. 803, faces)..."
                placeholderTextColor="#999"
                value={query}
                onChangeText={handleChange}
            />
            {query.length > 0 && (
                <TouchableOpacity onPress={handleClear} style={styles.clearBtn} activeOpacity={0.7}>
                    <MaterialIcons name="close" size={20} color="#999" />
                </TouchableOpacity>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: 24,
        marginLeft: 12,
        paddingHorizontal: 16,
        height: 48,
        shadowColor: '#000',
        shadowOpacity: 0.15,
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 8,
        elevation: 5,
        // Borde suavizado opcional para darle ese feel premium
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.05)',
    },
    icon: {
        marginRight: 8,
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: '#333',
        height: '100%',
        paddingVertical: 0,
    },
    clearBtn: {
        padding: 4,
        marginLeft: 4,
    }
});
