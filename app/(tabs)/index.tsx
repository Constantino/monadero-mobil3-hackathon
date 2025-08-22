import { AppKitButton } from '@reown/appkit-wagmi-react-native';
import { Image } from 'expo-image';
import React from 'react';
import { StyleSheet } from 'react-native';

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

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
        <AppKitButton connectStyle={styles.appKitButton} label='Iniciar sesión' />
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
  },
});
