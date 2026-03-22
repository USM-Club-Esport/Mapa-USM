import React, { useRef, useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Animated } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

export const MapLegend = ({ selectedMarker, onClose }) => {
    const [expandedSection, setExpandedSection] = useState(null);
    const addressAnim = useRef(new Animated.Value(0)).current;
    const departmentsAnim = useRef(new Animated.Value(0)).current;

    const toggleSection = (section) => {
        setExpandedSection(expandedSection === section ? null : section);
    };

    useEffect(() => {
        Animated.parallel([
            Animated.timing(addressAnim, {
                toValue: expandedSection === 'address' ? 1 : 0,
                duration: 260,
                useNativeDriver: false,
            }),
            Animated.timing(departmentsAnim, {
                toValue: expandedSection === 'departments' ? 1 : 0,
                duration: 260,
                useNativeDriver: false,
            }),
        ]).start();
    }, [expandedSection]);

    if (!selectedMarker) return null;

    return (
        <>
            <View style={{
                position: 'absolute', top: 40, left: 96, right: 12, zIndex: 1200,
                borderRadius: 12, overflow: 'hidden', backgroundColor: '#002B7F',
                borderWidth: 1, borderColor: 'rgba(255,255,255,0.18)', flexDirection: 'row',
                alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 14, paddingVertical: 10,
            }}>
                <Text style={{ color: 'white', fontWeight: '700', fontSize: 15, flex: 1, paddingRight: 8, textAlign: 'center' }}>
                    {selectedMarker.title}
                </Text>
                <TouchableOpacity onPress={onClose} activeOpacity={0.8} style={{
                    width: 30, height: 30, borderRadius: 15, backgroundColor: 'rgba(255,255,255,0.16)',
                    justifyContent: 'center', alignItems: 'center',
                }}>
                    <MaterialIcons name="close" size={18} color="white" />
                </TouchableOpacity>
            </View>

            <Animated.View style={{
                position: 'absolute', left: 12, right: 12, bottom: 24, zIndex: 1200,
                maxHeight: '55%', borderRadius: 14, backgroundColor: '#012564',
                borderWidth: 1, borderColor: 'rgba(255,255,255,0.15)', elevation: 18,
                shadowColor: '#000', shadowOpacity: 0.35, shadowOffset: { width: 0, height: 8 }, shadowRadius: 10,
            }}>
                {(selectedMarker.modules || []).length > 0 && (
                    <View style={{ position: 'absolute', top: -40, right: 0, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8, backgroundColor: 'rgba(0,0,0,0.65)' }}>
                        <Text style={{ color: 'white', fontWeight: '800', fontSize: 20, letterSpacing: 0.5 }}>
                            {`Modulos: ${(selectedMarker.modules || []).join(', ')}`}
                        </Text>
                    </View>
                )}
                <ScrollView showsVerticalScrollIndicator={true} nestedScrollEnabled={true} contentContainerStyle={{ paddingBottom: 12 }}>
                    
                    <TouchableOpacity onPress={() => toggleSection('address')} activeOpacity={0.75} style={{
                        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 14, paddingVertical: 12,
                        borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.08)', backgroundColor: '#012564',
                    }}>
                        <Text style={{ color: 'white', fontWeight: '600', fontSize: 15 }}>Direccion</Text>
                        <MaterialIcons name={expandedSection === 'address' ? 'keyboard-arrow-up' : 'keyboard-arrow-down'} size={24} color="#9DC6FF" />
                    </TouchableOpacity>
                    <Animated.View style={{ overflow: 'hidden', backgroundColor: '#012564', maxHeight: addressAnim.interpolate({ inputRange: [0, 1], outputRange: [0, 140] }), opacity: addressAnim }}>
                        <View style={{ paddingHorizontal: 14, paddingBottom: 14 }}>
                            <Text style={{ color: 'white', opacity: 0.92, lineHeight: 20 }}>{selectedMarker.address || 'Direccion no disponible'}</Text>
                        </View>
                    </Animated.View>

                    <TouchableOpacity onPress={() => toggleSection('departments')} activeOpacity={0.75} style={{
                        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 14, paddingVertical: 12,
                        borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.08)', backgroundColor: '#012564',
                    }}>
                        <Text style={{ color: 'white', fontWeight: '600', fontSize: 15 }}>Departamentos</Text>
                        <MaterialIcons name={expandedSection === 'departments' ? 'keyboard-arrow-up' : 'keyboard-arrow-down'} size={24} color="#9DC6FF" />
                    </TouchableOpacity>
                    <Animated.View style={{ overflow: 'hidden', backgroundColor: '#012564', maxHeight: departmentsAnim.interpolate({ inputRange: [0, 1], outputRange: [0, 240] }), opacity: departmentsAnim }}>
                        <View style={{ paddingHorizontal: 14, paddingBottom: 14 }}>
                            {(selectedMarker.departments || []).length > 0 ? (
                                (selectedMarker.departments || []).map((department) => (
                                    <Text key={department} style={{ color: 'white', opacity: 0.92, lineHeight: 22 }}>- {department}</Text>
                                ))
                            ) : (
                                <Text style={{ color: 'rgba(255,255,255,0.6)', fontSize: 14 }}>No hay departamentos disponibles</Text>
                            )}
                        </View>
                    </Animated.View>
                </ScrollView>
            </Animated.View>
        </>
    );
};
