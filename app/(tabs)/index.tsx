import { AppKitButton } from '@reown/appkit-wagmi-react-native';
import { Image } from 'expo-image';
import React, { useState } from 'react';
import { Pressable, StyleSheet, Modal, TextInput, View, Alert, Text } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { router } from 'expo-router';

export default function HomeScreen() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [inputCode, setInputCode] = useState('');
  const [saldo, setSaldo] = useState(1000);

  const handleRecargarSaldo = () => {
    setIsModalVisible(true);
  };

  const handleSubmitCode = () => {
    if (inputCode.trim() === '') {
      Alert.alert('Error', 'Por favor ingresa un código');
      return;
    }

    // Increment saldo by 100 units
    setSaldo(prevSaldo => prevSaldo + 100);
    setInputCode('');
    setIsModalVisible(false);
    Alert.alert('Éxito', 'Saldo recargado exitosamente');
  };

  const handleCancelModal = () => {
    setInputCode('');
    setIsModalVisible(false);
  };

  return (
    <>
      <ParallaxScrollView
        headerBackgroundColor={{ light: '#000', dark: '#000' }}
        headerImage={
          <Image
            source={require('@/assets/images/monadero_image.png')}
            style={{ height: 250, width: '100%' }}
            contentFit="contain"
          />
        }
      >
        <ThemedView style={styles.titleContainer}>
          <ThemedText type="title">¡Bienvenido!</ThemedText>
          {/* <HelloWave /> */}
        </ThemedView>
        <AppKitButton
          connectStyle={styles.appKitButton}
          label='Iniciar sesión con billetera'
          size='md'
          loadingLabel='Conectando...'
        />
        <ThemedText type="title">Saldo: ${saldo.toFixed(2)}</ThemedText>

        <Pressable
          style={styles.button}
          onPress={handleRecargarSaldo}
        >
          <MaterialIcons name="attach-money" size={24} color="#fff" />
          <ThemedText style={styles.buttonText}>Recargar saldo</ThemedText>
        </Pressable>
      </ParallaxScrollView>

      {/* Modal for code input */}
      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={handleCancelModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <ThemedText style={styles.modalTitle}>Recargar Saldo</ThemedText>
            <ThemedText style={styles.modalSubtitle}>Ingresa el código de recarga</ThemedText>

            <TextInput
              style={styles.codeInput}
              placeholder="Código de recarga"
              placeholderTextColor="#999"
              value={inputCode}
              onChangeText={setInputCode}
              autoFocus={true}
            />

            <View style={styles.modalButtonContainer}>
              <Pressable style={styles.modalCancelButton} onPress={handleCancelModal}>
                <ThemedText style={styles.modalButtonText}>Cancelar</ThemedText>
              </Pressable>

              <Pressable style={styles.modalSubmitButton} onPress={handleSubmitCode}>
                <ThemedText style={styles.modalButtonText}>Recargar</ThemedText>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 5
  },
  reownLogo: {
    height: 200,
    width: 400,
    alignContent: 'center',
    alignSelf: 'center',
    // bottom: 0,
    // left: 0,
    // position: 'absolute',
  },
  appKitButton: {
    marginTop: 20,
    marginBottom: 20,
    height: 90,
    backgroundColor: '#9D4EDD',
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 32,
  },
  button: {
    backgroundColor: '#9D4EDD',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 20,
    marginTop: 16,
    height: 100,
    width: '100%',
    textAlign: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row', // Added for icon and text alignment
    gap: 10, // Added for spacing between icon and text
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
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
    textAlign: 'center',
  },
  modalSubtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
  },
  codeInput: {
    width: '100%',
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    fontSize: 18,
    marginBottom: 20,
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  modalCancelButton: {
    backgroundColor: '#ccc',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  modalSubmitButton: {
    backgroundColor: '#9D4EDD',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
