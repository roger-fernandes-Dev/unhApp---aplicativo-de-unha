# Módulo de Storage (AsyncStorage)

## Visão geral

Este módulo é responsável por **persistir dados locais do aplicativo** utilizando `@react-native-async-storage/async-storage`.

Ele centraliza toda a lógica de:

* Sessão da manicure (login/logout)
* Perfis de manicures
* Clientes vinculados a cada manicure

O objetivo é garantir **isolamento de dados por manicure** e facilitar manutenção, leitura e reutilização do código.

---

## Estrutura de dados no AsyncStorage

### Chaves utilizadas

| Chave                  | Descrição                                    |
| ---------------------- | -------------------------------------------- |
| `@current_manicure_id` | ID da manicure atualmente logada             |
| `@profiles_by_id`      | Objeto com todos os perfis, indexados por ID |
| `@clients_by_manicure` | Clientes agrupados por ID da manicure        |

### Exemplo de estrutura

```json
{
  "@profiles_by_id": {
    "abc123": {
      "id": "abc123",
      "name": "Maria",
      "priceAvulso": 50,
      "pricePacote": 180,
      "createdAt": "2025-01-01"
    }
  },
  "@clients_by_manicure": {
    "abc123": [
      {
        "id": "c1",
        "name": "Ana",
        "type": "avulso",
        "nextDate": "2025-01-10",
        "nextTime": "14:00",
        "attended": false
      }
    ]
  }
}
```

---

## Sessão da manicure

### `setCurrentManicure(manicureId)`

Define a manicure logada no app.

### `getCurrentManicure()`

Retorna o ID da manicure atual ou `null` se não houver sessão.

### `clearCurrentManicure()`

Remove a sessão (logout).

---

## Perfil da manicure

### Interface `ManicureProfile`

Define o formato do perfil da manicure:

* `id`
* `name`
* `priceAvulso`
* `pricePacote`
* `createdAt`

### `saveProfile(profile)`

Salva ou atualiza um perfil no storage e **já inicia a sessão** da manicure.

### `getProfile()`

Retorna o perfil da manicure atualmente logada.

### `findProfileByName(name)`

Permite login buscando o perfil pelo nome (case-insensitive).

---

## Clientes

### `getClient()`

Retorna a lista de clientes da manicure logada.

### `saveClients(clients)`

Salva a lista completa de clientes da manicure atual.

### `addClient(newClient)`

Adiciona um novo cliente mantendo os existentes.

> Cada manicure possui **sua própria lista**, isolada por ID.

---

## Reset total (uso em desenvolvimento)

### `clearAllData()`

Remove **todos os dados do AsyncStorage**:

* sessão
* perfis
* clientes

⚠️ **Usar apenas em ambiente de desenvolvimento ou testes.**

---

## Observações importantes

* Todo acesso a clientes depende de uma manicure logada
* Não há backend: os dados são 100% locais
* O módulo foi projetado para ser simples, previsível e fácil de evoluir

---

## Responsabilidade do módulo

> Este arquivo **não contém lógica de UI**.

Ele é responsável apenas por **persistência, recuperação e organização dos dados locais do app**.
