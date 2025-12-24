# 💅 Aplicativo de Manicure – Componentes Reutilizáveis

Coleção de componentes reutilizáveis desenvolvidos em **React Native + Expo**, focados em formulários, agendamentos, navegação e seleção de mídia, seguindo boas práticas de **tipagem**, **reutilização** e **legibilidade**.

---

## 📑 Sumário

- [Tecnologias Utilizadas](#-tecnologias-utilizadas)
- [BotaoAvancar](#-componente-botaoavancar)
- [CaixadeEntrada](#-componente-caixadeentrada)
- [ImagePickerCliente](#-componente-imagepickercliente)
- [InputDatePicker](#-componente-inputdatepicker)
- [InputTimePicker](#-componente-inputtimepicker)
- [Como Executar o Projeto](#-como-executar-o-projeto)
- [Objetivo do Projeto](#-objetivo-do-projeto)

---

## 🛠️ Tecnologias Utilizadas

- React Native  
- Expo  
- TypeScript  
- Expo Router  
- React Native Paper  
- react-native-paper-dates  
- expo-image-picker  
- react-native-modal-datetime-picker  

---

## 🧩 Componente: BotaoAvancar

Componente reutilizável responsável por exibir um botão de ação principal, utilizado para navegação entre telas ou execução de lógica customizada.

### 🎯 Objetivo

- Padronizar botões de avanço no aplicativo  
- Permitir navegação via Expo Router  
- Executar ações customizadas  

### 🔄 Comportamento

Prioridade de execução:

1. Executa `onPress`, se informado  
2. Caso contrário, navega para a rota definida em `to`  
3. Se nenhuma prop for passada, não executa ação  

### 🧠 Props

| Propriedade | Tipo | Obrigatória | Descrição |
|------------|------|-------------|----------|
| text | string | ✅ | Texto exibido no botão |
| to | string | ❌ | Rota de navegação |
| onPress | () => void \| Promise<void> | ❌ | Ação customizada |

### 📌 Exemplo de Uso

```tsx
<BotaoAvancar text="Avançar" to="/CadastroCliente" />


🧩 Componente: CaixadeEntrada

Componente reutilizável para entrada de texto, baseado em React Native Paper, respeitando áreas seguras da tela.

🎯 Objetivo

Padronizar campos de formulário

Facilitar reutilização

Manter layout consistente

🔄 Comportamento

Renderiza um TextInput

Dispara onChangeText a cada alteração

Não mantém estado interno

🧠 Props
Propriedade	Tipo	Obrigatória	Descrição
name	string	✅	Label do campo
onChangeText	(text: string) => void	✅	Callback de alteração
📌 Exemplo de Uso
<CaixadeEntrada
  name="Nome da cliente"
  onChangeText={setName}
/>
<ImagePickerCliente
  onChange={(uri) => setFotoCliente(uri)}
/>
🧩 Componente: ImagePickerCliente

Componente responsável por permitir a seleção de imagens da galeria, exibindo uma pré-visualização em formato de avatar.

🎯 Objetivo

Facilitar cadastro de imagens

Oferecer feedback visual imediato

Retornar a URI da imagem

🔄 Comportamento

Abre a galeria do dispositivo

Permite apenas imagens

Exibe avatar padrão ou imagem selecionada

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

Campo não editável

Localização em português

Retorno em formato ISO 8601

🧠 Props
Propriedade	Tipo	Obrigatória	Descrição
onChangeDate	(date: string) => void	❌	Retorna data em formato ISO
📌 Exemplo de Uso
<InputDatePicker
  onChangeDate={(date) => console.log(date)}
/>

⏰ Componente: InputTimePicker

Componente reutilizável para seleção de horário, utilizando modal nativo.

🎯 Objetivo

Evitar digitação manual e garantir consistência no formato de horário.

✅ Funcionalidades

Modal de horário

Formatação automática HH:mm

Campo somente leitura

🧠 Props
Propriedade	Tipo	Obrigatória	Descrição
onChangeTime	(value: string) => void	✅	Retorna horário formatado
📌 Exemplo de Uso
<InputTimePicker
  onChangeTime={(time) => setHorario(time)}
/>

▶️ Como Executar o Projeto
Instalar dependências
npm install

Iniciar o projeto
npx expo start

🎯 Objetivo do Projeto

Criar base sólida de componentes reutilizáveis

Praticar React Native + Expo

Servir como projeto de portfólio

Evoluir para um sistema completo de agendamento


