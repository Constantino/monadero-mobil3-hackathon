import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function PaymentReceiverConfirmationScreen() {
    return (
        <ThemedView style={styles.container}>
            <ThemedText style={styles.title}>Pago confirmado</ThemedText>

            <View style={styles.checkmarkContainer}>
                <Ionicons name="checkmark-circle" size={120} color="#28a745" />
            </View>

            <View style={styles.contentContainer}>
                <ThemedText style={styles.subtitle}>Detalles del cobro:</ThemedText>

                <View style={styles.detailsContainer}>
                    <View style={styles.detailRow}>
                        <ThemedText style={styles.detailLabel}>Monto:</ThemedText>
                        <ThemedText style={styles.detailValue}>$0.00</ThemedText>
                    </View>

                    <View style={styles.detailRow}>
                        <ThemedText style={styles.detailLabel}># Cuenta:</ThemedText>
                        <ThemedText style={styles.detailValue}>N/A</ThemedText>
                    </View>

                    <View style={styles.detailRow}>
                        <ThemedText style={styles.detailLabel}>Id:</ThemedText>
                        <ThemedText style={styles.detailValue}>0x0000...000</ThemedText>
                    </View>
                </View>
            </View>

            <ThemedText style={styles.subtitle}>¿Desea imprimir el ticket?</ThemedText>

            <View style={styles.buttonContainer}>
                <Pressable style={styles.backButton} onPress={() => alert('No')}>
                    <ThemedText style={styles.backButtonText}>No</ThemedText>
                </Pressable>

                <Pressable style={styles.confirmButton} onPress={() => {
                    alert('Si')
                }}>
                    <ThemedText style={styles.confirmButtonText}>Si</ThemedText>
                </Pressable>
            </View>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        padding: 20,
        paddingTop: 60,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#333',
        lineHeight: 40
    },
    checkmarkContainer: {
        alignItems: 'center',
        marginBottom: 30,
    },
    contentContainer: {
        width: '100%',
        alignItems: 'center',
        marginBottom: 40,
    },
    subtitle: {
        fontSize: 20,
        fontWeight: '600',
        marginBottom: 20,
        color: '#555',
    },
    detailsContainer: {
        width: '100%',
        backgroundColor: '#f8f9fa',
        borderRadius: 12,
        padding: 20,
        marginBottom: 20,
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#e9ecef',
    },
    detailLabel: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
        flex: 1,
    },
    detailValue: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#9D4EDD',
        flex: 1,
        textAlign: 'right',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        gap: 16,
    },
    backButton: {
        backgroundColor: '#6c757d',
        paddingVertical: 16,
        paddingHorizontal: 24,
        borderRadius: 8,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    backButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 18,
    },
    confirmButton: {
        backgroundColor: '#28a745',
        paddingVertical: 16,
        paddingHorizontal: 24,
        borderRadius: 8,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    confirmButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 18,
    },
});
