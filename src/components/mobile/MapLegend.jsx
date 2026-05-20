import { useRef, useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Animated, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

// ─────────────────────────────────────────────
// MapLegend: tarjeta de información del lugar
// seleccionado en el mapa.
//
// Props:
//   selectedMarker → objeto del marcador activo
//   onClose        → función para cerrar la tarjeta
//   onExpandChange → notifica cuando se expande o colapsa el texto
// ─────────────────────────────────────────────
export const MapLegend = ({ selectedMarker, onClose, onExpandChange }) => {
    // Estado para saber qué sección está expandida ('address', 'departments', o null)
    const [expandedSection, setExpandedSection] = useState(null);

    // Valores animados para la altura de cada sección expandible
    const addressAnim = useRef(new Animated.Value(0)).current;
    const departmentsAnim = useRef(new Animated.Value(0)).current;

    // Animación de entrada de la tarjeta completa (sube desde abajo)
    const cardAnim = useRef(new Animated.Value(60)).current;
    const fadeAnim = useRef(new Animated.Value(0)).current;

    // Cada vez que cambia el marcador, resetea las secciones y anima la entrada
    useEffect(() => {
        setExpandedSection(null);
        if (onExpandChange) onExpandChange(false);
        addressAnim.setValue(0);
        departmentsAnim.setValue(0);

        if (selectedMarker) {
            cardAnim.setValue(60);
            fadeAnim.setValue(0);
            Animated.parallel([
                Animated.timing(cardAnim, { toValue: 0, duration: 320, useNativeDriver: true }),
                Animated.timing(fadeAnim, { toValue: 1, duration: 320, useNativeDriver: true }),
            ]).start();
        }
    }, [selectedMarker]);

    // Abre/cierra las secciones con animación de altura
    useEffect(() => {
        Animated.parallel([
            Animated.timing(addressAnim, {
                toValue: expandedSection === 'address' ? 1 : 0,
                duration: 250,
                useNativeDriver: false, // false porque animamos maxHeight
            }),
            Animated.timing(departmentsAnim, {
                toValue: expandedSection === 'departments' ? 1 : 0,
                duration: 250,
                useNativeDriver: false,
            }),
        ]).start();
    }, [expandedSection]);

    // Alterna la sección tocada; si ya está abierta, la cierra
    const toggleSection = (section) => {
        setExpandedSection((prev) => {
            const next = prev === section ? null : section;

            // Comprobamos si la sección que vamos a abrir realmente tiene contenido
            let hasRealContent = false;
            if (next === 'address') {
                hasRealContent = selectedMarker?.address && selectedMarker?.address !== 'Por definir';
            } else if (next === 'departments') {
                hasRealContent = selectedMarker?.departments && selectedMarker?.departments.length > 0;
            }

            // Le decimos al mapa que suba *solo* si abrimos una sección y esta tiene datos
            if (onExpandChange) {
                onExpandChange(next !== null && hasRealContent);
            }

            return next;
        });
    };

    // Si no hay marcador seleccionado, no mostramos nada
    if (!selectedMarker) return null;

    const hasModules = selectedMarker.modules && selectedMarker.modules.length > 0;
    const hasAddress = selectedMarker.address && selectedMarker.address !== 'Por definir';
    const hasDepartments = selectedMarker.departments && selectedMarker.departments.length > 0;

    return (
        <Animated.View
            style={[
                styles.card,
                {
                    opacity: fadeAnim,
                    transform: [{ translateY: cardAnim }],
                },
            ]}
        >
            {/* ── ENCABEZADO: nombre del lugar + botón cerrar ── */}
            <View style={styles.header}>
                <View style={styles.headerIcon}>
                    <MaterialIcons name="place" size={20} color="#4CA1E7" />
                </View>
                <Text style={styles.title} numberOfLines={2}>
                    {selectedMarker.title}
                </Text>
                <TouchableOpacity onPress={onClose} activeOpacity={0.8} style={styles.closeBtn}>
                    <MaterialIcons name="close" size={18} color="rgba(255,255,255,0.7)" />
                </TouchableOpacity>
            </View>

            {/* ── SEPARADOR ── */}
            <View style={styles.divider} />

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scroll}
                nestedScrollEnabled={true}
            >
                {/* ── MÓDULOS como chips/pastillas ── */}
                {hasModules && (
                    <View style={styles.section}>
                        <View style={styles.sectionLabelRow}>
                            <MaterialIcons name="domain" size={16} color="#4CA1E7" />
                            <Text style={styles.sectionLabel}>Módulos</Text>
                        </View>
                        {/* Los módulos se muestran como pastillas horizontales */}
                        <View style={styles.chipsRow}>
                            {selectedMarker.modules.map((mod) => (
                                <View key={mod} style={styles.chip}>
                                    <Text style={styles.chipText}>Módulo {mod}</Text>
                                </View>
                            ))}
                        </View>
                    </View>
                )}

                {/* ── DIRECCIÓN expandible ── */}
                <TouchableOpacity
                    onPress={() => toggleSection('address')}
                    activeOpacity={0.75}
                    style={styles.expandRow}
                >
                    <View style={styles.expandLeft}>
                        <MaterialIcons name="location-on" size={16} color="#4CA1E7" />
                        <Text style={styles.sectionLabel}>Dirección</Text>
                    </View>
                    <MaterialIcons
                        name={expandedSection === 'address' ? 'keyboard-arrow-up' : 'keyboard-arrow-down'}
                        size={22}
                        color="#9DC6FF"
                    />
                </TouchableOpacity>
                {/* Contenido animado de la dirección */}
                <Animated.View
                    style={{
                        overflow: 'hidden',
                        maxHeight: addressAnim.interpolate({ inputRange: [0, 1], outputRange: [0, 120] }),
                        opacity: addressAnim,
                    }}
                >
                    <Text style={styles.expandContent}>
                        {hasAddress ? selectedMarker.address : 'Dirección no disponible aún.'}
                    </Text>
                </Animated.View>

                {/* ── DEPARTAMENTOS expandible ── */}
                <TouchableOpacity
                    onPress={() => toggleSection('departments')}
                    activeOpacity={0.75}
                    style={[styles.expandRow, { marginTop: 4 }]}
                >
                    <View style={styles.expandLeft}>
                        <MaterialIcons name="groups" size={16} color="#4CA1E7" />
                        <Text style={styles.sectionLabel}>Departamentos</Text>
                    </View>
                    <MaterialIcons
                        name={expandedSection === 'departments' ? 'keyboard-arrow-up' : 'keyboard-arrow-down'}
                        size={22}
                        color="#9DC6FF"
                    />
                </TouchableOpacity>
                {/* Contenido animado de los departamentos */}
                <Animated.View
                    style={{
                        overflow: 'hidden',
                        maxHeight: departmentsAnim.interpolate({ inputRange: [0, 1], outputRange: [0, 260] }),
                        opacity: departmentsAnim,
                    }}
                >
                    {hasDepartments ? (
                        selectedMarker.departments.map((dep, index) => (
                            // Cada departamento es una fila con un punto de color
                            <View key={index} style={styles.depRow}>
                                <View style={styles.depDot} />
                                <Text style={styles.depText}>{dep}</Text>
                            </View>
                        ))
                    ) : (
                        <Text style={styles.expandContent}>No hay departamentos disponibles.</Text>
                    )}
                </Animated.View>
            </ScrollView>
        </Animated.View>
    );
};

