import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView, Animated, Platform, TouchableWithoutFeedback, BackHandler } from 'react-native';
import { useRef, useState, useEffect } from 'react';
import { MaterialIcons, FontAwesome5, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { styles, DRAWER_HEIGHT } from '../styles/MobileViewStyles';
import { MENU_DATA, FACULTIES_DATA, CAFETERIA_DATA, ENTERTAINMENT_DATA } from '../data/menuData';

const imgMap = "https://www.figma.com/api/mcp/asset/1d8b71c8-52a7-4067-8fa5-75d51b43247a";

const renderIcon = (family, name, size) => {
    switch (family) {
        case 'FontAwesome5': return <FontAwesome5 name={name} size={size} color="white" />;
        case 'Ionicons': return <Ionicons name={name} size={size} color="white" />;
        case 'MaterialCommunityIcons': return <MaterialCommunityIcons name={name} size={size} color="white" />;
        case 'MaterialIcons':
        default:
            return <MaterialIcons name={name} size={size} color="white" />;
    }
};

const MenuItem = ({ item, onPress }) => (
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

export default function MobileView() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [currentMenu, setCurrentMenu] = useState('main'); // 'main' | 'faculties'
    const [selectedCategory, setSelectedCategory] = useState(null);

    // Empezamos ocultos abajo del todo
    const slideAnim = useRef(new Animated.Value(0)).current;

    // Animación para el título de la categoría
    const titleAnim = useRef(new Animated.Value(0)).current;

    // Animación de transición entre menús (fade/slide)
    const menuTransitionAnim = useRef(new Animated.Value(1)).current;

    const toggleMenu = () => {
        const toValue = menuOpen ? 0 : 1;
        if (menuOpen) {
            handleBackToMain(); // Si cerramos el menú, reseteamos el estado interno al principal
        } else {
            setCurrentMenu('main');
            setSelectedCategory(null);
            menuTransitionAnim.setValue(1);
        }

        Animated.spring(slideAnim, {
            toValue,
            useNativeDriver: false, // height/bottom en layout no soportan driver nativo en React Native core
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

                if (item.title === 'Facultades') {
                    setCurrentMenu('faculties');
                } else if (item.title === 'Cafetería') {
                    setCurrentMenu('cafeteria');
                } else if (item.title === 'Entretenimiento') {
                    setCurrentMenu('entertainment');
                }

                // Iniciar animación del título
                titleAnim.setValue(0);
                Animated.timing(titleAnim, {
                    toValue: 1,
                    duration: 400,
                    useNativeDriver: true,
                    delay: 100 // Un pequeño delay para que entre después del fade in general
                }).start();
            });
        } else {
            console.log('Selected:', item.title);
            // Aquí iría la lógica de navegación futura
        }
    };

    const handleBackToMain = () => {
        if (currentMenu !== 'main') {
            animateMenuTransition(() => {
                setCurrentMenu('main');
                setSelectedCategory(null);
            });
        }
    };

    // Hardware Back Button logic (Android)
    useEffect(() => {
        const backAction = () => {
            if (menuOpen) {
                if (currentMenu !== 'main') {
                    handleBackToMain();
                    return true; // Previene comportamiento default (salir de app)
                } else {
                    toggleMenu(); // Cierra el menú en vez de salir de app
                    return true;
                }
            }
            return false; // Deja que Android decida si cerrar app o volver atrás (fuera del mapa)
        };

        const backHandler = BackHandler.addEventListener(
            "hardwareBackPress",
            backAction
        );

        return () => backHandler.remove();
    }, [menuOpen, currentMenu]);

    // Interpolamos de 0 a 1. 0 = abajo (escondido), 1 = arriba (mostrado DRAWER_HEIGHT)
    const menuBottom = slideAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [-DRAWER_HEIGHT, 0],
    });

    // Desvanece el botón del mapa cuando se abre el menú
    const buttonOpacity = slideAnim.interpolate({
        inputRange: [0, 0.5, 1],
        outputRange: [1, 0, 0],
    });

    return (
        <View style={styles.mobileContainer}>
            <View style={styles.mapContainer}>
                <Image
                    style={styles.fullImage}
                    source={{ uri: imgMap }}
                    resizeMode="cover"
                />
            </View>

            <View style={styles.uiOverlay} pointerEvents="box-none">

                {/* Fondo oscuro para cerrar al hacer tap fuera */}
                <TouchableWithoutFeedback onPress={menuOpen ? toggleMenu : null}>
                    <Animated.View style={[
                        StyleSheet.absoluteFillObject,
                        {
                            backgroundColor: 'rgba(0,0,0,0.3)',
                            zIndex: 40,
                            opacity: slideAnim // Se desvanece al unísono con el menú
                        }
                    ]} pointerEvents={menuOpen ? 'auto' : 'none'} />
                </TouchableWithoutFeedback>

                {/* Botón flotante para abrir menú móvil (desaparece al abrir) */}
                <Animated.View style={{ opacity: buttonOpacity, zIndex: 50, position: 'absolute', bottom: 40, right: 20 }} pointerEvents={menuOpen ? 'none' : 'auto'}>
                    <TouchableOpacity style={styles.mapButton} onPress={toggleMenu} activeOpacity={0.8}>
                        <MaterialIcons name="menu" size={30} color="white" />
                    </TouchableOpacity>
                </Animated.View>

                {/* Bottom Sheet Animado */}
                <Animated.View style={[styles.menuPanel, { bottom: menuBottom }]}>

                    {/* Indicador de arrastre estilo iOS/Android para cerrar/abrir */}
                    <TouchableOpacity style={styles.dragHandleContainer} onPress={toggleMenu} activeOpacity={0.8}>
                        <View style={styles.dragHandle} />
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

                    <Animated.ScrollView
                        style={[styles.menuItems, {
                            opacity: menuTransitionAnim,
                            transform: [{
                                translateX: menuTransitionAnim.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [20, 0] // Pequeño desplazamiento al aparecer
                                })
                            }]
                        }]}
                        showsVerticalScrollIndicator={false}
                    >
                        {currentMenu === 'main' ? (
                            MENU_DATA.map((item) => (
                                <MenuItem key={item.id} item={item} onPress={() => handleMenuPress(item)} />
                            ))
                        ) : (
                            <View style={{ width: '100%' }}>
                                {/* Title Header */}
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
                                        <MenuItem key={item.id} item={item} onPress={() => console.log('Submenu:', item.title)} />
                                    ));
                                })()}
                            </View>
                        )}
                    </Animated.ScrollView>

                    <View style={styles.bottomControls}>
                        <View style={styles.toggleContainer}>
                            <TouchableOpacity style={[styles.toggleButton, styles.toggleActive]}>
                                <MaterialCommunityIcons name="office-building-outline" size={24} color="white" />
                                <Text style={styles.toggleText}>2D</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.toggleButton}>
                                <MaterialCommunityIcons name="cube-outline" size={24} color="white" />
                                <Text style={styles.toggleText}>3D</Text>
                            </TouchableOpacity>
                        </View>
                        <TouchableOpacity style={styles.settingsButton}>
                            <Ionicons name="settings-sharp" size={28} color="white" />
                        </TouchableOpacity>
                    </View>
                </Animated.View>

            </View>

            <StatusBar style="auto" />
        </View>
    );
}
