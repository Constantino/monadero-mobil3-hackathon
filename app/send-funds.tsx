import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Pressable, Alert, TextInput } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { CameraView, useCameraPermissions } from 'expo-camera';

export default function SendFundsScreen() {
    const [permission, requestPermission] = useCameraPermissions();
    const [scanned, setScanned] = useState(false);
    const [scannedData, setScannedData] = useState('');

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
                            Alert.alert('Pago Autorizado', `Pago de ${parsedData.amount} a ${parsedData.merchant} ha sido autorizado.`);
                        } catch (error) {
                            Alert.alert('Error', 'No se pudo procesar el pago.');
                        }
                    }}>
                        <ThemedText style={styles.buttonText}>Autorizar</ThemedText>
                    </Pressable>
                </View>
            )}
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
    dataDisplay: { width: '100%', marginTop: 20, paddingHorizontal: 20, minHeight: 600 },
    dataRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginVertical: 8, paddingVertical: 16, minHeight: 80, flexWrap: 'nowrap' },
    dataColumn: { flexDirection: 'column', alignItems: 'flex-start', marginVertical: 8, paddingVertical: 16, minHeight: 80 },
    dataLabel: { fontSize: 34, fontWeight: '600', color: '#333', textAlign: 'left', lineHeight: 40, marginBottom: 0 },
    dataValue: { fontSize: 34, fontWeight: 'bold', color: '#9D4EDD', textAlign: 'left', lineHeight: 40 },
    errorText: { fontSize: 34, color: '#e74c3c', textAlign: 'center', marginTop: 16 },
    buttonRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%', marginTop: 16 },
});
