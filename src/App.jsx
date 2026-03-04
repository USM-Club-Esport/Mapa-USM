import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Platform, Image, TouchableOpacity, useWindowDimensions, Animated } from 'react-native';
import { useRef, useState } from 'react';
import { MaterialIcons, FontAwesome5, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

const imgMap = "https://www.figma.com/api/mcp/asset/1d8b71c8-52a7-4067-8fa5-75d51b43247a";

export default function App() {
  const { width } = useWindowDimensions();
  const isMobileView = Platform.OS !== 'web' || width < 768; // Consideramos móvil a la app nativa o a la web en pantallas pequeñas
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
    outputRange: [300, -30], // slide out width
  });

  if (isMobileView) {
    return (
      <View style={styles.mobileContainer}>
        <Text style={styles.mobileText}>Aquí iría la página de teléfono</Text>
        <StatusBar style="auto" />
      </View>
    );
  }

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
            <MaterialCommunityIcons name="map-marker-path" size={24} color="white" style={styles.headerIcon} />
            <Text style={styles.headerText}>MAPA USEMISTA</Text>
          </View>

          <View style={styles.menuItems}>
            <MenuItem icon={<FontAwesome5 name="graduation-cap" size={20} color="white" />} text="Facultades" />
            <MenuItem icon={<FontAwesome5 name="university" size={20} color="white" />} text="Administración" />
            <MenuItem icon={<MaterialIcons name="local-cafe" size={24} color="white" />} text="Cafetería" />
            <MenuItem icon={<Ionicons name="dice" size={24} color="white" />} text="Entretenimiento" />
            <MenuItem icon={<FontAwesome5 name="plus-square" size={24} color="white" />} text="Médico" />
            <MenuItem icon={<MaterialIcons name="menu-book" size={24} color="white" />} text="Biblioteca" />
            <MenuItem icon={<MaterialIcons name="stadium" size={24} color="white" />} text="Espacio de Eventos" />
          </View>

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

const MenuItem = ({ icon, text }) => (
  <TouchableOpacity style={styles.menuItem}>
    <View style={styles.menuItemLeft}>
      <View style={styles.menuIconContainer}>{icon}</View>
      <Text style={styles.menuItemText}>{text}</Text>
    </View>
    <MaterialIcons name="chevron-right" size={24} color="#88aadd" />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  mobileContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mobileText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#333',
  },
  webContainer: {
    flex: 1,
    width: '100%',
    height: '100vh',
    overflow: 'hidden',
    backgroundColor: '#fff',
  },
  mapContainer: {
    ...StyleSheet.absoluteFillObject,
  },
  uiOverlay: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    pointerEvents: 'box-none',
  },
  menuPanel: {
    position: 'absolute',
    right: -50,
    top: 0,
    bottom: 0,
    width: 400,
    backgroundColor: '#002B7F',
    borderRadius: 15,
    padding: 30,
    elevation: 8,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowOffset: { width: -3, height: 0 },
    shadowRadius: 10,
    borderWidth: 1,
    borderColor: '#4CA1E7',
    zIndex: 1000,
    paddingLeft: 60,
  },
  menuHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 40,
    marginTop: 20,
  },
  headerIcon: {
    marginRight: 15,
  },
  headerText: {
    color: 'white',
    fontSize: 18,
    fontFamily: Platform.OS === 'ios' ? 'San Francisco' : 'Roboto',
    letterSpacing: 1,
  },
  menuItems: {
    flex: 1,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuIconContainer: {
    width: 40,
    alignItems: 'center',
  },
  menuItemText: {
    color: 'white',
    fontSize: 16,
    marginLeft: 15,
  },
  bottomControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 'auto',
    marginBottom: 10,
  },
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  toggleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  toggleActive: {
    backgroundColor: '#60A5FA', // Light blue active state
  },
  toggleText: {
    color: 'white',
    marginLeft: 6,
    fontWeight: '500',
  },
  settingsButton: {
    padding: 10,
  },
  mapButton: {
    position: 'absolute',
    left: -35,
    bottom: 40,
    width: 70,
    height: 70,
    zIndex: 10,
    backgroundColor: 'white',
    borderRadius: 35,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowOffset: { width: -2, height: 2 },
    shadowRadius: 6,
  },
  fullImage: {
    width: '100%',
    height: '100%',
  },
});
