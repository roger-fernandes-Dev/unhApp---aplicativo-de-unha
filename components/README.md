# 🧩 Componentes Reutilizáveis – Aplicativo de Manicure

Coleção de **componentes reutilizáveis** desenvolvidos em **React Native + Expo**, focados em formulários, agendamentos, navegação e seleção de mídia, seguindo boas práticas de **tipagem**, **reutilização** e **legibilidade**.

---

## 📑 Sumário

- [BotaoAvancar](#-componente-botaoavancar)
- [CaixadeEntrada](#-componente-caixadeentrada)
- [ImagePickerCliente](#-componente-imagepickercliente)
- [InputDatePicker](#-componente-inputdatepicker)
- [InputTimePicker](#-componente-inputtimepicker)
- [Tecnologias Utilizadas](#️-tecnologias-utilizadas)

---

## 🧩 Componente: BotaoAvancar

Componente reutilizável responsável por exibir um **botão de ação principal**, utilizado para **navegação entre telas** ou **execução de lógica customizada**.

### 🎯 Objetivo

Padronizar botões de avanço no aplicativo, permitindo:

- Navegação simples via **Expo Router**
- Execução de ações customizadas (ex: salvar dados)
- Reutilização em múltiplas telas

### 🔄 Comportamento

Prioridade de execução:

1. Executa `onPress`, se informado  
2. Caso contrário, navega para a rota definida em `to`  
3. Se nenhuma prop for passada, o botão não executa ação  

### 🧠 Props

| Propriedade | Tipo | Obrigatória | Descrição |
|------------|------|-------------|----------|
| `text` | `string` | ✅ | Texto exibido no botão |
| `to` | `string` | ❌ | Rota de navegação |
| `onPress` | `() => void \| Promise<void>` | ❌ | Ação customizada |

### 📌 Exemplo de Uso

```tsx
<BotaoAvancar text="Avançar" to="/CadastroCliente" />
<CaixadeEntrada
  name="Nome da cliente"
  onChangeText={setName}
/>
🧩 Componente: ImagePickerCliente

Componente responsável por permitir a seleção de imagens da galeria, exibindo uma pré-visualização em formato de avatar.

🎯 Objetivo

Facilitar cadastro de imagens

Oferecer feedback visual imediato

Comunicar a URI da imagem ao componente pai

🔄 Comportamento

Abre a galeria do dispositivo

Permite selecionar apenas imagens

Exibe a imagem escolhida ou ícone padrão

Retorna a URI via callback

🧠 Props
Propriedade	Tipo	Obrigatória	Descrição
onChange	(uri: string) => void	❌	Retorna a URI da imagem
📌 Exemplo de Uso
<ImagePickerCliente
  onChange={(uri) => setFotoCliente(uri)}
/>
🧩 Componente: InputDatePicker

Componente reutilizável para seleção de datas, com bloqueio total de datas passadas.

🎯 Objetivo

Garantir seleção segura de datas futuras, evitando erros de agendamento.

✅ Funcionalidades

Calendário modal

Bloqueio de datas passadas (UI + lógica)

Campo não editável manualmente

Localização em português

Retorno em formato ISO 8601

🧠 Props
Propriedade	Tipo	Obrigatória	Descrição
onChangeDate	(date: string) => void	❌	Retorna a data em formato ISO
📌 Exemplo de Uso
🧩 Componente: InputDatePicker

Componente reutilizável para seleção de datas, com bloqueio total de datas passadas.

🎯 Objetivo

Garantir seleção segura de datas futuras, evitando erros de agendamento.

✅ Funcionalidades

Calendário modal

Bloqueio de datas passadas (UI + lógica)

Campo não editável manualmente

Localização em português

Retorno em formato ISO 8601

🧠 Props
Propriedade	Tipo	Obrigatória	Descrição
onChangeDate	(date: string) => void	❌	Retorna a data em formato ISO
📌 Exemplo de Uso
<InputDatePicker
  onChangeDate={(date) => console.log(date)}
/>
⏰ Componente: InputTimePicker

Componente reutilizável para seleção de horário, utilizando modal nativo e retorno padronizado.

🎯 Objetivo

Evitar digitação manual e garantir consistência no formato de horário.

✅ Funcionalidades

Modal de seleção de horário

Formatação automática (HH:mm)

Campo somente leitura

Callback para integração com formulários

🧠 Props
Propriedade	Tipo	Obrigatória	Descrição
onChangeTime	(value: string) => void	✅	Retorna o horário formatado
📌 Exemplo de Uso
<InputTimePicker
  onChangeTime={(time) => setHorario(time)}
/>
🛠️ Tecnologias Utilizadas

React Native

Expo

TypeScript

Expo Router

React Native Paper

react-native-paper-dates

expo-image-picker

react-native-modal-datetime-picker