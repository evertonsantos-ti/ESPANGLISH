# API REST - ESPANGLISH

Este arquivo concentra a documentação das rotas expostas pelo backend. Todas as rotas ficam sob o prefixo `/api`.

## Convencões gerais

- conteúdo em JSON
- `Content-Type: application/json`
- respostas de sucesso retornam objeto ou array JSON
- respostas de erro seguem o formato:

```json
{
  "error": "Mensagem do erro"
}
```

- status 400: erro de validação de payload ou parâmetros
- status 404: registro não encontrado
- status 201: criação de registro
- status 200: listagem, busca e atualização

## Health check

### GET /api/health

Retorna status da API.

Resposta esperada:

```json
{
  "status": "ok",
  "service": "ESPANGLISH"
}
```

## Eventos

### GET /api/eventos

Lista todos os eventos.

Resposta esperada:

```json
[
  {
    "id": 1,
    "nome": "Evento A",
    "competencia": 2025,
    "dataInicio": "2025-01-01T00:00:00.000Z",
    "dataFim": "2025-01-10T00:00:00.000Z",
    "ativo": true
  }
]
```

### GET /api/eventos/:id

Busca um evento pelo identificador.

Parâmetros:

- `id`: number

Resposta esperada: objeto único do evento.

### POST /api/eventos

Cria um evento.

Body:

```json
{
  "nome": "Evento de teste",
  "dataInicio": "2025-01-01",
  "dataFim": "2025-01-10",
  "competencia": 2025
}
```

Validações:

- `nome` obrigatório, string, tamanho 1-100
- `dataInicio` obrigatória, data válida
- `dataFim` obrigatória, data válida
- `dataFim >= dataInicio`
- `competencia` entre 2020 e 2100

Resposta esperada (201):

```json
{
  "id": 1,
  "nome": "Evento de teste",
  "dataInicio": "2025-01-01T00:00:00.000Z",
  "dataFim": "2025-01-10T00:00:00.000Z",
  "competencia": 2025
}
```

### PUT /api/eventos/:id

Atualiza um evento existente.

Body:

```json
{
  "nome": "Evento atualizado",
  "dataInicio": "2025-02-01",
  "dataFim": "2025-02-10",
  "competencia": 2025,
  "ativo": true
}
```

Resposta esperada (200): objeto do evento atualizado.

### POST /api/eventos/inativar-eventos-vencidos

Inativa eventos vencidos.

Body: opcional, normalmente vazio.

Resposta esperada:

```json
{
  "message": "Eventos vencidos foram inativados."
}
```

## Equipes

### GET /api/equipes

Lista todas as equipes.

### GET /api/equipes/:id

Busca uma equipe por id.

### POST /api/equipes

Body:

```json
{
  "idEvento": 1,
  "nome": "Equipe A"
}
```

Validações:

- `idEvento` obrigatório e numérico
- `nome` obrigatório, string não vazia

Resposta esperada (201):

```json
{
  "id": 1,
  "idEvento": 1,
  "nome": "Equipe A"
}
```

### PUT /api/equipes/:id

Body:

```json
{
  "idEvento": 1,
  "nome": "Equipe atualizada"
}
```

Resposta esperada (200): objeto da equipe atualizada.

## Categorias

### GET /api/categorias

Lista categorias.

### GET /api/categorias/:id

Busca categoria por id.

### POST /api/categorias

Body:

```json
{
  "idEvento": 1,
  "nome": "Categoria A",
  "ordem": 1
}
```

Validações:

- `idEvento` numérico
- `nome` string e não vazia
- `ordem` numérica

Resposta esperada (201):

```json
{
  "id": 1,
  "idEvento": 1,
  "nome": "Categoria A",
  "ordem": 1,
  "ativo": true
}
```

### PUT /api/categorias/:id

Body:

```json
{
  "idEvento": 1,
  "nome": "Categoria A",
  "ordem": 2,
  "ativo": true
}
```

Resposta esperada (200): categoria atualizada.

## Critérios

### GET /api/criterios

Lista critérios.

### GET /api/criterios/:id

Busca critério por id.

### POST /api/criterios

Body:

```json
{
  "idCategoria": 1,
  "nome": "Criatividade",
  "ordem": 1
}
```

Validações:

- `idCategoria` numérico
- `nome` string com valor válido
- `ordem` numérica

Resposta esperada (201):

```json
{
  "id": 1,
  "idCategoria": 1,
  "nome": "Criatividade",
  "ordem": 1,
  "ativo": true
}
```

### PUT /api/criterios/:id

Body:

```json
{
  "idCategoria": 1,
  "nome": "Criatividade",
  "ordem": 1,
  "ativo": true
}
```

## Jurados

### GET /api/jurados

Lista jurados.

### GET /api/jurados/:id

Busca jurado por id.

### POST /api/jurados

Body:

```json
{
  "idEvento": 1,
  "nome": "Jurado 1",
  "login": "jurado1"
}
```

Observação: conforme a migração database/migrations/004_login.sql a tabela JURADO possui o campo LOGIN (VARCHAR(100) NOT NULL e UNIQUE). O payload de criação deve fornecer o login do jurado.

Resposta esperada (201):

```json
{
  "id": 1,
  "idEvento": 1,
  "nome": "Jurado 1",
  "login": "jurado1",
  "ativo": true
}
```

### PUT /api/jurados/:id

Body:

