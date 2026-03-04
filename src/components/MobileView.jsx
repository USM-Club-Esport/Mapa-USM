import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

export default function MobileView() {
    return (
        <View style={styles.mobileContainer}>
            <Text style={styles.mobileText}>Aquí iría la página de teléfono</Text>
            <StatusBar style="auto" />
        </View>
    );
}

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
});
