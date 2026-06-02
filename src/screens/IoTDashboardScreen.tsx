import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Switch, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { RootTabScreenProps } from '../types';
import init from 'react_native_mqtt';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Inicializa o módulo MQTT configurando o ambiente para funcionar no React Native
init({
    size: 10000,
    storageBackend: AsyncStorage,
    defaultExpires: 1000 * 3600 * 24,
    enableCache: true,
    sync: {},
});

const BROKER = "broker.hivemq.com";
const PORT = 8000; // Porta de WebSockets pública do HiveMQ
const TOPIC_SUBSCRIBE_TEMP = "/TEF/EnvM001/attrs/t";
const TOPIC_SUBSCRIBE_UMID = "/TEF/EnvM001/attrs/h";
const TOPIC_SUBSCRIBE_LUM = "/TEF/EnvM001/attrs/l";
const TOPIC_SUBSCRIBE_CMD = "/TEF/EnvM001/cmd";
const TOPIC_SUBSCRIBE_STATE = "/TEF/EnvM001/attrs";

export default function IoTDashboardScreen({ navigation }: RootTabScreenProps<'IoT'>) {
    const [connected, setConnected] = useState(false);
    const [ledStatus, setLedStatus] = useState(false);
    const [temperature, setTemperature] = useState<number>(0);
    const [humidity, setHumidity] = useState<number>(0);
    const [luminosity, setLuminosity] = useState<number>(0);

    // Cliente MQTT guardado em ref para persistir nos re-renders
    const mqttClient = useRef<any>(null);

    useEffect(() => {
        // Inicializa o client na montagem do componente
        const clientId = 'fiware_app_' + Math.random().toString(16).substr(2, 8);
        mqttClient.current = new (window as any).Paho.MQTT.Client(BROKER, PORT, clientId);

        mqttClient.current.onConnectionLost = (responseObject: any) => {
            if (responseObject.errorCode !== 0) {
                console.log("Conexão perdida:", responseObject.errorMessage);
                setConnected(false);
            }
        };

        mqttClient.current.onMessageArrived = (message: any) => {
            const topic = message.destinationName;
            const payload = message.payloadString;
            console.log(`Mensagem recebida: ${topic} -> ${payload}`);

            if (topic === TOPIC_SUBSCRIBE_TEMP) setTemperature(parseFloat(payload));
            if (topic === TOPIC_SUBSCRIBE_UMID) setHumidity(parseFloat(payload));
            if (topic === TOPIC_SUBSCRIBE_LUM) setLuminosity(parseFloat(payload));
            if (topic === TOPIC_SUBSCRIBE_STATE) {
                if (payload.includes('on')) setLedStatus(true);
                else if (payload.includes('off')) setLedStatus(false);
            }
        };

        return () => {
            if (mqttClient.current && mqttClient.current.isConnected()) {
                mqttClient.current.disconnect();
            }
        };
    }, []);

    const handleConnect = () => {
        if (!connected) {
            console.log("Tentando conectar...");
            mqttClient.current.connect({
                onSuccess: () => {
                    console.log("Conectado ao MQTT broker");
                    setConnected(true);
                    mqttClient.current.subscribe(TOPIC_SUBSCRIBE_TEMP);
                    mqttClient.current.subscribe(TOPIC_SUBSCRIBE_UMID);
                    mqttClient.current.subscribe(TOPIC_SUBSCRIBE_LUM);
                    mqttClient.current.subscribe(TOPIC_SUBSCRIBE_STATE);
                },
                onFailure: (err: any) => {
                    console.log("Falha ao conectar: ", err.errorMessage);
                    Alert.alert("Erro", "Falha ao conectar no broker.");
                }
            });
        } else {
            mqttClient.current.disconnect();
            setConnected(false);
        }
    };

    const toggleLed = () => {
        if (!connected) {
            Alert.alert("Erro", "Conecte-se ao broker primeiro.");
            return;
        }

        const payload = !ledStatus ? 'EnvM001@on|' : 'EnvM001@off|';
        const message = new (window as any).Paho.MQTT.Message(payload);
        message.destinationName = TOPIC_SUBSCRIBE_CMD;
        mqttClient.current.send(message);

        // Optimistic UI update
        setLedStatus(!ledStatus);
    };

    return (
        <View style={styles.container}>
            <View style={styles.topbar}>
                <Text style={styles.topbarTitle}>Dashboard IoT (Wokwi)</Text>
            </View>

            <ScrollView style={styles.content} contentContainerStyle={{ paddingBottom: 30 }}>
                {/* Status da Conexão */}
                <View style={styles.connectionCard}>
                    <View style={styles.row}>
                        <Ionicons name={connected ? 'wifi' : 'wifi-outline'} size={32} color={connected ? '#52B788' : '#6B8E92'} />
                        <View style={{ marginLeft: 15, flex: 1 }}>
                            <Text style={styles.cardTitle}>Status MQTT</Text>
                            <Text style={styles.cardSubtitle}>Broker: 74.249.83.253</Text>
                        </View>
                        <TouchableOpacity
                            style={[styles.btnConnect, connected && styles.btnDisconnect]}
                            onPress={handleConnect}
                        >
                            <Text style={styles.btnConnectText}>{connected ? 'Desconectar' : 'Conectar'}</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Sensores (Entradas) - MQTT Subscribe Simulator */}
                <Text style={styles.sectionTitle}>Sensores - Tópicos (Recebendo)</Text>

                <View style={styles.sensorGrid}>
                    <View style={styles.sensorCard}>
                        <Ionicons name="thermometer" size={28} color="#E8672A" />
                        <Text style={styles.sensorValue}>{connected ? temperature : '--'} °C</Text>
                        <Text style={styles.sensorLabel}>Temperatura</Text>
                        <Text style={styles.topicLabel}>/TEF/EnvM001/attrs/t</Text>
                    </View>

                    <View style={styles.sensorCard}>
                        <Ionicons name="water" size={28} color="#457B9D" />
                        <Text style={styles.sensorValue}>{connected ? humidity : '--'} %</Text>
                        <Text style={styles.sensorLabel}>Umidade</Text>
                        <Text style={styles.topicLabel}>/TEF/EnvM001/attrs/h</Text>
                    </View>

                    <View style={styles.sensorCard}>
                        <Ionicons name="sunny" size={28} color="#F4A261" />
                        <Text style={styles.sensorValue}>{connected ? luminosity : '--'}</Text>
                        <Text style={styles.sensorLabel}>Luminosidade</Text>
                        <Text style={styles.topicLabel}>/TEF/EnvM001/attrs/l</Text>
                    </View>
                </View>

                {/* Atuadores (Saídas) - MQTT Publish Simulator */}
                <Text style={styles.sectionTitle}>Atuadores - Envios (Publicando)</Text>

                <View style={styles.actuatorCard}>
                    <View style={styles.row}>
                        <Ionicons name={ledStatus ? 'bulb' : 'bulb-outline'} size={32} color={ledStatus ? '#F4A261' : '#6B8E92'} />
                        <View style={{ marginLeft: 15, flex: 1 }}>
                            <Text style={styles.cardTitle}>LED Onboard (D4)</Text>
                            <Text style={styles.topicLabel}>Comando: /TEF/EnvM001/cmd</Text>
                            <Text style={styles.topicLabel}>Payload: {ledStatus ? 'EnvM001@on|' : 'EnvM001@off|'}</Text>
                        </View>
                        <Switch
                            value={ledStatus}
                            onValueChange={toggleLed}
                            thumbColor={ledStatus ? '#F4A261' : '#f4f3f4'}
                            trackColor={{ false: '#767577', true: '#52B788' }}
                        />
                    </View>
                </View>

            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#1A1A2E' },
    topbar: { backgroundColor: '#16213E', paddingVertical: 15, paddingHorizontal: 16, borderBottomWidth: 1, borderBottomColor: '#2A4058' },
    topbarTitle: { color: '#F1FAEE', fontWeight: 'bold', fontSize: 16 },
    content: { flex: 1, padding: 16 },

    row: { flexDirection: 'row', alignItems: 'center' },
    sectionTitle: { fontSize: 12, fontWeight: 'bold', color: '#6B8E92', textTransform: 'uppercase', marginBottom: 12, marginTop: 10 },

    connectionCard: { backgroundColor: '#1E2D3A', borderWidth: 1, borderColor: '#2A4058', borderRadius: 12, padding: 16, marginBottom: 20 },
    cardTitle: { color: '#F1FAEE', fontSize: 16, fontWeight: 'bold' },
    cardSubtitle: { color: '#A8DADC', fontSize: 12, marginTop: 4 },
    topicLabel: { color: '#6B8E92', fontSize: 10, marginTop: 4, fontFamily: 'monospace' },

    btnConnect: { backgroundColor: '#52B788', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8 },
    btnDisconnect: { backgroundColor: '#E63946' },
    btnConnectText: { color: '#FFF', fontWeight: 'bold', fontSize: 12 },

    sensorGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, justifyContent: 'space-between', marginBottom: 20 },
    sensorCard: { width: '48%', backgroundColor: '#1E2D3A', borderWidth: 1, borderColor: '#2A4058', borderRadius: 12, padding: 16, alignItems: 'center', marginBottom: 10 },
    sensorValue: { color: '#F1FAEE', fontSize: 24, fontWeight: 'bold', marginVertical: 8 },
    sensorLabel: { color: '#A8DADC', fontSize: 13, fontWeight: '500' },

    actuatorCard: { backgroundColor: '#1E2D3A', borderWidth: 1, borderColor: '#2A4058', borderRadius: 12, padding: 16, marginBottom: 20 },
});
