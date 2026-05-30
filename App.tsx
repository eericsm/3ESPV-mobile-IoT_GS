import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList, TabParamList } from './src/types';

// Importe as suas telas aqui
import CadastroScreen from './src/screens/CadastroScreen';
import SuccessScreen from './src/screens/SuccessScreen';
import HomeScreen from './src/screens/HomeScreen';
import EstufasListScreen from './src/screens/EstufasListScreen';
import DetalhesScreen from './src/screens/DetalhesScreen';
import RelatoriosScreen from './src/screens/RelatoriosScreen';

// Criação dos navegadores tipados
const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

// Renderizar telas Placeholder apenas para visualizar
const PlaceholderScreen = () => null;

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
                    return <Ionicons name={iconName} size={size} color={color} />;
                },
            })}
        >
            <Tab.Screen name="Home" component={HomeScreen} />
            <Tab.Screen name="Estufas" component={EstufasListScreen} />
            <Tab.Screen name="Cadastro" component={CadastroScreen} />
            <Tab.Screen name="Relatorios" component={RelatoriosScreen} />
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
