import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Pressable, Alert, TextInput, Modal } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useAccount, useContractRead, useContractWrite, useChainId } from "wagmi";
import { erc20Abi } from 'viem';
import { parseEther, formatEther } from 'viem';

export default function SendFundsScreen() {
    const [permission, requestPermission] = useCameraPermissions();
    const [scanned, setScanned] = useState(false);
    const [scannedData, setScannedData] = useState('');
    const [tipPercentage, setTipPercentage] = useState('15');
    const [showTipModal, setShowTipModal] = useState(false);
    const [customTip, setCustomTip] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);

    // Get wallet information
    const { address, status } = useAccount();
    const chainId = useChainId();

    // Read MSAL ERC-20 token balance
    const { data: msalBalance, refetch: refetchMsalBalance } = useContractRead({
        address: chainId === 10143 ? '0x269F8fe621F23798F174301ae647055De0F6d3b1' : '0x030a8AdAe6C49a6D01b83587f92308ac2A111cb6',
        abi: erc20Abi,
        functionName: 'balanceOf',
        args: address ? [address] : undefined,
    });

    // Contract write for transferring MSAL tokens
    const { writeContract: transferMsalTokens, isPending: isTransferring } = useContractWrite();

    useEffect(() => {
        if (!permission) requestPermission();
    }, [permission]);

    const handleBarcodeScanned = ({ data }: { data: string }) => {
        if (scanned) return;

        // Prevent multiple scans by immediately setting scanned to true
        setScanned(true);
        setScannedData(data);
    };

    const handleAuthorizePayment = async () => {
        if (!address) {
            Alert.alert('Error', 'Por favor conecta tu billetera primero');
            return;
        }

        try {
            const parsedData = JSON.parse(scannedData);

            if (!parsedData.address || !parsedData.amount) {
                Alert.alert('Error', 'Datos del QR incompletos');
                return;
            }

            // Check if it's a MSALDO payment
            if (parsedData.token === 'MSALDO') {
                await handleMsaldoPayment(parsedData);
            } else {
                // Fallback for legacy USD payments
                await handleLegacyPayment(parsedData);
            }

        } catch (error) {
            console.error('Error processing payment:', error);
            Alert.alert('Error', 'No se pudo procesar el pago.');
        }
    };

    const handleMsaldoPayment = async (paymentData: any) => {
        try {
            setIsProcessing(true);

            const msalAmount = parseFloat(paymentData.amount);
            if (isNaN(msalAmount) || msalAmount <= 0) {
                Alert.alert('Error', 'Monto MSALDO inválido');
                return;
            }

            // Check if user has enough MSALDO balance
            const currentBalance = msalBalance ? parseFloat(formatEther(msalBalance)) : 0;
            if (currentBalance < msalAmount) {
                Alert.alert('Error', `Saldo insuficiente. Tienes ${currentBalance.toFixed(2)} MSALDO, necesitas ${msalAmount.toFixed(2)} MSALDO`);
                return;
            }

            // Calculate tip amount and total
            const tipPercent = tipPercentage === 'custom' ? parseFloat(customTip) : parseFloat(tipPercentage);
            const tipAmount = (msalAmount * tipPercent) / 100;
            const totalAmount = msalAmount + tipAmount;

            // Check if user has enough balance for total amount including tip
            if (currentBalance < totalAmount) {
                Alert.alert('Error', `Saldo insuficiente para incluir propina. Tienes ${currentBalance.toFixed(2)} MSALDO, necesitas ${totalAmount.toFixed(2)} MSALDO`);
                return;
            }

            // Show confirmation dialog
            Alert.alert(
                'Confirmar Pago MSALDO',
                `¿Confirmar pago de ${msalAmount.toFixed(2)} MSALDO a ${paymentData.merchant}?\n\nPropina (${tipPercent}%): ${tipAmount.toFixed(2)} MSALDO\nTotal: ${totalAmount.toFixed(2)} MSALDO\n\nDirección: ${paymentData.address.slice(0, 6)}...${paymentData.address.slice(-4)}`,
                [
                    { text: 'Cancelar', style: 'cancel' },
                    {
                        text: 'Confirmar',
                        onPress: () => executeMsaldoTransfer(paymentData.address, totalAmount, paymentData.merchant)
                    }
                ]
            );

        } catch (error) {
            console.error('Error in MSALDO payment:', error);
            Alert.alert('Error', 'Error al procesar pago MSALDO');
        } finally {
            setIsProcessing(false);
        }
    };

    const executeMsaldoTransfer = async (recipientAddress: string, totalAmount: number, merchant: string) => {
        try {
            setIsProcessing(true);

            console.log(`Transferring ${totalAmount} MSALDO to ${recipientAddress} for ${merchant}`);

            // Validate Ethereum address format
            if (!recipientAddress.startsWith('0x') || recipientAddress.length !== 42) {
                Alert.alert('Error', 'Dirección de destino inválida');
                return;
            }

            // Convert amount to WEI (18 decimals)
            const amountInWei = parseEther(totalAmount.toString());

            // Execute the transfer
            transferMsalTokens({
                address: chainId === 10143 ? '0x269F8fe621F23798F174301ae647055De0F6d3b1' : '0x030a8AdAe6C49a6D01b83587f92308ac2A111cb6',
                abi: erc20Abi,
                functionName: 'transfer',
                args: [recipientAddress as `0x${string}`, amountInWei],
            });

            // Show success message
            Alert.alert(
                'Pago Exitoso',
                `Pago de ${totalAmount.toFixed(2)} MSALDO a ${merchant} ha sido procesado exitosamente.`,
                [
                    {
                        text: 'OK',
                        onPress: () => {
                            // Reset scanner and refresh balance
                            setScanned(false);
                            setScannedData('');
                            refetchMsalBalance();
                        }
                    }
                ]
            );

        } catch (error) {
            console.error('Error executing MSALDO transfer:', error);
            Alert.alert('Error', 'Error al ejecutar la transferencia MSALDO');
        } finally {
            setIsProcessing(false);
        }
    };

    const handleLegacyPayment = async (paymentData: any) => {
        // Calculate tip amount and total for legacy USD payments
        const baseAmount = parseFloat(paymentData.amount.replace(/[^0-9.]/g, '')) || 0;
        const tipPercent = tipPercentage === 'custom' ? parseFloat(customTip) : parseFloat(tipPercentage);
        const tipAmount = (baseAmount * tipPercent) / 100;
        const totalAmount = baseAmount + tipAmount;

        Alert.alert(
            'Pago Autorizado (Legacy)',
            `Pago de $${baseAmount.toFixed(2)} a ${paymentData.merchant} ha sido autorizado.\n\nPropina (${tipPercent}%): $${tipAmount.toFixed(2)}\nTotal: $${totalAmount.toFixed(2)}\n\nNota: Este es un pago legacy. Para pagos MSALDO, escanea un QR actualizado.`
        );
    };

    if (!permission) {
        return (
            <View style={styles.container}>
                <ThemedText style={styles.title}>Configurando Cámara</ThemedText>
                <ThemedText style={styles.permissionText}>Solicitando permisos...</ThemedText>
            </View>
        );
    }

    if (!permission.granted) {
        return (
            <View style={styles.container}>
                <ThemedText style={styles.title}>Permisos de Cámara</ThemedText>
                <Pressable style={styles.button} onPress={requestPermission}>
                    <ThemedText style={styles.buttonText}>Solicitar Permisos</ThemedText>
                </Pressable>
            </View>
        );
    }

    return (
        <View style={styles.container}>

            <View style={styles.scannerContainer}>
                {!scanned ? (
                    <>
                        <ThemedText style={styles.title}>Escanear QR para pagar</ThemedText>
                        <CameraView
                            style={styles.camera}
                            facing="back"
                            barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
                            onBarcodeScanned={scanned ? undefined : handleBarcodeScanned}
                        >
                            <View style={styles.overlay}>
                                <View style={styles.scanFrame} />
                            </View>
                        </CameraView>
                    </>
                ) : (
                    <View style={styles.resultContainer}>
                        <ThemedText style={styles.resultText}>Datos del pago</ThemedText>
                        {(() => {
                            try {
                                const parsedData = JSON.parse(scannedData);
                                const isMsaldoPayment = parsedData.token === 'MSALDO';

                                return (
                                    <View style={styles.dataDisplay}>

                                        <View style={styles.dataRow}>
                                            <ThemedText style={styles.dataLabel}>Monto:</ThemedText>
                                            <ThemedText style={styles.dataValue}>
                                                {isMsaldoPayment ? `${parsedData.amount}` : parsedData.amount}
                                            </ThemedText>
                                        </View>
                                        <View style={styles.tipContainer}>
                                            <ThemedText style={styles.dataLabel}>Propina:</ThemedText>
                                            <Pressable
                                                style={styles.tipDropdown}
                                                onPress={() => setShowTipModal(true)}
                                            >
                                                <ThemedText style={styles.tipValue}>
                                                    {tipPercentage === 'custom' ? `${customTip}%` : `${tipPercentage}%`}
                                                </ThemedText>
                                                <ThemedText style={styles.dropdownArrow}>▼</ThemedText>
                                            </Pressable>
                                        </View>
                                        <View style={styles.dataColumn}>
                                            <ThemedText style={styles.dataLabel}># Cuenta:</ThemedText>
                                            <ThemedText style={styles.dataValue}>{parsedData.billAccount || 'N/A'}</ThemedText>
                                        </View>
                                        <View style={styles.dataColumn}>
                                            <ThemedText style={styles.dataLabel}>Comercio:</ThemedText>
                                            <ThemedText style={styles.dataValue}>{parsedData.merchant || 'N/A'}</ThemedText>
                                        </View>
                                        <View style={styles.dataColumn}>
                                            <ThemedText style={styles.dataLabel}>Dirección:</ThemedText>
                                            <ThemedText style={styles.dataValue}>
                                                {parsedData.address ? `${parsedData.address.slice(0, 6)}...${parsedData.address.slice(-4)}` : 'N/A'}
                                            </ThemedText>
                                        </View>
                                    </View>
                                );
                            } catch (error) {
                                return (
                                    <ThemedText style={styles.errorText}>Error al procesar datos del QR</ThemedText>
                                );
                            }
                        })()}
                    </View>
                )}
            </View>

            {scanned && (
                <View style={styles.buttonRow}>
                    <Pressable style={styles.button} onPress={() => { setScanned(false); setScannedData(''); }}>
                        <ThemedText style={styles.buttonText}>Re-escanear</ThemedText>
                    </Pressable>
                    <Pressable
                        style={[styles.button, { backgroundColor: '#27ae60' }]}
                        onPress={handleAuthorizePayment}
                        disabled={isProcessing || isTransferring}
                    >
                        <ThemedText style={styles.buttonText}>
                            {isProcessing || isTransferring ? 'Procesando...' : 'Autorizar'}
                        </ThemedText>
                    </Pressable>
                </View>
            )}

            {/* Tip Selection Modal */}
            <Modal
                visible={showTipModal}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setShowTipModal(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <ThemedText style={styles.modalTitle}>Seleccionar Propina</ThemedText>

                        <Pressable
                            style={styles.tipOption}
                            onPress={() => { setTipPercentage('0'); setShowTipModal(false); }}
                        >
                            <ThemedText style={styles.tipOptionText}>0%</ThemedText>
                        </Pressable>
                        <Pressable
                            style={styles.tipOption}
                            onPress={() => { setTipPercentage('10'); setShowTipModal(false); }}
                        >
                            <ThemedText style={styles.tipOptionText}>10%</ThemedText>
                        </Pressable>

                        <Pressable
                            style={styles.tipOption}
                            onPress={() => { setTipPercentage('15'); setShowTipModal(false); }}
                        >
                            <ThemedText style={styles.tipOptionText}>15%</ThemedText>
                        </Pressable>

                        <Pressable
                            style={styles.tipOption}
                            onPress={() => { setTipPercentage('20'); setShowTipModal(false); }}
                        >
                            <ThemedText style={styles.tipOptionText}>20%</ThemedText>
                        </Pressable>

                        <View style={styles.customTipContainer}>
                            <TextInput
                                style={styles.customTipInput}
                                value={customTip}
                                onChangeText={setCustomTip}
                                placeholder="Otro %"
                                keyboardType="numeric"
                                placeholderTextColor="#999"
                            />
                            <Pressable
                                style={styles.customTipButton}
                                onPress={() => {
                                    if (customTip) {
                                        setTipPercentage('custom');
                                        setShowTipModal(false);
                                    }
                                }}
                            >
                                <ThemedText style={styles.customTipButtonText}>Aplicar</ThemedText>
                            </Pressable>
                        </View>

                        <Pressable
                            style={styles.cancelButton}
                            onPress={() => setShowTipModal(false)}
                        >
                            <ThemedText style={styles.cancelButtonText}>Cancelar</ThemedText>
                        </Pressable>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'flex-start', alignItems: 'center', padding: 20, paddingTop: 60 },
    title: { fontSize: 34, fontWeight: 'bold', marginBottom: 30, lineHeight: 40 },
    permissionText: { fontSize: 16, color: '#666', textAlign: 'center', marginBottom: 20 },
    scannerContainer: { width: '100%', height: 450, borderRadius: 12, overflow: 'hidden', marginBottom: 20 },
    camera: { flex: 1 },
    overlay: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    scanFrame: { width: 200, height: 200, borderWidth: 2, borderColor: '#fff', borderRadius: 12 },
    resultContainer: { flex: 1, justifyContent: 'flex-start', alignItems: 'center', backgroundColor: '#f0f0f0', padding: 15, paddingTop: 20 },
    resultText: { fontSize: 34, fontWeight: '600', color: '#333', textAlign: 'left', lineHeight: 40, marginBottom: 0 },
    dataInput: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 12, fontSize: 12, backgroundColor: '#fff', maxHeight: 100, width: '100%' },
    button: { backgroundColor: '#9D4EDD', paddingVertical: 10, paddingHorizontal: 24, borderRadius: 8, marginTop: 14, height: 100, textAlign: 'center', alignItems: 'center', justifyContent: 'center' },
    buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 24, },
    dataDisplay: { width: '100%', marginTop: 10, paddingHorizontal: 20, minHeight: 650 },
    dataRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginVertical: 1, paddingVertical: 1, minHeight: 10, flexWrap: 'nowrap' },
    dataColumn: { flexDirection: 'column', alignItems: 'flex-start', marginVertical: 8, paddingVertical: 16, minHeight: 80 },
    dataLabel: { fontSize: 34, fontWeight: '600', color: '#333', textAlign: 'left', lineHeight: 35, marginBottom: 0 },
    dataValue: { fontSize: 34, fontWeight: 'bold', color: '#9D4EDD', textAlign: 'left', lineHeight: 40 },
    errorText: { fontSize: 34, color: '#e74c3c', textAlign: 'center', marginTop: 16 },
    buttonRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%', marginTop: 16 },
    tipContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 8, paddingVertical: 16, minHeight: 40, paddingHorizontal: 0, borderRadius: 8 },
    tipDropdown: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#ffffff', paddingHorizontal: 16, paddingVertical: 12, borderRadius: 8, borderWidth: 2, borderColor: '#9D4EDD', minWidth: 120, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 3.84, elevation: 5 },
    tipValue: { fontSize: 24, fontWeight: 'bold', color: '#9D4EDD', marginRight: 8 },
    dropdownArrow: { fontSize: 20, color: '#666' },
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
    modalContent: { backgroundColor: '#fff', borderRadius: 12, padding: 20, width: '80%', maxWidth: 400 },
    modalTitle: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 20, color: '#333' },
    tipOption: { backgroundColor: '#f8f9fa', paddingVertical: 16, paddingHorizontal: 20, borderRadius: 8, marginBottom: 12, alignItems: 'center' },
    tipOptionText: { fontSize: 18, fontWeight: '600', color: '#333' },
    customTipContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
    customTipInput: { flex: 1, borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 12, fontSize: 16, backgroundColor: '#fff', marginRight: 8 },
    customTipButton: { backgroundColor: '#9D4EDD', paddingVertical: 12, paddingHorizontal: 16, borderRadius: 8 },
    customTipButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
    cancelButton: { backgroundColor: '#6c757d', paddingVertical: 16, paddingHorizontal: 20, borderRadius: 8, alignItems: 'center', marginTop: 8 },
    cancelButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 18 },
    balanceContainer: {
        width: '100%',
        paddingHorizontal: 20,
        paddingVertical: 15,
        backgroundColor: '#f0f0f0',
        borderRadius: 12,
        marginBottom: 20,
        alignItems: 'center',
    },
    balanceLabel: {
        fontSize: 24,
        fontWeight: '600',
        color: '#333',
        marginBottom: 8,
    },
    balanceAmount: {
        fontSize: 34,
        fontWeight: 'bold',
        color: '#9D4EDD',
    },
});
