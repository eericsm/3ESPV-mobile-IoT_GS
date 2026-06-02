import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { CompositeScreenProps } from '@react-navigation/native';

// Estrutura de dados da estufa
export interface Sensoriamento {
    temperatura: number;
    umidade: number;
    agua: number;
    luz?: number;
}

export interface Estufa {
    id: string;
    nome: string;
    tipo: string;
    area: number;
    foto?: string | null;
    dados: Sensoriamento;
}

// Tipagem das telas (Stack e Tabs)
export type RootStackParamList = {
    HomeTabs: undefined;
    Success: { id: string; nome: string }; // Exemplo de passagem de parâmetro
    Detalhes: { estufaId: string };
};

export type TabParamList = {
    Home: undefined;
    Estufas: undefined;
    Cadastro: undefined;
    Relatorios: undefined;
    IoT: undefined;
};

// Tipagem utilitária para usar nas props das telas
export type RootStackScreenProps<T extends keyof RootStackParamList> = NativeStackScreenProps<RootStackParamList, T>;
export type RootTabScreenProps<T extends keyof TabParamList> = CompositeScreenProps<
    BottomTabScreenProps<TabParamList, T>,
    NativeStackScreenProps<RootStackParamList>
>;
