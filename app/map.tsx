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
            title: 'Tacos El Güero',
            description: 'Best tacos al pastor in Centro Histórico',
            coordinate: {
                latitude: 19.4326,
                longitude: -99.1332,
            },
        },
        {
            id: 2,
            title: 'Restaurante Chapultepec',
            description: 'Fine dining with castle views',
            coordinate: {
                latitude: 19.4205,
                longitude: -99.1862,
            },
        },
        {
            id: 3,
            title: 'Cafetería Coyoacán',
            description: 'Artistic café with local coffee',
            coordinate: {
                latitude: 19.3450,
                longitude: -99.1626,
            },
        },
        {
            id: 4,
            title: 'Hamburguesas Polanco',
            description: 'Gourmet burgers in upscale district',
            coordinate: {
                latitude: 19.4333,
                longitude: -99.2000,
            },
        },
        {
            id: 5,
            title: 'Restaurante Xochimilco',
            description: 'Traditional Mexican food by the canals',
            coordinate: {
                latitude: 19.2578,
                longitude: -99.1036,
            },
        },
        {
            id: 6,
            title: 'Quesadillas Condesa',
            description: 'Authentic quesadillas with handmade tortillas',
            coordinate: {
                latitude: 19.4100,
                longitude: -99.1700,
            },
        },
        {
            id: 7,
            title: 'Tiendita Roma Norte',
            description: 'Convenience store with local snacks',
            coordinate: {
                latitude: 19.4180,
                longitude: -99.1580,
            },
        },
        {
            id: 8,
            title: 'Cafetería Roma Sur',
            description: 'Cozy coffee shop with pastries',
            coordinate: {
                latitude: 19.4080,
                longitude: -99.1580,
            },
        },
        {
            id: 9,
            title: 'Restaurante Polanco Norte',
            description: 'Luxury dining experience',
            coordinate: {
                latitude: 19.4380,
                longitude: -99.2000,
            },
        },
        {
            id: 10,
            title: 'Hamburguesas Polanco Sur',
            description: 'Premium burger joint',
            coordinate: {
                latitude: 19.4280,
                longitude: -99.2000,
            },
        },
        {
            id: 11,
            title: 'Tacos El Ángel',
            description: 'Street tacos near the monument',
            coordinate: {
                latitude: 19.4270,
                longitude: -99.1676,
            },
        },
        {
            id: 12,
            title: 'Tiendita Reforma 222',
            description: 'Convenience store in shopping center',
            coordinate: {
                latitude: 19.4280,
                longitude: -99.1680,
            },
        },
        {
            id: 13,
            title: 'Restaurante Hotel Sheraton',
            description: 'Hotel restaurant with international cuisine',
            coordinate: {
                latitude: 19.4260,
                longitude: -99.1670,
            },
        },
        {
            id: 14,
            title: 'Cafetería Parque México',
            description: 'Coffee shop in beautiful park setting',
            coordinate: {
                latitude: 19.4120,
                longitude: -99.1720,
            },
        },
        {
            id: 15,
            title: 'Quesadillas Parque España',
            description: 'Quesadillas stand in the park',
            coordinate: {
                latitude: 19.4080,
                longitude: -99.1680,
            },
        },
        {
            id: 16,
            title: 'Restaurante Condesa DF',
            description: 'Famous restaurant with rooftop dining',
            coordinate: {
                latitude: 19.4140,
                longitude: -99.1740,
            },
        },
        {
            id: 17,
            title: 'Tiendita Anahuac Norte',
            description: 'Local convenience store',
            coordinate: {
                latitude: 19.4500,
                longitude: -99.1800,
            },
        },
        {
            id: 18,
            title: 'Cafetería Anahuac Sur',
            description: 'Neighborhood coffee shop',
            coordinate: {
                latitude: 19.4400,
                longitude: -99.1800,
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
                <ThemedText type="title">Negocios afiliados</ThemedText>
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
