import { StatusBar } from 'expo-status-bar';
import { Text, View, Image, TouchableOpacity, Animated, ScrollView } from 'react-native';
import { styles } from '../styles/WebViewStyles';
import { useRef, useState } from 'react';
import { MaterialIcons, FontAwesome5, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

const imgMap = "https://www.figma.com/api/mcp/asset/1d8b71c8-52a7-4067-8fa5-75d51b43247a";

// Este JSON simula lo que vendría de tu base de datos en el futuro
const MENU_DATA = [
    { id: '1', title: 'Facultades', iconFamily: 'FontAwesome5', iconName: 'graduation-cap', size: 28 },
    { id: '2', title: 'Administración', iconFamily: 'FontAwesome5', iconName: 'university', size: 28 },
    { id: '3', title: 'Cafetería', iconFamily: 'MaterialIcons', iconName: 'local-cafe', size: 28 },
    { id: '4', title: 'Entretenimiento', iconFamily: 'Ionicons', iconName: 'dice', size: 28 },
    { id: '5', title: 'Médico', iconFamily: 'FontAwesome5', iconName: 'plus-square', size: 28 },
    { id: '6', title: 'Biblioteca', iconFamily: 'MaterialIcons', iconName: 'menu-book', size: 28 },
    { id: '7', title: 'Espacio de Eventos', iconFamily: 'MaterialIcons', iconName: 'stadium', size: 28 },
];

// Helper para renderizar el icono correcto según la familia
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

const FACULTIES_DATA = [
    { id: 'f1', title: 'Ciencias Económicas y Sociales', iconFamily: 'FontAwesome5', iconName: 'chart-line', size: 24 },
    { id: 'f2', title: 'Derecho', iconFamily: 'FontAwesome5', iconName: 'balance-scale', size: 24 },
    { id: 'f3', title: 'Estudios Internacionales', iconFamily: 'FontAwesome5', iconName: 'globe-americas', size: 24 },
    { id: 'f4', title: 'Ingeniería y Arquitectura', iconFamily: 'FontAwesome5', iconName: 'drafting-compass', size: 24 },
    { id: 'f5', title: 'Farmacia', iconFamily: 'FontAwesome5', iconName: 'prescription-bottle-alt', size: 24 },
];

const CAFETERIA_DATA = [
    { id: 'c1', title: 'Mesas Verdes', iconFamily: 'MaterialCommunityIcons', iconName: 'table-furniture', size: 24 },
    { id: 'c2', title: 'Pobretin', iconFamily: 'Ionicons', iconName: 'fast-food-outline', size: 24 },
    { id: 'c3', title: 'Poma', iconFamily: 'Ionicons', iconName: 'pizza-outline', size: 24 },
    { id: 'c4', title: 'Feria', iconFamily: 'MaterialIcons', iconName: 'storefront', size: 24 },
    { id: 'c5', title: 'Corner', iconFamily: 'MaterialCommunityIcons', iconName: 'coffee-outline', size: 24 },
    { id: 'c6', title: 'Usemito', iconFamily: 'MaterialCommunityIcons', iconName: 'ice-cream', size: 24 },
];

const ENTERTAINMENT_DATA = [
    { id: 'e1', title: 'Canchas', iconFamily: 'MaterialIcons', iconName: 'sports-soccer', size: 24 },
    { id: 'e2', title: 'Padelvomito y Pickenosequecosa', iconFamily: 'MaterialCommunityIcons', iconName: 'tennis', size: 24 },
    { id: 'e3', title: 'Mesas Ping Pong', iconFamily: 'MaterialCommunityIcons', iconName: 'table-tennis', size: 24 },
];

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

export default function WebView() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [currentMenu, setCurrentMenu] = useState('main'); // 'main' | 'faculties'
    const [selectedCategory, setSelectedCategory] = useState(null);
    const slideAnim = useRef(new Animated.Value(0)).current;
    
    // Animación para el título de la categoría
    const titleAnim = useRef(new Animated.Value(0)).current;
    
    // Animación de transición entre menús (fade/slide)
    const menuTransitionAnim = useRef(new Animated.Value(1)).current;

    const toggleMenu = () => {
        const toValue = menuOpen ? 0 : 1;
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
        animateMenuTransition(() => {
            setCurrentMenu('main');
            setSelectedCategory(null);
        });
    };

    const menuTranslateX = slideAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [330, -30], // slide out width
    });

    return (
        <View style={styles.webContainer}>
            <View style={styles.mapContainer}>
                <Image
                    style={styles.fullImage}
                    source={{ uri: imgMap }}
                    resizeMode="cover"
                />
            </View>

            <View style={styles.uiOverlay} pointerEvents="box-none">

                {/* Animated Menu Panel */}
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
