import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Dimensions, Alert, Platform, ActivityIndicator } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function MapScreen() {
    const [location, setLocation] = useState<Location.LocationObject | null>(null);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [mapError, setMapError] = useState<string | null>(null);
    const [mapReady, setMapReady] = useState(false);

    // Mexico City coordinates
    const mexicoCityRegion = {
        latitude: 19.4205,
        longitude: -99.1867,
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
        console.log('MapScreen: useEffect started');

        // Add a timeout to detect if map is taking too long
        const mapTimeout = setTimeout(() => {
            if (isLoading) {
                console.log('MapScreen: Map loading timeout - showing fallback');
                setMapError('Map is taking too long to load. Showing locations list instead.');
                setIsLoading(false);
            }
        }, 10000); // 10 seconds timeout

        (async () => {
            try {
                setIsLoading(true);
                setErrorMsg(null);
                setMapError(null);

                console.log('MapScreen: Requesting location permissions...');
                let { status } = await Location.requestForegroundPermissionsAsync();
                console.log('MapScreen: Location permission status:', status);

                if (status !== 'granted') {
                    setErrorMsg('Permission to access location was denied');
                    Alert.alert(
                        'Location Permission Required',
                        'This app needs location access to show your position on the map.',
                        [{ text: 'OK' }]
                    );
                    setIsLoading(false);
                    return;
                }

                console.log('MapScreen: Getting current location...');
                let currentLocation = await Location.getCurrentPositionAsync({
                    accuracy: Location.Accuracy.Balanced,
                    timeInterval: 5000,
                    distanceInterval: 10,
                });
                console.log('MapScreen: Location obtained:', currentLocation);
                setLocation(currentLocation);
            } catch (error) {
                console.error('MapScreen: Location error:', error);
                setErrorMsg('Error getting location');
            } finally {
                setIsLoading(false);
            }
        })();

        return () => clearTimeout(mapTimeout);
    }, []);

    const handleMapReady = () => {
        console.log('MapScreen: Map is ready');
        setMapReady(true);
        setIsLoading(false);
    };

    const handleMapError = (error: any) => {
        console.error('MapScreen: Map error:', error);
        setMapError('Error loading map. Please check your internet connection and try again.');
        setIsLoading(false);
    };

    console.log('MapScreen: Render state - isLoading:', isLoading, 'mapReady:', mapReady, 'mapError:', mapError);

    if (isLoading) {
        return (
            <ThemedView style={styles.container}>
                <View style={styles.header}>
                    <ThemedText type="title">Negocios afiliados</ThemedText>
                </View>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#9D4EDD" />
                    <ThemedText style={styles.loadingText}>Cargando mapa...</ThemedText>
                    <ThemedText style={styles.loadingSubtext}>Esperando permisos de ubicación...</ThemedText>
                </View>
            </ThemedView>
        );
    }

    if (mapError) {
        return (
            <ThemedView style={styles.container}>
                <View style={styles.header}>
                    <ThemedText type="title">Negocios afiliados</ThemedText>
                </View>
                <View style={styles.errorContainer}>
                    <ThemedText style={styles.errorText}>{mapError}</ThemedText>
                    <ThemedText style={styles.errorSubtext}>
                        {Platform.OS === 'android'
                            ? 'Make sure you have a valid Google Maps API key configured.'
                            : 'Please check your internet connection.'
                        }
                    </ThemedText>

                    {/* Fallback: Show locations as a list */}
                    <View style={styles.fallbackContainer}>
                        <ThemedText style={styles.fallbackTitle}>Negocios disponibles:</ThemedText>
                        {locations.map((location) => (
                            <View key={location.id} style={styles.locationItem}>
                                <ThemedText style={styles.locationTitle}>{location.title}</ThemedText>
                                <ThemedText style={styles.locationDescription}>{location.description}</ThemedText>
                                <ThemedText style={styles.locationCoords}>
                                    Lat: {location.coordinate.latitude.toFixed(4)},
                                    Lng: {location.coordinate.longitude.toFixed(4)}
                                </ThemedText>
                            </View>
                        ))}
                    </View>
                </View>
            </ThemedView>
        );
    }

    return (
        <ThemedView style={styles.container}>
            <View style={styles.header}>
                <ThemedText type="title">Negocios afiliados</ThemedText>
            </View>

            {/* Debug info */}
            <View style={styles.debugInfo}>
                <ThemedText style={styles.debugText}>
                    Platform: {Platform.OS} | Map Ready: {mapReady ? 'Yes' : 'No'} | Loading: {isLoading ? 'Yes' : 'No'}
                </ThemedText>
            </View>

            <MapView
                style={styles.map}
                initialRegion={mexicoCityRegion}
                showsUserLocation={true}
                showsMyLocationButton={true}
                onMapReady={handleMapReady}
                loadingEnabled={true}
                loadingIndicatorColor="#9D4EDD"
                loadingBackgroundColor="#ffffff"
                mapType="standard"
                zoomEnabled={true}
                scrollEnabled={true}
                rotateEnabled={true}
                pitchEnabled={true}
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

            {!mapReady && (
                <View style={styles.mapOverlay}>
                    <ActivityIndicator size="large" color="#9D4EDD" />
                    <ThemedText style={styles.mapOverlayText}>Inicializando mapa...</ThemedText>
                </View>
            )}
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
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    loadingText: {
        marginTop: 20,
        fontSize: 18,
        color: '#666',
    },
    loadingSubtext: {
        marginTop: 10,
        fontSize: 14,
        color: '#999',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 20,
    },
    errorText: {
        fontSize: 18,
        color: '#ff0000',
        textAlign: 'center',
        marginBottom: 10,
    },
    errorSubtext: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
    },
    mapOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    mapOverlayText: {
        marginTop: 20,
        fontSize: 16,
        color: '#666',
    },
    debugInfo: {
        position: 'absolute',
        top: 100, // Adjust as needed to be above the map
        left: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
        padding: 10,
        borderRadius: 5,
    },
    debugText: {
        fontSize: 14,
        color: '#333',
    },
    fallbackContainer: {
        marginTop: 20,
        width: '100%',
    },
    fallbackTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
    },
    locationItem: {
        backgroundColor: '#f0f0f0',
        padding: 10,
        marginBottom: 5,
        borderRadius: 5,
    },
    locationTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 2,
    },
    locationDescription: {
        fontSize: 14,
        color: '#555',
        marginBottom: 2,
    },
    locationCoords: {
        fontSize: 12,
        color: '#888',
    },
});
