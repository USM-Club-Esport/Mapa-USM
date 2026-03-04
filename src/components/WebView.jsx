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

export default function WebView() {
    const [menuOpen, setMenuOpen] = useState(false);
    const slideAnim = useRef(new Animated.Value(0)).current;

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
