# MotoConnect - Challenge 2025 FIAP

Aplicativo mobile desenvolvido em React Native + Expo + TypeScript para gerenciamento de motos.

## 📱 Sobre o Aplicativo

MotoConnect é uma solução completa para gerenciamento de motocicletas, oferecendo funcionalidades de cadastro, listagem, autenticação e notificações push.

## ✨ Funcionalidades

- ✅ **Autenticação JWT** - Login seguro com token
- ✅ **CRUD Completo de Motos** - Criar, Ler, Atualizar e Deletar veículos
- ✅ **Integração com API REST** - Backend .NET/Java
- ✅ **Push Notifications** - Notificações em tempo real
- ✅ **Dark Mode** - Tema claro e escuro com persistência
- ✅ **Internacionalização** - Suporte a Português (PT-BR) e Espanhol (ES)
- ✅ **AsyncStorage** - Persistência local de dados
- ✅ **Paginação** - Listagem otimizada de veículos
- ✅ **Filtros e Busca** - Busca por placa e filtro por modelo
- ✅ **Validação de Formulários** - Feedback em tempo real
- ✅ **Loading States** - Indicadores de carregamento
- ✅ **Pull to Refresh** - Atualização de dados

## 🛠️ Tecnologias Utilizadas

- **React Native** - Framework mobile
- **Expo SDK 54** - Plataforma de desenvolvimento
- **TypeScript** - Tipagem estática
- **React Navigation** - Navegação entre telas
- **NativeWind** - TailwindCSS para React Native
- **Axios** - Cliente HTTP
- **i18next** - Internacionalização
- **Expo Notifications** - Push Notifications
- **AsyncStorage** - Armazenamento local
- **Expo Font** - Fontes customizadas (Inter, Red Hat Display)

## 📂 Estrutura de Pastas

```
moto-connect-app/
├── assets/                     # Recursos estáticos
│   └── images/                 # Imagens (logo, banner, rfid)
├── src/                        # Código-fonte
│   ├── components/             # Componentes reutilizáveis
│   │   ├── BackgroundStripes.tsx
│   │   ├── CustomButton.tsx
│   │   ├── CustomInput.tsx
│   │   ├── DrawerMenu.tsx
│   │   ├── Logo.tsx
│   │   └── Menu.tsx
│   ├── contexts/               # Contexts da aplicação
│   │   ├── ThemeContext.tsx    # Gerenciamento de tema
│   │   ├── NotificationContext.tsx  # Push notifications
│   │   └── LanguageContext.tsx # Internacionalização
│   ├── locales/                # Arquivos de tradução
│   │   ├── i18n.ts             # Configuração i18next
│   │   ├── pt-BR.json          # Traduções PT-BR
│   │   └── es.json             # Traduções Espanhol
│   ├── routes/                 # Configuração de navegação
│   │   └── index.tsx           # Stack Navigator
│   ├── screens/                # Telas do aplicativo
│   │   ├── About/              # Tela Sobre (com hash do commit)
│   │   ├── ErrorScreen/        # Tela de erro
│   │   ├── Home/               # Tela inicial
│   │   ├── Login/              # Tela de login
│   │   ├── MotorcycleList/     # Listagem de motos
│   │   ├── MotorcycleRegistration/  # Cadastro de motos
│   │   ├── Register/           # Cadastro de usuário
│   │   ├── RFIDScreen/         # Simulação RFID
│   │   ├── Settings/           # Configurações (idioma/tema)
│   │   └── SuccessScreen/      # Tela de sucesso
│   └── services/               # Serviços externos
│       └── api.ts              # Cliente API REST
├── android/                    # Configurações Android
├── ios/                        # Configurações iOS
├── App.tsx                     # Componente raiz
├── app.json                    # Configuração Expo
├── package.json                # Dependências
├── tailwind.config.js          # Configuração TailwindCSS
└── tsconfig.json               # Configuração TypeScript
```

## 👥 Integrantes

