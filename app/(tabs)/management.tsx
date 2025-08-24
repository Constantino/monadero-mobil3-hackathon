import React from 'react';
import { Pressable, StyleSheet, View, Alert } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useRouter } from 'expo-router';

export default function ManagementScreen() {
    const router = useRouter();
    
    const handleComingSoon = () => {
        Alert.alert('Información', 'Próximamente...');
    };
    
    return (
        <View style={styles.container}>
            <ThemedText style={styles.title}>Administración</ThemedText>

            <View style={styles.buttonRow}>
                <Pressable style={styles.button} onPress={handleComingSoon}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                        <IconSymbol name="paperplane.fill" size={120} color="#fff" />
                        <ThemedText style={styles.buttonText}>Mis pagos</ThemedText>
                    </View>
                </Pressable>
                <Pressable style={styles.button} onPress={handleComingSoon}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                        <IconSymbol name="tray.and.arrow.down.fill" size={120} color="#fff" />
                        <ThemedText style={styles.buttonText}>Mis ingresos</ThemedText>
                    </View>
                </Pressable>
                <Pressable style={styles.button} onPress={handleComingSoon}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                        <IconSymbol name="arrow.down.circle.fill" size={120} color="#fff" />
                        <ThemedText style={styles.buttonText}>Retirar</ThemedText>
                    </View>
                </Pressable>
            </View>

        </View>
    );
}

const styles = StyleSheet.create({
    headerImage: {
        color: '#808080',
        bottom: -90,
        left: -35,
        position: 'absolute',
    },
    titleContainer: {
        flexDirection: 'row',
        gap: 8,
    },
    buttonRow: {
        flexDirection: 'column',
        justifyContent: 'center',
        gap: 16,
        marginTop: 24,
    },
    button: {
        backgroundColor: '#9D4EDD',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 25,
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 32,
    },
});