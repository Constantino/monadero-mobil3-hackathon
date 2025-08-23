import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Dimensions, Alert } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function MapScreen() {
    const [location, setLocation] = useState<Location.LocationObject | null>(null);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    // Mexico City coordinates
    const mexicoCityRegion = {
        latitude: 19.4326,
        longitude: -99.1332,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
    };

    // Sample locations in Mexico City
    const locations = [
        {
            id: 1,
            title: 'Centro Histórico',
            description: 'Historic center of Mexico City',
            coordinate: {
                latitude: 19.4326,
                longitude: -99.1332,
            },
        },
        {
            id: 2,
            title: 'Chapultepec',
            description: 'Chapultepec Castle and Park',
            coordinate: {
                latitude: 19.4205,
                longitude: -99.1862,
            },
        },
        {
            id: 3,
            title: 'Coyoacán',
            description: 'Artistic neighborhood',
            coordinate: {
                latitude: 19.3450,
                longitude: -99.1626,
            },
        },
        {
            id: 4,
            title: 'Polanco',
            description: 'Upscale shopping district',
            coordinate: {
                latitude: 19.4333,
                longitude: -99.2000,
            },
        },
        {
            id: 5,
            title: 'Xochimilco',
            description: 'Floating gardens',
            coordinate: {
                latitude: 19.2578,
                longitude: -99.1036,
            },
        },
    ];

    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setErrorMsg('Permission to access location was denied');
                Alert.alert(
                    'Location Permission Required',
                    'This app needs location access to show your position on the map.',
                    [{ text: 'OK' }]
                );
                return;
            }

            let currentLocation = await Location.getCurrentPositionAsync({});
            setLocation(currentLocation);
        })();
    }, []);

    return (
        <ThemedView style={styles.container}>
            <View style={styles.header}>
                <ThemedText type="title">Mapa de Ciudad de México</ThemedText>
            </View>

            <MapView
                style={styles.map}
                initialRegion={mexicoCityRegion}
                showsUserLocation={true}
                showsMyLocationButton={true}
            >
                {locations.map((location) => (
                    <Marker
                        key={location.id}
                        coordinate={location.coordinate}
                        title={location.title}
                        description={location.description}
                        pinColor="#9D4EDD"
                    />
                ))}
            </MapView>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        padding: 20,
        paddingTop: 60,
        backgroundColor: '#fff',
        alignItems: 'center',
    },
    map: {
        flex: 1,
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
    },
});
