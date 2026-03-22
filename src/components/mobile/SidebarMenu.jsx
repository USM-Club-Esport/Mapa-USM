import React from 'react';
import { View, Text, TouchableOpacity, Animated, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { MenuItem } from '../ui/MenuItem';
import { renderIcon } from '../../data/iconUtils';
import { MENU_DATA, FACULTIES_DATA, CAFETERIA_DATA, ENTERTAINMENT_DATA } from '../../data/menuData';

export const SidebarMenu = ({
    currentMenu,
    selectedCategory,
    menuTransitionAnim,
    titleAnim,
    onMenuItemSelect,
    onSubMenuItemSelect
}) => {
    return (
        <Animated.ScrollView
            style={[styles.menuItems, {
                opacity: menuTransitionAnim,
                transform: [{
                    translateX: menuTransitionAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [20, 0]
                    })
                }]
            }]}
            showsVerticalScrollIndicator={false}
        >
            {currentMenu === 'main' ? (
                MENU_DATA.map((item) => (
                    <MenuItem key={item.id} item={item} onPress={() => onMenuItemSelect(item)} />
                ))
            ) : (
                <View style={{ width: '100%' }}>
                    {selectedCategory && (
                        <Animated.View style={{
                            alignItems: 'center',
                            marginBottom: 20,
                            opacity: titleAnim,
                            transform: [
                                { translateY: titleAnim.interpolate({ inputRange: [0, 1], outputRange: [-20, 0] }) }
                            ]
                        }}>
                            {renderIcon(selectedCategory.iconFamily, selectedCategory.iconName, 40)}
                            <Text style={{
                                color: 'white',
                                fontSize: 22,
                                fontWeight: 'bold',
                                marginTop: 8,
                                marginBottom: 5
                            }}>
                                {selectedCategory.title}
                            </Text>
                            <View style={{ height: 2, width: 40, backgroundColor: '#4CA1E7', borderRadius: 1 }} />
                        </Animated.View>
                    )}

                    {(() => {
                        let data = [];
                        if (currentMenu === 'faculties') data = FACULTIES_DATA;
                        else if (currentMenu === 'cafeteria') data = CAFETERIA_DATA;
                        else if (currentMenu === 'entertainment') data = ENTERTAINMENT_DATA;

                        return data.map((item) => (
                            <MenuItem key={item.id} item={item} onPress={() => onSubMenuItemSelect(item)} />
                        ));
                    })()}
                </View>
            )}
        </Animated.ScrollView>
    );
};

const styles = StyleSheet.create({
    menuItems: {
        flex: 1,
        paddingHorizontal: 20,
    }
});
