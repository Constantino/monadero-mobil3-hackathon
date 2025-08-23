import { AppKitButton } from '@reown/appkit-wagmi-react-native';
import { Image } from 'expo-image';
import React from 'react';
import { Pressable, StyleSheet } from 'react-native';

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { router } from 'expo-router';

export default function HomeScreen() {
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
        <ThemedText type="title">Saldo: $1,000.00</ThemedText>

        <Pressable
          style={styles.button}
          onPress={() => {
            console.log('Next button pressed');
            router.push('./payment-receiver-confirmation');
          }}
        >
          <ThemedText style={styles.buttonText}>Recargar saldo</ThemedText>
        </Pressable>
      </ParallaxScrollView>

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
