# Tutorial: Deploy no Firebase App Distribution

Este tutorial guia você através do processo completo de publicação do aplicativo MotoConnect no Firebase App Distribution usando EAS Build.

## Índice

1. [Pré-requisitos](#pré-requisitos)
2. [Configuração Inicial](#configuração-inicial)
3. [Build do Aplicativo](#build-do-aplicativo)
4. [Configuração do Firebase App Distribution](#configuração-do-firebase-app-distribution)
5. [Upload e Distribuição](#upload-e-distribuição)
6. [Adicionar Testers](#adicionar-testers)
7. [Troubleshooting](#troubleshooting)

---

## Pré-requisitos

Antes de começar, certifique-se de ter:

- [ ] Conta no [Expo](https://expo.dev/)
- [ ] Conta no [Firebase Console](https://console.firebase.google.com/)
- [ ] Node.js 18+ instalado
- [ ] EAS CLI instalado globalmente
- [ ] Projeto configurado com EAS (já está configurado)

### Instalar EAS CLI

Se ainda não tiver o EAS CLI instalado:

```bash
npm install -g eas-cli
```

Verificar instalação:

```bash
eas --version
```

---

## Configuração Inicial

### 1. Login no Expo

```bash
cd moto-connect-app
eas login
```

Digite suas credenciais do Expo quando solicitado.

### 2. Verificar Configuração do Projeto

O projeto já está configurado com:
- `eas.json` - Configuração do EAS Build
- `app.json` - Configuração do Expo com projectId

Verificar se o projectId está correto:

```bash
cat app.json | grep projectId
```

Deve mostrar: `"projectId": "383b3cdd-1217-4f2e-8e35-a2e5a3226c82"`

### 3. Configurar EAS Build (se necessário)

Se precisar reconfigurar:

```bash
eas build:configure
```

---

## Build do Aplicativo

### Opção 1: Build Android (Recomendado para Firebase App Distribution)

```bash
eas build --platform android --profile preview
```

Este comando irá:
1. Criar um build Android (APK ou AAB)
2. Fazer upload para os servidores do Expo
3. Processar o build (pode levar 10-30 minutos)
4. Fornecer um link para download

**Importante:** Escolha o formato **APK** quando solicitado, pois é mais fácil para distribuição via Firebase App Distribution.

### Opção 2: Build Local (Mais Rápido para Testes)

Se você tem Android Studio instalado e quer fazer build local:

```bash
eas build --platform android --profile preview --local
```

**Nota:** Builds locais requerem mais configuração e podem ter problemas de dependências.

### Monitorar o Build

Durante o processo, você verá:

```
Build started, it may take a few minutes to complete.
You can monitor the build at: https://expo.dev/accounts/[seu-usuario]/projects/moto-connect-app/builds/[build-id]
```

Aguarde até ver a mensagem:

```
Build finished successfully!
```

### Download do APK

Após o build completar:

1. Acesse o link fornecido no terminal
2. Ou acesse: https://expo.dev/accounts/[seu-usuario]/projects/moto-connect-app/builds
3. Clique no build concluído
4. Baixe o arquivo **APK** (não o AAB)

---

## Configuração do Firebase App Distribution

### 1. Criar Projeto no Firebase Console

1. Acesse: https://console.firebase.google.com/
2. Clique em **"Adicionar projeto"** ou selecione um projeto existente
3. Se criar novo projeto:
   - Nome: `MotoConnect` (ou outro nome de sua escolha)
   - Aceite os termos
   - Configure Google Analytics (opcional)

### 2. Habilitar App Distribution

1. No menu lateral, vá em **"App Distribution"** (ou **"Distribuição de App"**)
2. Se não aparecer, clique em **"Ver mais produtos"** e procure por App Distribution
3. Clique em **"Começar"** ou **"Get Started"**

### 3. Registrar Aplicativo Android

1. Clique em **"Adicionar aplicativo"** ou **"Add app"**
2. Selecione **Android**
3. Preencha:
   - **Nome do app:** MotoConnect
   - **Package name:** `com.fiap.motoconnect` (deve corresponder ao `app.json`)
   - **App nickname:** MotoConnect (opcional)
4. Clique em **"Registrar aplicativo"**

### 4. Instalar Firebase CLI (Opcional mas Recomendado)

Para facilitar uploads futuros:

```bash
npm install -g firebase-tools
```

Login no Firebase:

```bash
firebase login
```

---

## Upload e Distribuição

### Método 1: Upload Manual (Mais Simples)

1. **Acesse o Firebase Console:**
   - Vá para: https://console.firebase.google.com/
   - Selecione seu projeto
   - Vá em **App Distribution**

2. **Faça Upload do APK:**
   - Clique em **"Distribuir nova versão"** ou **"Distribute new release"**
   - Arraste o arquivo APK baixado do EAS Build
   - Ou clique em **"Escolher arquivo"** e selecione o APK

3. **Preencha Informações:**
   - **Release notes:** Descreva as mudanças desta versão
     ```
     Versão 1.0.0 - Sprint 3
     - Implementação completa de todas as telas
     - Integração com API REST
     - Push Notifications
     - Internacionalização (PT-BR e ES)
     - Tema claro/escuro
     ```
   - **Build version:** 1.0.0
   - **Version code:** 1

4. **Clique em "Distribuir"**

### Método 2: Upload via Firebase CLI (Avançado)

Se você instalou o Firebase CLI:

```bash
firebase appdistribution:distribute caminho/para/seu/app.apk \
  --app APP_ID_DO_FIREBASE \
  --release-notes "Versão 1.0.0 - Sprint 3" \
  --groups "testers"
```

Para encontrar o APP_ID:
1. Vá no Firebase Console > App Distribution
2. Clique no app Android
3. O APP_ID está na URL ou nas configurações do app

---

## Adicionar Testers

### Adicionar Testers Individuais

1. No Firebase Console, vá em **App Distribution**
2. Clique em **"Testadores"** ou **"Testers"**
3. Clique em **"Adicionar testadores"**
4. Adicione os e-mails dos testers (ex: e-mail do professor)
5. Clique em **"Salvar"**

### Criar Grupo de Testers (Recomendado)

1. Vá em **"Grupos de testadores"** ou **"Tester groups"**
2. Clique em **"Criar grupo"**
3. Nome do grupo: `FIAP-Professores` (ou outro nome)
4. Adicione os e-mails dos testers
5. Clique em **"Salvar"**

### Distribuir para Testers

Ao fazer upload de uma nova versão:

1. Na tela de upload, em **"Distribuir para"**
2. Selecione:
   - Testadores individuais (marque os e-mails)
   - OU Grupos de testadores (marque o grupo criado)
3. Clique em **"Distribuir"**

### E-mail para Testers

Os testers receberão um e-mail com:
- Link para instalar o app
- Instruções de instalação
- Release notes

**Importante:** No Android, testers precisam permitir instalação de fontes desconhecidas nas configurações do dispositivo.

---

## Verificação Final

### Checklist de Deploy

- [ ] Build Android concluído com sucesso
- [ ] APK baixado do EAS Build
- [ ] Projeto criado no Firebase Console
- [ ] App Android registrado no Firebase App Distribution
- [ ] APK enviado para o Firebase App Distribution
- [ ] E-mail do professor adicionado como tester
- [ ] Versão distribuída para os testers
- [ ] E-mail de confirmação recebido pelos testers

### Testar Instalação

1. Use um dos links de teste enviados por e-mail
2. Ou acesse o Firebase Console > App Distribution > Releases
3. Clique na versão mais recente
4. Use o link de teste para instalar em um dispositivo Android

---

## Troubleshooting

### Erro: "EAS CLI não encontrado"

```bash
npm install -g eas-cli
```

### Erro: "Not authenticated"

```bash
eas login
```

### Erro: "Build failed"

Verifique:
- Se todas as dependências estão instaladas: `npm install`
- Se o `app.json` está correto
- Se há erros de TypeScript: `npx tsc --noEmit`

### Erro: "Package name mismatch"

Certifique-se de que o package name no Firebase (`com.fiap.motoconnect`) corresponde ao `app.json`:

```json
"android": {
  "package": "com.fiap.motoconnect"
}
```

### Erro: "APK não instala no dispositivo"

No Android, o usuário precisa:
1. Ir em **Configurações > Segurança**
2. Habilitar **"Fontes desconhecidas"** ou **"Instalar apps desconhecidos"**
3. Permitir para o navegador usado (Chrome, etc.)

### Build demora muito

- Builds na nuvem do Expo levam 10-30 minutos normalmente
- Builds locais são mais rápidos mas requerem Android Studio
- Verifique o status em: https://expo.dev/accounts/[usuario]/projects/moto-connect-app/builds

### Não consigo encontrar App Distribution no Firebase

1. Certifique-se de que está usando um projeto Firebase válido
2. App Distribution pode não estar disponível em todos os planos
3. Verifique se o projeto tem billing habilitado (pode ser necessário para algumas funcionalidades)

---

## Comandos Úteis

### Ver builds anteriores

```bash
eas build:list
```

### Cancelar build em andamento

```bash
eas build:cancel [BUILD_ID]
```

### Ver informações do projeto

```bash
eas project:info
```

### Atualizar configuração EAS

```bash
eas build:configure
```

---

## Próximos Passos

Após o deploy bem-sucedido:

1. **Documentar no README:**
   - Adicionar link do Firebase App Distribution
   - Instruções para testers

2. **Atualizar versão:**
   - Incrementar `versionCode` no `app.json` para próximas versões
   - Atualizar `version` também

3. **Automatizar (Opcional):**
   - Configurar CI/CD para builds automáticos
   - Integrar com GitHub Actions

---

## Referências

- [Documentação EAS Build](https://docs.expo.dev/build/introduction/)
- [Firebase App Distribution](https://firebase.google.com/docs/app-distribution)
- [Expo Documentation](https://docs.expo.dev/)

---

## Suporte

Em caso de problemas:

1. Verifique os logs do build no Expo Dashboard
2. Consulte a documentação oficial
3. Verifique o status dos serviços: https://status.expo.dev/

---

**Última atualização:** 2025-01-XX
**Versão do tutorial:** 1.0.0

