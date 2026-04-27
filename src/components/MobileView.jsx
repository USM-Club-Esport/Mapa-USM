import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image, TouchableOpacity, Animated, Platform, TouchableWithoutFeedback, BackHandler, Alert } from 'react-native';
import { useRef, useState, useEffect, useMemo } from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { styles } from '../styles/MobileViewStyles';
import { MARKERS_DATA } from '../data/markersData';
import Map from './Map';

// Extracted Components & Utils
import { getRegionWithMostNodes } from '../utils/mapCalculations';
import { BottomControls } from './ui/BottomControls';
import { MapLegend } from './mobile/MapLegend';
import { SidebarMenu } from './mobile/SidebarMenu';
import { SearchBar } from './mobile/SearchBar';
import { CenterLocationButton } from './ui/CenterLocationButton';

export default function MobileView() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [currentMenu, setCurrentMenu] = useState('main');
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [activeMarkers, setActiveMarkers] = useState(MARKERS_DATA);
    const [selectedMarkerId, setSelectedMarkerId] = useState(null);
    const [selectedMarker, setSelectedMarker] = useState(null);
    const [isLegendExpanded, setIsLegendExpanded] = useState(false);
    const [userLocation, setUserLocation] = useState(null);
    const [hasLocationPermission, setHasLocationPermission] = useState(false);
    const [isFirstLocation, setIsFirstLocation] = useState(true);
    const [mapCenterTarget, setMapCenterTarget] = useState(null);

    const slideAnim = useRef(new Animated.Value(0)).current;
    const titleAnim = useRef(new Animated.Value(0)).current;
    const menuTransitionAnim = useRef(new Animated.Value(1)).current;
    const buttonScale = useRef(new Animated.Value(1)).current;

    const focusRegion = useMemo(() => {
        return getRegionWithMostNodes(activeMarkers);
    }, [activeMarkers]);

    const showAlert = () => {
        Alert.alert('Aún en desarrollo');
    };

    const handleButtonPressIn = () => {
        Animated.spring(buttonScale, {
            toValue: 0.94,
            useNativeDriver: false,
            friction: 5,
            tension: 40,
        }).start();
    };

    const handleButtonPressOut = () => {
        Animated.spring(buttonScale, {
            toValue: 1,
            useNativeDriver: false,
            friction: 5,
            tension: 40,
        }).start();
    };

    const selectMarker = (marker) => {
        if (!marker) {
            setSelectedMarkerId(null);
            setSelectedMarker(null);
            return;
        }
        setSelectedMarkerId(marker.id);
        setSelectedMarker(marker);
    };

    const clearSelectedMarker = () => {
        setSelectedMarkerId(null);
        setSelectedMarker(null);
        setActiveMarkers(MARKERS_DATA);
    };

    const toggleMenu = () => {
        const toValue = menuOpen ? 0 : 1;
        if (menuOpen) {
            setCurrentMenu('main');
            setSelectedCategory(null);
            menuTransitionAnim.setValue(1);
        } else {
            setCurrentMenu('main');
            setSelectedCategory(null);
            menuTransitionAnim.setValue(1);
            setSelectedMarkerId(null);
            setSelectedMarker(null);
            setActiveMarkers(MARKERS_DATA);
        }

        Animated.spring(slideAnim, {
            toValue,
            useNativeDriver: false,
            friction: 7,
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

                if (filtered.length === 1) selectMarker(filtered[0]);
                else {
                    setSelectedMarkerId(null);
                    setSelectedMarker(null);
                }

                titleAnim.setValue(0);
                Animated.timing(titleAnim, {
                    toValue: 1,
                    duration: 400,
                    useNativeDriver: true,
                    delay: 100
                }).start();
            });
        } else {
            const filtered = MARKERS_DATA.filter(m => m.categoryId === item.id);
            setActiveMarkers(filtered);

            if (filtered.length === 1) selectMarker(filtered[0]);
            else {
                setSelectedMarkerId(null);
                setSelectedMarker(null);
            }
            toggleMenu();
        }
    };

    const handleSubMenuPress = (item) => {
        const singleMarkerInfo = MARKERS_DATA.filter(m => m.subItemId === item.id);
        setActiveMarkers(singleMarkerInfo);

        if (singleMarkerInfo.length > 0) selectMarker(singleMarkerInfo[0]);
        else {
            setSelectedMarkerId(null);
            setSelectedMarker(null);
        }
        toggleMenu();
    };

    const handleBackToMain = () => {
        if (currentMenu !== 'main') {
            animateMenuTransition(() => {
                setCurrentMenu('main');
                setSelectedCategory(null);
                setActiveMarkers(MARKERS_DATA);
                setSelectedMarkerId(null);
                setSelectedMarker(null);
            });
        }
    };

    const handleSearch = (text) => {
        const query = text.toLowerCase().trim();
        if (!query) {
            handleClearSearch();
            return;
        }

        const firstDigitMatch = query.match(/\d/);
        const firstDigit = firstDigitMatch ? firstDigitMatch[0] : null;

        const filtered = MARKERS_DATA.filter(marker => {
            // Coincidencia con nombre del sitio
            if (marker.title && marker.title.toLowerCase().includes(query)) return true;
            
            // Coincidencia con nombre de departamentos
            if (marker.departments && marker.departments.some(dep => dep.toLowerCase().includes(query))) return true;

            // Coincidencia con primer dígito de un módulo
            if (firstDigit && marker.modules && marker.modules.includes(firstDigit)) return true;

            return false;
        });

        setActiveMarkers(filtered);
        
        if (filtered.length === 1) {
            selectMarker(filtered[0]);
        } else {
            setSelectedMarkerId(null);
            setSelectedMarker(null);
        }
    };

    const handleClearSearch = () => {
        if (currentMenu !== 'main' && selectedCategory) {
            const filtered = MARKERS_DATA.filter(m => m.categoryId === selectedCategory.id);
            setActiveMarkers(filtered);
        } else {
            setActiveMarkers(MARKERS_DATA);
        }
    };

    useEffect(() => {
        const backAction = () => {
            if (menuOpen) {
                if (currentMenu !== 'main') {
                    handleBackToMain();
                    return true;
                } else {
                    toggleMenu();
                    return true;
                }
            }
            return false;
        };

        const backHandler = BackHandler.addEventListener("hardwareBackPress", backAction);
        return () => backHandler.remove();
    }, [menuOpen, currentMenu]);

    const menuTranslateX = slideAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [-340, 0],
    });

    const buttonOpacity = slideAnim.interpolate({
        inputRange: [0, 0.5, 1],
        outputRange: [1, 0, 0],
    });

    return (
        <View style={styles.mobileContainer}>
            <View style={styles.mapContainer}>
                <Map
                    markers={activeMarkers}
                    focusRegion={focusRegion}
                    selectedMarkerId={selectedMarkerId}
                    isLegendExpanded={isLegendExpanded}
                    centerTarget={mapCenterTarget}
                    onMarkerPress={(marker) => selectMarker(marker)}
                    onUserLocationChange={(coords) => {
                        setUserLocation(coords);
                        if (isFirstLocation && coords) {
                            setMapCenterTarget({ ...coords, timestamp: Date.now() });
                            setIsFirstLocation(false);
                        }
                    }}
                    onUserPermissionChange={setHasLocationPermission}
                />
            </View>

            <View style={styles.uiOverlay} pointerEvents="box-none">
                <TouchableWithoutFeedback onPress={menuOpen ? toggleMenu : null}>
                    <Animated.View style={[
                        StyleSheet.absoluteFillObject,
                        {
                            backgroundColor: 'rgba(0,0,0,0.3)',
                            zIndex: 40,
                            opacity: slideAnim
                        }
                    ]} pointerEvents={menuOpen ? 'auto' : 'none'} />
                </TouchableWithoutFeedback>

                <Animated.View
                    style={[
                        {
                            opacity: buttonOpacity,
                            zIndex: 1300,
                            position: 'absolute',
                            top: 45,
                            left: 16,
                            right: 16,
                            height: 48,
                            flexDirection: 'row',
                            alignItems: 'center',
                        },
                    ]}
                    pointerEvents={menuOpen ? 'none' : 'auto'}
                >
                    <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
                        <TouchableOpacity
                            style={{
                                width: 48,
                                height: 48,
                                borderRadius: 24,
                                backgroundColor: 'white',
                                justifyContent: 'center',
                                alignItems: 'center',
                                shadowColor: '#000',
                                shadowOpacity: 0.15,
                                shadowOffset: { width: 0, height: 4 },
                                shadowRadius: 8,
                                elevation: 5,
                            }}
                            onPress={toggleMenu}
                            onPressIn={handleButtonPressIn}
                            onPressOut={handleButtonPressOut}
                            activeOpacity={0.85}
                        >
                            <MaterialIcons name="menu" size={28} color="rgba(2, 6, 18)" />
                        </TouchableOpacity>
                    </Animated.View>

                    <SearchBar onSearch={handleSearch} onClear={handleClearSearch} />
                </Animated.View>

                <MapLegend
                    selectedMarker={selectedMarker}
                    onClose={clearSelectedMarker}
                    onExpandChange={setIsLegendExpanded}
                />

                <CenterLocationButton
                    isActive={!!userLocation && hasLocationPermission}
                    onPress={() => {
                        if (userLocation) {
                            setMapCenterTarget({ ...userLocation, timestamp: Date.now() });
                        }
                    }}
                />

                <Animated.View
                    style={[
                        styles.menuPanel,
                        {
                            top: 70,
                            bottom: 20,
                            left: 0,
                            right: undefined,
                            width: '82%',
                            height: undefined,
                            borderTopRightRadius: 25,
                            borderTopLeftRadius: 0,
                            borderBottomRightRadius: 25,
                            borderBottomLeftRadius: 0,
                            transform: [{ translateX: menuTranslateX }],
                        },
                    ]}
                    pointerEvents={menuOpen ? 'auto' : 'none'}
                >
                    <TouchableOpacity
                        onPress={toggleMenu}
                        activeOpacity={0.8}
                        style={{ position: 'absolute', top: 14, right: 14, zIndex: 20 }}
                    >
                        <MaterialIcons name="close" size={24} color="white" />
                    </TouchableOpacity>

                    <View style={styles.menuHeader}>
                        {currentMenu !== 'main' && (
                            <TouchableOpacity
                                style={{ position: 'absolute', left: -10, top: 18, zIndex: 10, padding: 10 }}
                                onPress={handleBackToMain}
                                activeOpacity={0.8}
                            >
                                <MaterialIcons name="arrow-back" size={28} color="white" />
                            </TouchableOpacity>
                        )}
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
                        style={{ position: 'absolute', bottom: 24, left: 20, right: 20, zIndex: 1000 }}
                    />
                </Animated.View>
            </View>
            <StatusBar style="auto" />
        </View>
    );
}
