import React, { useState } from 'react';
import { View, StyleSheet, TextInput, Pressable, Alert, ScrollView } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import QRCode from 'react-native-qrcode-svg';
import { router } from 'expo-router';
import { useAccount, useBalance, useChainId, useContractRead } from "wagmi";
import { erc20Abi } from 'viem';

export default function ReceiveFundsScreen() {
    const [amount, setAmount] = useState('');
    const [billAccount, setBillAccount] = useState('');
    const [showQR, setShowQR] = useState(false);
    const [qrData, setQrData] = useState('');

    // Get wallet information
    const { address, status } = useAccount();
    const chainId = useChainId();

    // Read MSAL ERC-20 token balance
    const { data: msalBalance } = useContractRead({
        address: chainId === 10143 ? '0x269F8fe621F23798F174301ae647055De0F6d3b1' : '0x030a8AdAe6C49a6D01b83587f92308ac2A111cb6',
        abi: erc20Abi,
        functionName: 'balanceOf',
        args: address ? [address] : undefined,
    });

    const formatAmount = (text: string) => {
        // Remove all non-numeric characters except decimal point
        const numericValue = text.replace(/[^0-9.]/g, '');

        // Ensure only one decimal point
        const parts = numericValue.split('.');
        if (parts.length > 2) return amount;

        // Format with commas for thousands
        const wholePart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        const decimalPart = parts[1] ? `.${parts[1]}` : '';

        return `$${wholePart}${decimalPart}`;
    };

    const handleAmountChange = (text: string) => {
        const formatted = formatAmount(text);
        setAmount(formatted);
    };

    const handleGenerateQR = () => {
        if (!amount || !billAccount) {
            Alert.alert('Error', 'Por favor complete todos los campos');
            return;
        }

        if (!address) {
            Alert.alert('Error', 'Por favor conecta tu billetera primero');
            return;
        }

        // Extract numeric amount from formatted string
        const numericAmount = amount.replace(/[^0-9.]/g, '');
        const msalAmount = parseFloat(numericAmount);

        if (isNaN(msalAmount) || msalAmount <= 0) {
            Alert.alert('Error', 'Por favor ingresa un monto válido');
            return;
        }

        const paymentData = {
            address: address, // Real wallet address
            amount: msalAmount, // MSALDO token amount
            billAccount: billAccount,
            merchant: 'Tacos Don Chuy',
            token: 'MSALDO',
            chainId: chainId,
            timestamp: new Date().toISOString()
        };

        setQrData(JSON.stringify(paymentData));
        setShowQR(true);

        console.log('Generated QR for MSALDO payment:', paymentData);
    };

    return (
        <ThemedView style={styles.container}>
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.container}
                showsVerticalScrollIndicator={true}
            >
                {/* <ThemedText style={styles.title}>Cobrar</ThemedText> */}

                <View style={styles.inputContainer}>
                    <ThemedText style={styles.label}>Monto</ThemedText>
                    <TextInput
                        style={styles.input}
                        value={amount}
                        onChangeText={handleAmountChange}
                        placeholder="$0.00"
                        keyboardType="number-pad"
                        placeholderTextColor="#999"
                        autoFocus={false}
                        returnKeyType="done"
                        blurOnSubmit={true}
                        onFocus={() => console.log('Amount input focused')}
                    />
                </View>

                <View style={styles.inputContainer}>
                    <ThemedText style={styles.label}># Cuenta</ThemedText>
                    <TextInput
                        style={styles.input}
                        value={billAccount}
                        onChangeText={setBillAccount}
                        placeholder="Ingrese número de cuenta"
                        placeholderTextColor="#999"
                        returnKeyType="done"
                        blurOnSubmit={true}
                        onFocus={() => console.log('Bill account input focused')}
                    />
                </View>

                {showQR && (
                    <View style={styles.qrContainer}>
                        <QRCode
                            value={qrData}
                            size={200}
                            color="black"
                            backgroundColor="white"
                        />
                        <ThemedText style={styles.qrText}>Escanea para pagar</ThemedText>
                        <ThemedText style={styles.qrAddress}>
                            Dirección: {address?.slice(0, 6)}...{address?.slice(-4)}
                        </ThemedText>
                    </View>
                )}

                <Pressable style={styles.button} onPress={handleGenerateQR}>
                    <ThemedText style={styles.buttonText}>Generar cobro</ThemedText>
                </Pressable>

                <Pressable
                    style={styles.nextButton}
                    onPress={() => {
                        console.log('Next button pressed');
                        // Extract numeric amount from formatted string
                        const numericAmount = amount.replace(/[^0-9.]/g, '');
                        router.push({
                            pathname: './payment-receiver-confirmation',
                            params: {
                                amount: numericAmount,
                                billAccount: billAccount
                            }
                        });
                    }}
                >
                    <ThemedText style={styles.nextButtonText}>Validate</ThemedText>
                </Pressable>
            </ScrollView>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1, // Changed from flex: 1 for ScrollView
        justifyContent: 'flex-start',
        alignItems: 'center',
        padding: 20,
        paddingTop: 60,
        paddingBottom: 40, // Add bottom padding for better scrolling
    },
    scrollView: {
        flex: 1,
        width: '100%',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 40,
    },
    subtitle: {
        fontSize: 16,
        color: '#555',
        marginBottom: 20,
    },
    balanceContainer: {
        width: '100%',
        marginBottom: 24,
        alignItems: 'center',
    },
    balanceLabel: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 8,
        alignSelf: 'flex-start',
    },
    balanceAmount: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#9D4EDD',
    },
    inputContainer: {
        width: '100%',
        marginBottom: 24,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 8,
        alignSelf: 'flex-start',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 20,
        fontSize: 35,
        backgroundColor: '#fff',
        width: '100%',
        minHeight: 60,
    },
    button: {
        backgroundColor: '#9D4EDD',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
        marginTop: 16,
        height: 100,
        width: '100%',
        textAlign: 'center',
        alignSelf: 'center',
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 24,
        textAlign: 'center',
        alignSelf: 'center',
        justifyContent: 'center',
        alignItems: 'center',
    },
    qrContainer: {
        marginBottom: 24,
        alignItems: 'center',
    },
    qrText: {
        marginTop: 10,
        fontSize: 16,
        color: '#555',
    },
    qrAddress: {
        marginTop: 10,
        fontSize: 14,
        color: '#777',
    },
    nextButton: {
        backgroundColor: '#9D4EDD',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
        marginTop: 16,
        height: 50,
        width: 100,
        textAlign: 'center',
        alignSelf: 'center',
        justifyContent: 'center',
        alignItems: 'center',
    },
    nextButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 12,
        textAlign: 'center',
        alignSelf: 'center',
        justifyContent: 'center',
        alignItems: 'center',
    },
    debugText: {
        color: '#ff0000',
        fontSize: 16,
        fontWeight: 'bold',
        marginVertical: 10,
        backgroundColor: '#ffff00',
        padding: 5,
    },
});
