import { StyleSheet, Platform, Dimensions } from 'react-native';

const { height } = Dimensions.get('window');

// Altura a la que sube el panel
export const DRAWER_HEIGHT = height * 0.75;

export const styles = StyleSheet.create({
    mobileContainer: {
        flex: 1,
        width: '100%',
        backgroundColor: '#e6dfd7',
        overflow: 'hidden',
    },
    mapContainer: {
        ...StyleSheet.absoluteFillObject,
    },
    fullImage: {
        width: '100%',
        height: '100%',
    },
    uiOverlay: {
        ...StyleSheet.absoluteFillObject,
        pointerEvents: 'box-none',
        justifyContent: 'flex-end',
    },
    menuPanel: {
        position: 'absolute',
        bottom: -DRAWER_HEIGHT, // Oculto hacia abajo inicialmente
        left: 0,
        right: 0,
        height: DRAWER_HEIGHT + 50, // Pequeño margen extra por si rebota
        backgroundColor: '#002B7F',
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        padding: 20,
        paddingTop: 10,
        elevation: 15,
        shadowColor: '#000',
        shadowOpacity: 0.4,
        shadowOffset: { width: 0, height: -5 },
        shadowRadius: 15,
        zIndex: 1000,
    },
    dragHandleContainer: {
        width: '100%',
        alignItems: 'center',
        paddingVertical: 10,
        marginBottom: 10,
    },
    dragHandle: {
        width: 50,
        height: 5,
        borderRadius: 3,
        backgroundColor: 'rgba(255,255,255,0.4)',
    },
    menuHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center', // Añadido para centrar el contenido horizontalmente
        marginBottom: 25,
        width: '100%', // Asegura que el contenedor ocupe todo el ancho para poder centrarse
    },
    headerLogo: {
        width: 60,
        height: 60,
        marginRight: 10, // Reducido ligeramente para que se vea más cohesionado al centrar
        resizeMode: 'contain',
    },
    headerText: {
        color: 'white',
        fontSize: 20,
        fontFamily: Platform.OS === 'ios' ? 'Helvetica Neue' : 'serif',
        letterSpacing: 1.2,
        fontWeight: 'bold',
        flexShrink: 1,
    },
    menuItems: {
        flex: 1,
        marginBottom: 20,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.05)',
        width: '100%',
    },
    menuItemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        paddingRight: 10,
    },
    menuIconContainer: {
        width: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    menuItemText: {
        color: 'white',
        fontSize: 16,
        marginLeft: 15,
        fontWeight: '500',
        flexShrink: 1,
    },
    bottomControls: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        paddingBottom: 20,
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
        backgroundColor: '#60A5FA',
    },
    toggleText: {
        color: 'white',
        marginLeft: 6,
        fontWeight: '500',
    },
    settingsButton: {
        padding: 10,
    },
});
