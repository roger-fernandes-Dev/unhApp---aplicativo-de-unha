# Aplicativo de Gestão para Manicure

Aplicativo mobile desenvolvido em **React Native + Expo**, focado na organização de **clientes**, **agenda** e **histórico de atendimentos**, utilizando armazenamento local (offline).

---

## Sumário

- [Visão Geral](#visão-geral)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Telas do Aplicativo](#telas-do-aplicativo)
  - [CadastroCliente](#cadastrocliente)
  - [NewAccount (Criar Conta)](#newaccount-criar-conta)
  - [NewCliente (Nova Cliente)](#newcliente-nova-cliente)
  - [Perfil](#perfil)
  - [Histórico](#histórico)
- [Estrutura de Dados](#estrutura-de-dados)
- [Persistência Local](#persistência-local)

---

## Visão Geral

O aplicativo permite que a manicure:

- Crie sua conta
- Cadastre clientes
- Gerencie atendimentos futuros
- Marque atendimentos como realizados
- Consulte o histórico de atendimentos

Toda a lógica do aplicativo funciona **offline**, utilizando **AsyncStorage** como base de dados local.

---

## Tecnologias Utilizadas

- React Native
- Expo Router
- React Native Paper
- React Native Paper Dates
- AsyncStorage
- TypeScript

---

## Telas do Aplicativo

---

## CadastroCliente

### Descrição

Tela responsável pelo **cadastro do primeiro cliente** da manicure.  
Após esse cadastro inicial, o acesso a esta tela é **bloqueado permanentemente**.

### Funcionalidades

- Cadastro de cliente do tipo **Avulso** ou **Pacote**
- Seleção de data e horário do próximo atendimento
- Saudação personalizada com o nome da manicure
- Validações completas de data e horário
- Persistência local do cliente cadastrado

### Regras de Negócio

- A tela pode ser acessada apenas **uma única vez**
- Não permite:
  - Campos vazios
  - Datas passadas
  - Horários vencidos no dia atual
  - Conflito de data + horário
- Após o cadastro, redireciona automaticamente para **Perfil**

### Arquivo

`CadastroCliente.tsx`

---

## NewAccount (Criar Conta)

### Descrição

Responsável pelo **cadastro inicial da manicure** no aplicativo.

### Objetivo

Permitir que a usuária informe:

- Nome da manicure
- Valor do atendimento avulso
- Valor do pacote

### Fluxo de Funcionamento

1. Validação dos campos obrigatórios
2. Geração de `id` único via timestamp
3. Salvamento dos dados no armazenamento local
4. Redirecionamento automático para **CadastroCliente**

### Regras de Negócio

- Nenhum campo pode ser salvo vazio
- Valores financeiros são convertidos para `number`
- Após o cadastro, a manicure já fica autenticada

### Arquivo

`NewAccount.tsx`

---

## NewCliente (Nova Cliente)

### Descrição

Tela responsável pelo **cadastro manual de clientes**, após a conta da manicure já estar criada.

### Objetivo

Cadastrar uma cliente informando:

- Nome
- Tipo de atendimento (Avulso ou Pacote)
- Data da próxima sessão
- Horário da próxima sessão

### Fluxo de Funcionamento

1. Verifica se existe sessão ativa
2. Caso não exista, redireciona para login
3. Valida todos os campos obrigatórios
4. Salva o cliente no armazenamento local
5. Retorna automaticamente para **Perfil**

### Regras de Negócio

- Nome, data e horário são obrigatórios
- Tipos permitidos:
  - `avulso`
  - `pacote`
- Cada cliente recebe um `id` único

### Observações Técnicas

- Data no formato `YYYY-MM-DD`
- Horário no formato `HH:mm`
- Feedback ao usuário via `Snackbar`

### Arquivo

`NewCliente.tsx`

---

## Perfil

### Descrição

Tela principal do aplicativo, responsável por **gerenciar a agenda da manicure**.

### Funcionalidades

- Exibição dos dados da manicure
- Listagem de clientes ordenada cronologicamente
- Marcação de atendimento realizado
- Destaque visual para atendimentos do dia
- Edição de data e horário
- Exclusão de clientes
- Logout
- Acesso à tela de histórico

### Regras de Negócio

- Clientes marcados como atendidos não podem ser editados
- Ordenação baseada em data + horário reais
- Alterações são salvas automaticamente

### Fluxo

1. Carrega perfil da manicure
2. Busca clientes salvos
3. Ordena cronologicamente
4. Permite ações individuais
5. Persiste alterações

### Arquivo

`Perfil.tsx`

---

## Histórico

### Descrição

Exibe todos os **atendimentos já realizados** pela manicure.

### Objetivo

- Mostrar apenas clientes com `attended === true`
- Exibir data, horário e tipo de atendimento
- Exibir valor apenas para clientes avulsos

### Fluxo de Funcionamento

1. Busca todos os clientes salvos
2. Filtra apenas os atendidos
3. Ordena do mais recente para o mais antigo
4. Renderiza a lista com separadores visuais

### Regras de Negócio

- Clientes do tipo `PACOTE` não exibem valor
- Clientes do tipo `AVULSO` exibem valor do atendimento
- Caso não existam registros, uma mensagem informativa é exibida

### Arquivo

`Historico.tsx`

---

## Estrutura de Dados

```ts
interface Client {
  id: string;
  name: string;
  type: 'avulso' | 'pacote';
  nextDate: string;
  nextTime: string;
  attended?: boolean;
  value?: number;
}
Persistência Local

A aplicação utiliza AsyncStorage através de uma camada de abstração (localStorage.ts).

Funções principais

saveProfile()

getProfile()

getCurrentManicure()

addClient()

getClient()

saveClients()

clearCurrentManicure()

Benefícios

Funcionamento offline

Simplicidade

Manutenção facilitada
