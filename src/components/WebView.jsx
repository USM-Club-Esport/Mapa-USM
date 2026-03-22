import { StatusBar } from 'expo-status-bar';
import { Text, View, Image, TouchableOpacity, Animated, ScrollView, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import { styles } from '../styles/WebViewStyles';
import { useRef, useState } from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { MENU_DATA, FACULTIES_DATA, CAFETERIA_DATA, ENTERTAINMENT_DATA } from '../data/menuData';
import { MARKERS_DATA } from '../data/markersData';
import Map from './Map';

// Extracted UI Components
import { MenuItem } from './ui/MenuItem';
import { BottomControls } from './ui/BottomControls';
import { SidebarMenu } from './mobile/SidebarMenu'; // We share this with the mobile side exactly!

export default function WebView() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [currentMenu, setCurrentMenu] = useState('main'); // 'main' | 'faculties'
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [activeMarkers, setActiveMarkers] = useState(MARKERS_DATA);
    
    const slideAnim = useRef(new Animated.Value(0)).current;
    const titleAnim = useRef(new Animated.Value(0)).current;
    const menuTransitionAnim = useRef(new Animated.Value(1)).current;

    const toggleMenu = () => {
        const toValue = menuOpen ? 0 : 1;

        if (menuOpen) {
            setCurrentMenu('main');
            setSelectedCategory(null);
            menuTransitionAnim.setValue(1);
            setActiveMarkers(MARKERS_DATA);
        }

        Animated.spring(slideAnim, {
            toValue,
            useNativeDriver: false,
            friction: 8,
            tension: 40,
        }).start();
        setMenuOpen(!menuOpen);
    };

    const animateMenuTransition = (callback) => {
        Animated.timing(menuTransitionAnim, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
        }).start(() => {
            callback();
            Animated.timing(menuTransitionAnim, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
            }).start();
        });
    };

    const handleMenuPress = (item) => {
        if (item.title === 'Facultades' || item.title === 'Cafetería' || item.title === 'Entretenimiento') {
            animateMenuTransition(() => {
                setSelectedCategory(item);

                if (item.title === 'Facultades') setCurrentMenu('faculties');
                else if (item.title === 'Cafetería') setCurrentMenu('cafeteria');
                else if (item.title === 'Entretenimiento') setCurrentMenu('entertainment');

                const filtered = MARKERS_DATA.filter(m => m.categoryId === item.id);
                setActiveMarkers(filtered);

                titleAnim.setValue(0);
                Animated.timing(titleAnim, {
                    toValue: 1,
                    duration: 400,
                    useNativeDriver: true,
                    delay: 100
                }).start();
            });
        } else {
            console.log('Selected Main Item:', item.title);
            const filtered = MARKERS_DATA.filter(m => m.categoryId === item.id);
            setActiveMarkers(filtered);
            toggleMenu(); 
        }
    };

    const handleSubMenuPress = (item) => {
        console.log('Submenu selected:', item.title);
        const singleMarkerInfo = MARKERS_DATA.filter(m => m.subItemId === item.id);
        setActiveMarkers(singleMarkerInfo);
        toggleMenu(); 
    };

    const handleBackToMain = () => {
        animateMenuTransition(() => {
            setCurrentMenu('main');
            setSelectedCategory(null);
            setActiveMarkers(MARKERS_DATA); 
        });
    };

    const menuTranslateX = slideAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [330, -30], 
    });

    const showAlert = () => {
        alert('Aún en desarrollo');
    };

    return (
        <View style={styles.webContainer}>
            <View style={styles.mapContainer}>
                <Map markers={activeMarkers} />
            </View>

            <View style={styles.uiOverlay} pointerEvents="box-none">
                <TouchableWithoutFeedback onPress={menuOpen ? toggleMenu : null}>
                    <Animated.View style={[
                        StyleSheet.absoluteFillObject,
                        {
                            zIndex: 40,
                            backgroundColor: 'rgba(0,0,0,0.1)',
                            opacity: slideAnim,
                        }
                    ]} pointerEvents={menuOpen ? 'auto' : 'none'} />
                </TouchableWithoutFeedback>

                <Animated.View style={[styles.menuPanel, { transform: [{ translateX: menuTranslateX }] }]}>

                    <TouchableOpacity style={styles.mapButton} onPress={toggleMenu} activeOpacity={0.8}>
                        <MaterialIcons name="location-on" size={38} color="#002B7F" />
                    </TouchableOpacity>

                    {currentMenu !== 'main' && (
                        <TouchableOpacity
                            style={[
                                styles.mapButton,
                                {
                                    top: 160,
                                    bottom: undefined,
                                    width: 50,
                                    height: 50,
                                    borderRadius: 25,
                                    left: -25
                                }
                            ]}
                            onPress={handleBackToMain}
                            activeOpacity={0.8}
                        >
                            <MaterialIcons name="arrow-back" size={24} color="#002B7F" />
                        </TouchableOpacity>
                    )}

                    <View style={styles.menuHeader}>
                        <Image
                            style={styles.headerLogo}
                            source={require('../assets/logousm/images.png')}
                            resizeMode="contain"
                        />
                        <Text style={styles.headerText}>MAPA USEMISTA</Text>
                    </View>

                    <SidebarMenu 
                        currentMenu={currentMenu}
                        selectedCategory={selectedCategory}
                        menuTransitionAnim={menuTransitionAnim}
                        titleAnim={titleAnim}
                        onMenuItemSelect={handleMenuPress}
                        onSubMenuItemSelect={handleSubMenuPress}
                    />

                    <BottomControls 
                        on3DPress={showAlert} 
                        onSettingsPress={showAlert} 
                        style={{ marginTop: 30, marginBottom: 10 }}
                    />

                </Animated.View>
            </View>

            <StatusBar style="auto" />
        </View>
    );
}
