import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Pressable, Alert, TextInput, Modal } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { CameraView, useCameraPermissions } from 'expo-camera';

export default function SendFundsScreen() {
    const [permission, requestPermission] = useCameraPermissions();
    const [scanned, setScanned] = useState(false);
    const [scannedData, setScannedData] = useState('');
    const [tipPercentage, setTipPercentage] = useState('15');
    const [showTipModal, setShowTipModal] = useState(false);
    const [customTip, setCustomTip] = useState('');

    useEffect(() => {
        if (!permission) requestPermission();
    }, [permission]);

    const handleBarcodeScanned = ({ data }: { data: string }) => {
        if (scanned) return;

        // Prevent multiple scans by immediately setting scanned to true
        setScanned(true);
        setScannedData(data);
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
                                return (
                                    <View style={styles.dataDisplay}>
                                        <View style={styles.dataRow}>
                                            <ThemedText style={styles.dataLabel}>Monto:</ThemedText>
                                            <ThemedText style={styles.dataValue}>{parsedData.amount || 'N/A'}</ThemedText>
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
                    <Pressable style={[styles.button, { backgroundColor: '#27ae60' }]} onPress={() => {
                        try {
                            const parsedData = JSON.parse(scannedData);

                            // Calculate tip amount and total
                            const baseAmount = parseFloat(parsedData.amount.replace(/[^0-9.]/g, '')) || 0;
                            const tipPercent = tipPercentage === 'custom' ? parseFloat(customTip) : parseFloat(tipPercentage);
                            const tipAmount = (baseAmount * tipPercent) / 100;
                            const totalAmount = baseAmount + tipAmount;

                            Alert.alert(
                                'Pago Autorizado',
                                `Pago de $${baseAmount.toFixed(2)} a ${parsedData.merchant} ha sido autorizado.\n\nPropina (${tipPercent}%): $${tipAmount.toFixed(2)}\nTotal: $${totalAmount.toFixed(2)}`
                            );
                        } catch (error) {
                            Alert.alert('Error', 'No se pudo procesar el pago.');
                        }
                    }}>
                        <ThemedText style={styles.buttonText}>Autorizar</ThemedText>
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
});
