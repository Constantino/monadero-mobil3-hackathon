import React, { useLayoutEffect } from 'react';
import { View, StyleSheet, Pressable, Alert, ScrollView } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { router, useNavigation, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function PaymentReceiverConfirmationScreen() {
    const navigation = useNavigation();
    const params = useLocalSearchParams();

    // Get data from route parameters
    const amount = params.amount as string || '50.00';
    const billAccount = params.billAccount as string || '123456789';

    // Hardcoded data with dynamic values from params
    const paymentData = {
        amount: amount,
        billAccount: billAccount,
        merchant: 'Tacos Don Chuy',
        address: '0x1234567890123456789012345678901234567890',
        token: 'MSALDO'
    };

    const latestTxId = '0xa1e5a8e3b7f7f3c54a326bbe66362ded013ac31ef47f57560a7933171f062c1f';

    // Manual refresh function for transaction ID
    const handleRefreshTransactionId = () => {
        // No-op since we're using hardcoded data
        console.log('PaymentReceiverConfirmation: Refresh requested (hardcoded data)');
    };

    useLayoutEffect(() => {
        navigation.setOptions({
            title: 'Confirmación',
        });
    }, [navigation]);

    const handlePrintTicket = () => {
        if (paymentData) {
            Alert.alert(
                'Ticket de Pago',
                `Ticket generado para:\n\nMonto: ${paymentData.amount} ${paymentData.token || 'MSALDO'}\nCuenta: ${paymentData.billAccount}\nComercio: ${paymentData.merchant}\nTxID: ${latestTxId}\n\nTicket enviado a impresora.`,
                [{
                    text: 'OK',
                    onPress: () => {
                        // Navigate to home/index screen
                        router.push('/(tabs)');
                    }
                }]
            );
        } else {
            Alert.alert('Error', 'No hay datos de pago para imprimir');
        }
    };

    const handleNoPrint = () => {
        Alert.alert('Confirmado', 'Ticket no será impreso', [
            {
                text: 'OK',
                onPress: () => {
                    // Navigate to home/index screen
                    router.push('/(tabs)');
                }
            }
        ]);
    };

    return (
        <ThemedView style={styles.container}>
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContentContainer}
                showsVerticalScrollIndicator={true}
            >
                <ThemedText style={styles.title}>Pago confirmado</ThemedText>

                <View style={styles.checkmarkContainer}>
                    <Ionicons name="checkmark-circle" size={120} color="#28a745" />
                </View>

                <View style={styles.contentContainer}>
                    <ThemedText style={styles.subtitle}>Detalles del cobro:</ThemedText>

                    <View style={styles.detailsContainer}>
                        <View style={styles.detailRow}>
                            <ThemedText style={styles.detailLabel}>Monto:</ThemedText>
                            <ThemedText style={styles.detailValue}>
                                {paymentData?.amount || '0.00'}
                            </ThemedText>
                        </View>

                        <View style={styles.detailRow}>
                            <ThemedText style={styles.detailLabel}># Cuenta:</ThemedText>
                            <ThemedText style={styles.detailValue}>{paymentData?.billAccount || 'N/A'}</ThemedText>
                        </View>

                        <View style={styles.detailRow}>
                            <ThemedText style={styles.detailLabel}>Comercio:</ThemedText>
                            <ThemedText style={styles.detailValue}>{paymentData?.merchant || 'N/A'}</ThemedText>
                        </View>

                        <View style={styles.detailRow}>
                            <ThemedText style={styles.detailLabel}>Dirección:</ThemedText>
                            <ThemedText style={styles.detailValue}>
                                {paymentData?.address ?
                                    `${paymentData.address.slice(0, 6)}...${paymentData.address.slice(-4)}` :
                                    'N/A'
                                }
                            </ThemedText>
                        </View>

                        <View style={styles.detailRow}>
                            <ThemedText style={styles.detailLabel}>TxID:</ThemedText>
                            <View style={styles.txIdContainer}>
                                <ThemedText style={styles.detailValue}>
                                    {latestTxId.startsWith('0x') && latestTxId.length > 20
                                        ? `${latestTxId.slice(0, 10)}...${latestTxId.slice(-8)}`
                                        : latestTxId
                                    }
                                </ThemedText>
                                <Pressable
                                    style={styles.refreshButton}
                                    onPress={handleRefreshTransactionId}
                                    disabled={false}
                                >
                                    <Ionicons name="refresh" size={16} color="#9D4EDD" />
                                </Pressable>
                            </View>
                        </View>
                    </View>
                </View>

                <ThemedText style={styles.subtitle}>¿Desea imprimir el ticket?</ThemedText>

                <View style={styles.buttonContainer}>
                    <Pressable style={styles.backButton} onPress={handleNoPrint}>
                        <ThemedText style={styles.backButtonText}>No</ThemedText>
                    </Pressable>

                    <Pressable style={styles.confirmButton} onPress={handlePrintTicket}>
                        <ThemedText style={styles.confirmButtonText}>Si</ThemedText>
                    </Pressable>
                </View>
            </ScrollView>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        padding: 20,
    },
    scrollView: {
        flex: 1,
        width: '100%',
    },
    scrollContentContainer: {
        width: '100%',
        alignItems: 'center',
        paddingTop: 40, // Add top padding for proper spacing
        paddingBottom: 20, // Add padding at bottom for better scrolling
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
        paddingBottom: 20, // Add padding at bottom for better scrolling
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
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    loadingText: {
        marginTop: 10,
        fontSize: 18,
        color: '#555',
    },
    txIdContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        justifyContent: 'space-between',
    },
    refreshButton: {
        padding: 5,
    },
});
