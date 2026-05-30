# 🌱 AstroFarm

> **Global Solution FIAP - 3ESPV** <br>
> *Tecnologia de missões espaciais e cultivo em ambientes hostis aplicada de forma sustentável à agricultura terrestre.*

---

## 🚀 Sobre o Projeto

O **AstroFarm** é um aplicativo mobile desenvolvido com **React Native (Expo)** focado no monitoramento e gerenciamento inteligente de estufas de alta performance. 

Inspirado nos protocolos de suporte à vida e plantio em Marte, o aplicativo traz para a mão do agricultor a capacidade de gerenciar as condições vitais das plantas (temperatura, umidade, nível de água e luminosidade) através de uma interface intuitiva, com sensores em tempo real e um sistema de avisos e gestão preventiva.

## 📱 Funcionalidades

- **Dashboard (Missão Ativa):** Métricas consolidadas com a contagem de estufas, cultivos e panorama de alertas prioritários.
- **Cadastro Dinâmico:** Inserção de novos cultivos utilizando **integração nativa com a Câmera** para registro real do plantio.
- **Micro-Monitoramento:** Painel detalhado de cada estufa com:
  - Condições atuais dos sensores.
  - Etiqueta de status inteligente (Crítico, Atenção, Saudável).
  - Capacidade de exclusão e atualização (refresh) de aferições.
- **Alertas e Recomendações (IA):** O aplicativo cruza os dados dos sensores e entrega avisos autônomos e recomendações (ex: resfriamento urgente por estresse térmico, recarga do reservatório).
- **Relatórios:** Visão tabular histórica em formato de gráficos e barras.
- **Persistência de Dados (Offline):** Gravação integral das estufas direto na memória do celular utilizando `AsyncStorage`, para uso livre de redes.

## 🛠 Tecnologias Utilizadas

- **React Native** & **TypeScript**
- **Expo Framework (SDK 54)**
- **React Navigation v7** (Bottom Tabs & Native Stack)
- **AsyncStorage** para persistência de dados mobile
- **Expo Image Picker** (Acesso nativo à Câmera/Galeria)

## ⚙️ Como executar localmente

### Pré-requisitos
- [Node.js](https://nodejs.org/) instalado.
- Dispositivo físico com o App **Expo Go** instalado ou emulador configurado.

### Passos de Instalação e Execução

1. Clone este repositório para sua máquina:
   ```bash
   git clone git@github.com:eericsm/3ESPV-mobile_GS.git
   ```

2. Entre na pasta do projeto:
   ```bash
   cd astrofarm
   ```

3. Instale as dependências:
   ```bash
   npm install
   ```

4. Inicie o servidor do Expo:
   ```bash
   npm run start
   ```

### Visualizando o App
- **Mobile:** Usando o app do **Expo Go** em seu celular, escaneie o QR Code que surgirá no terminal do seu computador (verifique se os dispositivos estão na mesma rede de Wi-Fi).
- **Web:** Com o terminal aberto, aperte a tecla `w` para testar o sistema renderizado pelo seu navegador de internet padrão.

---
📱 *Projeto desenvolvido para a entrega da Global Solution.*
