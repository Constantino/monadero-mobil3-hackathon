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
        setScanned(true);
        setScannedData(data);
        Alert.alert('QR Code Escaneado', `Datos: ${data}`);
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
            <ThemedText style={styles.title}>Escanear QR para pagar</ThemedText>

            <View style={styles.scannerContainer}>
                {!scanned ? (
                    <CameraView
                        style={styles.camera}
                        facing="back"
                        barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
                        onBarcodeScanned={handleBarcodeScanned}
                    >
                        <View style={styles.overlay}>
                            <View style={styles.scanFrame} />
                        </View>
                    </CameraView>
                ) : (

                    <View style={styles.resultContainer}>
                        <ThemedText style={styles.resultText}>QR Escaneado:</ThemedText>
                        <TextInput style={styles.dataInput} value={scannedData} multiline editable={false} />
                    </View>
                )}
            </View>

            {scanned && (
                <Pressable style={styles.button} onPress={() => { setScanned(false); setScannedData(''); }}>
                    <ThemedText style={styles.buttonText}>Escanear Otro</ThemedText>
                </Pressable>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'flex-start', alignItems: 'center', padding: 20, paddingTop: 60 },
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 30 },
    permissionText: { fontSize: 16, color: '#666', textAlign: 'center', marginBottom: 20 },
    scannerContainer: { width: '100%', height: 300, borderRadius: 12, overflow: 'hidden', marginBottom: 20 },
    camera: { flex: 1 },
    overlay: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    scanFrame: { width: 200, height: 200, borderWidth: 2, borderColor: '#fff', borderRadius: 12 },
    resultContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f0f0f0', padding: 20 },
    resultText: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
    dataInput: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 12, fontSize: 12, backgroundColor: '#fff', maxHeight: 100, width: '100%' },
    button: { backgroundColor: '#9D4EDD', paddingVertical: 12, paddingHorizontal: 24, borderRadius: 8, marginTop: 16 },
    buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16, textAlign: 'center' },
});
