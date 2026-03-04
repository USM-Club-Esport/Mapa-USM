import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView, Animated, Platform, TouchableWithoutFeedback } from 'react-native';
import { useRef, useState } from 'react';
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

const MenuItem = ({ item }) => (
    <TouchableOpacity style={styles.menuItem}>
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
    // Empezamos ocultos abajo del todo
    const slideAnim = useRef(new Animated.Value(0)).current;

    const toggleMenu = () => {
        const toValue = menuOpen ? 0 : 1;
        Animated.spring(slideAnim, {
            toValue,
            useNativeDriver: false, // height/bottom en layout no soportan driver nativo en React Native core
            friction: 7,
            tension: 40,
        }).start();
        setMenuOpen(!menuOpen);
    };

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
                        <Image
                            style={styles.headerLogo}
                            source={require('../assets/logousm/images.png')}
                            resizeMode="contain"
                        />
                        <Text style={styles.headerText}>MAPA USEMISTA</Text>
                    </View>

                    <ScrollView style={styles.menuItems} showsVerticalScrollIndicator={false}>
                        {MENU_DATA.map((item) => (
                            <MenuItem key={item.id} item={item} />
                        ))}
                    </ScrollView>

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
