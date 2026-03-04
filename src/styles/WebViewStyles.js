import { StyleSheet, Platform } from 'react-native';

export const styles = StyleSheet.create({
    webContainer: {
        flex: 1,
        width: '100%',
        height: '100vh',
        overflow: 'hidden',
        backgroundColor: '#e6dfd7', // Color de fondo base mientras carga el mapa
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
        right: -40,
        top: 0,
        bottom: 0,
        width: 420,
        maxWidth: '100%', // Garantiza que no se desborde la pantalla en monitores chicos
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
        marginBottom: 10,
        marginTop: 0,
        width: '100%',
    },
    headerLogo: {
        width: 90,
        height: 90,
        marginRight: 15,
        resizeMode: 'contain',
    },
    headerText: {
        color: 'white',
        fontSize: Platform.OS === 'web' ? 'clamp(18px, 1.5vw, 22px)' : 22, // Tipografía fluida y responsiva
        fontFamily: Platform.OS === 'ios' ? 'Helvetica Neue' : 'serif',
        letterSpacing: 1.5,
        fontWeight: 'bold',
        flexShrink: 1, // Evita que se salga del contenedor si la pantalla es muy pequeña
    },
    menuItems: {
        flex: 1,
        marginBottom: 20, // Espacio antes de los botones fijos inferiores
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.05)',
        width: '100%',
    },
    menuItemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1, // Permite ocupar el espacio y empujar la flecha a la derecha
        paddingRight: 10,
    },
    menuIconContainer: {
        width: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    menuItemText: {
        color: 'white',
        fontSize: Platform.OS === 'web' ? 'clamp(16px, 1.2vw, 18px)' : 18,
        marginLeft: 15,
        fontWeight: '500',
        flexShrink: 1, // Permite que el texto se trunque amigablemente sin deformar el panel
    },
    bottomControls: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 'auto',
        marginBottom: 10,
        width: '100%',
        flexWrap: 'wrap', // Si la pantalla se achica, los botones inferiores se acomodan
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