```json
{
  "idEvento": 1,
  "nome": "Jurado 1",
  "login": "jurado1",
  "ativo": true
}
```

## Jurado-Categoria

### GET /api/jurado-categorias

Lista relacionamentos jurado-categoria.

### GET /api/jurado-categorias/:id

Busca relacionamento por id.

### POST /api/jurado-categorias

Body:

```json
{
  "idJurado": 1,
  "idCategoria": 2
}
```

Resposta esperada (201):

```json
{
  "id": 1,
  "idJurado": 1,
  "idCategoria": 2
}
```

## Avaliações

### GET /api/avaliacoes

Lista avaliações.

### GET /api/avaliacoes/:id

Busca avaliação por id.

### POST /api/avaliacoes

Body:

```json
{
  "idEquipe": 1,
  "idCategoria": 2,
  "idJurado": 3
}
```

Validações:

- `idEquipe` numérico
- `idCategoria` numérico
- `idJurado` numérico

Resposta esperada (201):

```json
{
  "id": 1,
  "idEquipe": 1,
  "idCategoria": 2,
  "idJurado": 3
}
```

## Notas

### GET /api/notas

Lista notas.

### GET /api/notas/:id

Busca nota por id.

### POST /api/notas

Body:

```json
{
  "idAvaliacao": 1,
  "idCriterio": 2,
  "nota": 85
}
```

Validações:

- `idAvaliacao` numérico
- `idCriterio` numérico
- `nota` numérica
- `nota` entre 0 e 100

Resposta esperada (201):

```json
{
  "id": 1,
  "idAvaliacao": 1,
  "idCriterio": 2,
  "nota": 85
}
```

### PUT /api/notas/:id

Body:

```json
{
  "idAvaliacao": 1,
  "idCriterio": 2,
  "nota": 90
}
```

Resposta esperada (200): nota atualizada.

## Movimentações de pontuação

### GET /api/movimentacoes-pontuacao

Lista movimentações de pontuação.

### GET /api/movimentacoes-pontuacao/:id

Busca movimentação por id.

### POST /api/movimentacoes-pontuacao

Body:

```json
{
  "idEvento": 1,
  "idEquipe": 2,
  "tipo": "PONTUACAO",
  "descricao": "Pontuação por participação",
  "pontos": 10
}
```

Validações:

- `idEvento` numérico
- `idEquipe` numérico
- `tipo` deve ser `BONUS`, `PENALIDADE` ou `PONTUACAO`
- `descricao` string não vazia
- `pontos` numérico e diferente de 0

Resposta esperada (201):

```json
{
  "id": 1,
  "idEvento": 1,
  "idEquipe": 2,
  "tipo": "PONTUACAO",
  "descricao": "Pontuação por participação",
  "pontos": 10,
  "dataLancamento": "2025-01-01T00:00:00.000Z"
}
```

## Erros esperados

Exemplos de mensagens retornadas:

```json
{ "error": "(ID) do evento inválido" }
```

```json
{ "error": "Valor da nota fora do intervalo permitido (0-100)" }
```

```json
{ "error": "Tipo desconhecido. Deve ser BONU S, PENALIDADE ou PONTUACAO" }
```

```json
{ "error": "Nenhum registro encontrado!" }
```

## Resumo de endpoints

### Eventos

- GET /api/health
- GET /api/eventos
- GET /api/eventos/:id
- POST /api/eventos
- PUT /api/eventos/:id
- POST /api/eventos/inativar-eventos-vencidos

### Equipes

- GET /api/equipes
- GET /api/equipes/:id
- POST /api/equipes
- PUT /api/equipes/:id

### Categorias

- GET /api/categorias
- GET /api/categorias/:id
- POST /api/categorias
- PUT /api/categorias/:id

### Critérios

- GET /api/criterios
- GET /api/criterios/:id
- POST /api/criterios
- PUT /api/criterios/:id

### Jurados

- GET /api/jurados
- GET /api/jurados/:id
- POST /api/jurados
- PUT /api/jurados/:id

### Jurados categorias

- GET /api/jurado-categorias
- GET /api/jurado-categorias/:id
- POST /api/jurado-categorias

### Avaliacões

- GET /api/avaliacoes
- GET /api/avaliacoes/:id
- POST /api/avaliacoes

### Notas

- GET /api/notas
- GET /api/notas/:id
- POST /api/notas
- PUT /api/notas/:id

### Movimentações de pontuação

- GET /api/movimentacoes-pontuacao
- GET /api/movimentacoes-pontuacao/:id
- POST /api/movimentacoes-pontuacao

## Usuários

### GET /api/usuarios

Lista usuários.

### GET /api/usuarios/:id

Busca usuário por id.

### POST /api/usuarios

Body:

```json
{
  "nome": "Usuário Teste",
  "senhaHash": "hash-da-senha"
}
```

Resposta esperada (201):

```json
{
  "id": 1,
  "dataCriacao": "2025-01-01T00:00:00.000Z",
  "nome": "Usuário Teste"
}
```

### PUT /api/usuarios/:id

Atualiza dados de um usuário.

Body:

```json
{
  "nome": "Usuário Atualizado",
  "senhaHash": "novo-hash"
}
```

Resposta esperada (200): objeto do usuário atualizado.

### DELETE /api/usuarios/:id

Remove um usuário pelo id. Resposta: 204 No Content se excluído com sucesso.