| Nome | RM | GitHub |
|------|-----|--------|
| Mateus H. Souza | RM558424 | [@mateussouza](https://github.com/mateussouza) |
| Lucas Fialho | RM557884 | [@lucasfialho](https://github.com/lucasfialho) |
| Cauan Passos | RM555466 | [@cauanpassos](https://github.com/cauanpassos) |

## � Comoo Executar

### Pré-requisitos

- Node.js 18+
- npm ou yarn
- Expo CLI
- Android Studio ou Xcode (para emuladores)

### Instalação

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/moto-connect-app.git

# Entre na pasta
cd moto-connect-app

# Instale as dependências
npm install

# Configure as variáveis de ambiente
cp env.example.txt .env

# Inicie o projeto
npx expo start
```

### Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
EXPO_PUBLIC_API_URL=https://webapp-motoconnect-557884.azurewebsites.net/api
```

## 📱 Telas Implementadas

1. **Login** - Autenticação com JWT, validação, remember me
2. **Register** - Cadastro de usuário com validação completa
3. **Home** - Dashboard com cards de acesso rápido
4. **MotorcycleRegistration** - Cadastro de motos com formatação automática
5. **MotorcycleList** - Listagem paginada com filtros e busca
6. **RFIDScreen** - Simulação de leitura RFID
7. **SuccessScreen** - Feedback de sucesso
8. **ErrorScreen** - Tratamento de erros
9. **Settings** - Configurações de idioma, tema e notificações
10. **About** - Informações do app e hash do commit

## 🌐 API Endpoints Utilizados

### Autenticação
- `POST /Auth/login` - Login de usuário

### Usuários
- `GET /User` - Listar usuários (paginado)
- `POST /User` - Criar usuário
- `GET /User/{id}` - Buscar usuário por ID
- `PUT /User/{id}` - Atualizar usuário
- `DELETE /User/{id}` - Deletar usuário

### Veículos
- `GET /Vehicles` - Listar veículos (paginado)
- `POST /Vehicles` - Criar veículo
- `GET /Vehicles/{id}` - Buscar veículo por ID
- `PUT /Vehicles/{id}` - Atualizar veículo
- `DELETE /Vehicles/{id}` - Deletar veículo

### Histórico de Manutenção
- `GET /Histories` - Listar históricos (paginado)
- `POST /Histories` - Criar histórico
- `GET /Histories/{id}` - Buscar histórico por ID
- `PUT /Histories/{id}` - Atualizar histórico
- `DELETE /Histories/{id}` - Deletar histórico

## 🎨 Temas

O aplicativo suporta 3 modos de tema:
- **Claro** - Tema light
- **Escuro** - Tema dark
- **Sistema** - Segue a preferência do dispositivo

A preferência é salva no AsyncStorage e persiste entre sessões.

## 🌍 Idiomas Suportados

- 🇧🇷 Português (PT-BR)
- 🇪🇸 Espanhol (ES)

Troca automática baseada no idioma do dispositivo ou manual via Settings.

## 🔔 Push Notifications

Implementado com Expo Notifications:
- Notificação de boas-vindas no login
- Notificação ao cadastrar nova moto
- Configurável via Settings

## 📦 Build e Publicação

### Build com EAS

```bash
# Instalar EAS CLI
npm install -g eas-cli

# Login no Expo
eas login

# Configurar projeto
eas build:configure

# Build Android
eas build --platform android

# Build iOS
eas build --platform ios
```

### Firebase App Distribution

O app está configurado para publicação no Firebase App Distribution. Siga os passos em `CONFIG.md` para configurar.

## 🎥 Vídeo de Demonstração

[Assista ao vídeo de demonstração](https://www.youtube.com/watch?v=PLDdEBcDVXk)

## 📄 Licença

© 2025 FIAP - Todos os direitos reservados

## 🔖 Versão

**v1.0.0** - Build 1 - Commit: `00a2e5c`

---

Desenvolvido com ❤️ para o Challenge 2025 FIAP
