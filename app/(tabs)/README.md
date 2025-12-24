# 📱 Aplicativo de Gestão para Manicure

## 🧱 Visão Geral
App offline para controle de clientes, valores e histórico de atendimentos.

---

## 🔐 Tela: Home (Login)

### Descrição
Tela inicial responsável pelo login da manicure e verificação de sessão ativa.

### Responsabilidades
- Verificar sessão salva
- Login pelo nome
- Redirecionar para perfil
- Acesso à criação de conta

### Fluxo
1. Verifica se existe manicure logada
2. Se existir → redireciona para Perfil
3. Se não existir → exibe formulário
4. Usuária entra com o nome
5. Sessão é salva no AsyncStorage

### Regras
- Login sem senha
- Funciona offline
- Sessão persistente

---

## 👤 Tela: Perfil
*(descrição da próxima tela que você mandar)*

---

## 📊 Tela: Histórico
*(entra depois)*

---

## 💾 Persistência Local
- AsyncStorage
- Sessão por ID
- Dados separados por manicure

---

## 🚀 Tecnologias
- Expo + React Native
- Expo Router
- React Native Paper
- AsyncStorage
