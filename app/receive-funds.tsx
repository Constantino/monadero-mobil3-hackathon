import React, { useState } from 'react';
import { View, StyleSheet, TextInput, Pressable } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function ReceiveFundsScreen() {
    const [amount, setAmount] = useState('');
    const [billAccount, setBillAccount] = useState('');

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

    return (
        <ThemedView style={styles.container}>
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

            <Pressable style={styles.button} onPress={() => alert('Generando cobro...')}>
                <ThemedText style={styles.buttonText}>Generar cobro</ThemedText>
            </Pressable>
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
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 40,
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
});
