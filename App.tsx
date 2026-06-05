import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { RootStackParamList, TabParamList } from './src/types';

// screens
import CadastroScreen from './src/screens/CadastroScreen';
import DetalhesScreen from './src/screens/DetalhesScreen';
import EstufasListScreen from './src/screens/EstufasListScreen';
import HomeScreen from './src/screens/HomeScreen';
import IoTDashboardScreen from './src/screens/IoTDashboardScreen';
import RelatoriosScreen from './src/screens/RelatoriosScreen';
import SuccessScreen from './src/screens/SuccessScreen';

// navegadores
const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

function TabNavigator() {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarStyle: { backgroundColor: '#16213E', borderTopColor: '#2A4058' },
                tabBarActiveTintColor: '#52B788',
                tabBarInactiveTintColor: '#6B8E92',
                tabBarIcon: ({ color, size }) => {
                    let iconName: any = 'home';
                    if (route.name === 'Estufas') iconName = 'leaf';
                    else if (route.name === 'Cadastro') iconName = 'add-circle';
                    else if (route.name === 'Relatorios') iconName = 'bar-chart';
                    else if (route.name === 'IoT') iconName = 'hardware-chip';
                    return <Ionicons name={iconName} size={size} color={color} />;
                },
            })}
        >
            <Tab.Screen name="Home" component={HomeScreen} />
            <Tab.Screen name="Estufas" component={EstufasListScreen} />
            <Tab.Screen name="Cadastro" component={CadastroScreen} />
            <Tab.Screen name="Relatorios" component={RelatoriosScreen} />
            <Tab.Screen name="IoT" component={IoTDashboardScreen} options={{ tabBarLabel: 'Sensores' }} />
        </Tab.Navigator>
    );
}

export default function App() {
    return (
        <SafeAreaProvider>
            <NavigationContainer>
                <Stack.Navigator screenOptions={{ headerShown: false }}>
                    <Stack.Screen name="HomeTabs" component={TabNavigator} />
                    <Stack.Screen name="Success" component={SuccessScreen} />
                    <Stack.Screen name="Detalhes" component={DetalhesScreen} />
                </Stack.Navigator>
            </NavigationContainer>
        </SafeAreaProvider>
    );
}
