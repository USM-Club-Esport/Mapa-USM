import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView, Animated, Platform, TouchableWithoutFeedback, BackHandler } from 'react-native';
import { useRef, useState, useEffect } from 'react';
import { MaterialIcons, FontAwesome5, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { styles, DRAWER_HEIGHT } from '../styles/MobileViewStyles';

const imgMap = "https://www.figma.com/api/mcp/asset/1d8b71c8-52a7-4067-8fa5-75d51b43247a";

// Mismo JSON de datos
const MENU_DATA = [
    { id: '1', title: 'Facultades', iconFamily: 'FontAwesome5', iconName: 'graduation-cap', size: 28 },
    { id: '2', title: 'Administración', iconFamily: 'FontAwesome5', iconName: 'university', size: 28 },
    { id: '3', title: 'Cafetería', iconFamily: 'MaterialIcons', iconName: 'local-cafe', size: 28 },
    { id: '4', title: 'Entretenimiento', iconFamily: 'Ionicons', iconName: 'dice', size: 28 },
    { id: '5', title: 'Médico', iconFamily: 'FontAwesome5', iconName: 'plus-square', size: 28 },
    { id: '6', title: 'Biblioteca', iconFamily: 'MaterialIcons', iconName: 'menu-book', size: 28 },
    { id: '7', title: 'Espacio de Eventos', iconFamily: 'MaterialIcons', iconName: 'stadium', size: 28 },
];

const FACULTIES_DATA = [
    { id: 'f1', title: 'Ciencias Económicas y Sociales', iconFamily: 'FontAwesome5', iconName: 'chart-line', size: 24 },
    { id: 'f2', title: 'Derecho', iconFamily: 'FontAwesome5', iconName: 'balance-scale', size: 24 },
    { id: 'f3', title: 'Estudios Internacionales', iconFamily: 'FontAwesome5', iconName: 'globe-americas', size: 24 },
    { id: 'f4', title: 'Ingeniería y Arquitectura', iconFamily: 'FontAwesome5', iconName: 'drafting-compass', size: 24 },
    { id: 'f5', title: 'Farmacia', iconFamily: 'FontAwesome5', iconName: 'prescription-bottle-alt', size: 24 },
];

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
        if (item.title === 'Facultades') {
            animateMenuTransition(() => {
                setSelectedCategory(item);
                setCurrentMenu('faculties');

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
                {menuOpen && (
                    <TouchableWithoutFeedback onPress={toggleMenu}>
                        <Animated.View style={[
                            StyleSheet.absoluteFillObject,
                            {
                                backgroundColor: 'rgba(0,0,0,0.3)',
                                zIndex: 40,
                                opacity: slideAnim // Se desvanece al unísono con el menú
                            }
                        ]} />
                    </TouchableWithoutFeedback>
                )}

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

                                {FACULTIES_DATA.map((item) => (
                                    <MenuItem key={item.id} item={item} onPress={() => console.log('Facultad:', item.title)} />
                                ))}
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
