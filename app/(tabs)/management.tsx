import React from 'react';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function ManagementScreen() {
    return (
        <ThemedView style={styles.container}>
            <View style={styles.content}>
                <ThemedText type="title">Administración</ThemedText>
                <ThemedText style={styles.subtitle}>Panel de administración</ThemedText>
            </View>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        alignItems: 'center',
        gap: 16,
    },
    subtitle: {
        fontSize: 18,
        color: '#666',
    },
});