// ─────────────────────────────────────────────
// ESTILOS
// ─────────────────────────────────────────────
const styles = StyleSheet.create({
    // Tarjeta principal: posicionada en la parte inferior
    card: {
        position: 'absolute',
        left: 0, // sin margen → llega al borde izquierdo
        right: 0, // sin margen → llega al borde derecho
        bottom: 0, // pegada al fondo de la pantalla
        zIndex: 1200,
        maxHeight: '62%', // más alto para acomodar el texto grande
        borderRadius: 0,
        borderTopLeftRadius: 22,
        borderTopRightRadius: 22,
        backgroundColor: '#011E5A', // azul oscuro USM
        borderWidth: 1,
        borderColor: 'rgba(76, 161, 231, 0.25)', // borde azul claro suave
        shadowColor: '#000',
        shadowOpacity: 0.4,
        shadowOffset: { width: 0, height: 8 },
        shadowRadius: 12,
        elevation: 20,
        overflow: 'hidden',
    },

    // Encabezado con ícono, título y botón cerrar
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 18,
        paddingVertical: 16, // más espacio vertical en el header
    },
    headerIcon: {
        width: 38,
        height: 38,
        borderRadius: 10,
        backgroundColor: 'rgba(76, 161, 231, 0.15)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    },
    title: {
        flex: 1,
        color: 'white',
        fontSize: 19, // título más grande
        fontWeight: '700',
        letterSpacing: 0.3,
    },
    closeBtn: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: 'rgba(255,255,255,0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 8,
    },

    // Línea divisora entre header y contenido
    divider: {
        height: 1,
        backgroundColor: 'rgba(76, 161, 231, 0.2)',
        marginHorizontal: 14,
    },

    scroll: {
        paddingHorizontal: 18, // más margen interno
        paddingTop: 12,
        paddingBottom: 18,
    },

    // Sección genérica (usada para módulos)
    section: {
        marginBottom: 10,
    },
    sectionLabelRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    sectionLabel: {
        color: 'rgba(255,255,255,0.85)',
        fontSize: 16, // etiquetas de sección más grandes
        fontWeight: '600',
        marginLeft: 8,
        letterSpacing: 0.2,
    },

    // Pastillas/chips de módulos
    chipsRow: {
        flexDirection: 'row',
        flexWrap: 'wrap', // van a la línea siguiente si no caben
        gap: 8,
    },
    chip: {
        backgroundColor: 'rgba(76, 161, 231, 0.2)',
        borderRadius: 20,
        paddingHorizontal: 12,
        paddingVertical: 5,
        borderWidth: 1,
        borderColor: 'rgba(76, 161, 231, 0.4)',
    },
    chipText: {
        color: '#9DC6FF',
        fontSize: 15, // texto de módulos más grande
        fontWeight: '600',
    },

    // Fila expandible (dirección / departamentos)
    expandRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 14, // más espacio entre secciones
        borderTopWidth: 1,
        borderTopColor: 'rgba(255,255,255,0.07)',
    },
    expandLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    // Texto dentro de la sección expandida
    expandContent: {
        color: 'rgba(255,255,255,0.75)',
        fontSize: 15, // texto expandido más grande
        lineHeight: 24,
        paddingBottom: 12,
        paddingLeft: 6,
    },

    // Fila de cada departamento (punto + texto)
    depRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        paddingBottom: 6,
        paddingLeft: 4,
    },
    depDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#4CA1E7', // punto azul
        marginTop: 7,
        marginRight: 8,
    },
    depText: {
        flex: 1,
        color: 'rgba(255,255,255,0.8)',
        fontSize: 15, // texto de departamentos más grande
        lineHeight: 24,
    },
});
