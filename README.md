# ESPANGLISH

Sistema de gestão e avaliação de eventos competitivos, com foco em inscrições de equipes, categorias, jurados, critérios, cálculo de notas e movimentação de pontuação.

## Visão geral

O projeto é uma API REST em Node.js com TypeScript e Express, conectada a um banco Firebird. Ele organiza o ciclo completo de um evento de competição, desde o cadastro do evento até a atribuição de notas e ajustes de pontuação por equipe.

O backend expõe endpoints para:

- gerenciar eventos
- cadastrar equipes
- definir categorias e critérios
- registrar jurados e suas categorias
- criar avaliações vinculadas a equipe, categoria e jurado
- registrar notas por critério
- aplicar movimentos de pontuação positiva/negativa
- consultar dados por lista ou por identificador
- inativar eventos vencidos

## Stack tecnológica

- Node.js
- TypeScript
- Express
- Firebird SQL via node-firebird
- Vitest + Supertest
- dotenv

## Estrutura da aplicação

src/
- app.ts: montagem da aplicação Express
- server.ts: inicialização do servidor e teste de conexão
- routes/index.ts: registro de todas as rotas da API
- controllers/: camada de entrada/saída das rotas
- services/: regras de negócio
- repositories/: acesso ao banco
- utils/validators/: validação de payloads
- types/: interfaces e contratos de dados
- database/: conexão e helpers de acesso
- config/index.ts: variáveis de ambiente
- middlewares/error.middlewares.ts: tratamento de erros

## Fluxo funcional

A arquitetura segue a separação em camadas:

1. rota recebe a requisição
2. controller valida o id e chama o serviço
3. serviço executa a regra de negócio
4. repository acessa o banco Firebird
5. validator confirma formato do payload
6. middleware de erro padroniza respostas HTTP

## Regras e validações do sistema

### Validações comuns

- todos os IDs de relacionamento devem ser numéricos
- nomes devem ser strings com conteúdo não vazio e tamanho máximo de 100 caracteres
- datas de evento precisam ser ISO/Date válidas
- data final não pode ser anterior à data inicial
- competência aceita apenas anos entre 2020 e 2100
- valores booleanos obrigatórios em atualizações de entidades ativas/inativas
- notas devem estar dentro do intervalo 0 a 100
- movimentações de pontuação aceitam apenas: BONUS, PENALIDADE ou PONTUACAO
- descrição da movimentação não pode estar vazia
- pontos não podem ser zero

### Códigos HTTP e padrões de resposta

- 200 OK: listagem e consultas por id, atualizações e ações sem criação
- 201 Created: criação de registros
- 400 Bad Request: payload inválido ou campos fora do padrão
- 404 Not Found: registro inexistente ou sem resultado
- 500 Internal Server Error: falha não tratada no servidor

Exemplo de resposta de erro:

```json
{
  "error": "(ID) do evento inválido"
}
```

## Funcionalidades por módulo

### 1. Eventos

Permite criar, listar, consultar por id, alterar e inativar eventos vencidos.

Dados do evento:

- nome: string
- dataInicio: string (ISO date)
- dataFim: string (ISO date)
- competencia: number
- ativo: boolean (em atualização)

Exemplos de uso:

- cadastro de evento de competição anual
- bloqueio automático de eventos expirados por rota específica

### 2. Equipes

Cadastro de equipes participantes no evento.

Dados:

- idEvento: number
- nome: string

### 3. Categorias

Agrupa equipes e critérios por categoria do evento.

Dados:

- idEvento: number
- nome: string
- ordem: number
- ativo: boolean (em atualização)

### 4. Critérios

Define critérios avaliativos dentro de uma categoria.

Dados:

- idCategoria: number
- nome: string
- ordem: number
- ativo: boolean (em atualização)

### 5. Jurados

Registra jurados que avaliam determinada categoria ou evento.

Dados:

- idEvento: number
- nome: string
- ativo: boolean (em atualização)

### 6. Jurado-Categoria

Relaciona um jurado a uma categoria específica.

Dados:

- idJurado: number
- idCategoria: number

### 7. Avaliações

Cria uma avaliação vinculando equipe, categoria e jurado.

Dados:

- idEquipe: number
- idCategoria: number
- idJurado: number

### 8. Notas

Armazena a nota atribuída a uma avaliação e critério.

Dados:

- idAvaliacao: number
- idCriterio: number
- nota: number

Regras:

- nota aceita valores entre 0 e 100
- a nota deve pertencer a um critério específico dentro de uma avaliação

### 9. Movimentação de pontuação

Sinaliza ajustes de pontuação para uma equipe em um evento.

Dados:

- idEvento: number
- idEquipe: number
- tipo: BONUS | PENALIDADE | PONTUACAO
- descricao: string
- pontos: number

Esse módulo permite registrar comportamento positivo, negativo ou pontuação direta em uma competição.

## Banco de dados

A aplicação usa Firebird e a conexão é definida em variáveis de ambiente.

Arquivo de exemplo:

```env
PORT=5000
HOST=localhost
DB_HOST=localhost
DB_PORT=3050
DB_DATABASE=./database/DADOS_ESPANGLISH.FDB
DB_USER=SYSDBA
DB_PASSWORD=
DB_ROLE=RDB$ADMIN
```

O projeto espera uma base Firebird local com o arquivo configurado em DB_DATABASE.

## Como executar

### Instalação

```bash
npm install
```

### Ambiente local

```bash
npm run dev
```

### Build de produção

```bash
npm run build
```

### Execução em produção

```bash
npm start
```

### Verificação de saúde da API

```bash
curl http://localhost:5000/api/health
```

Resposta esperada:

```json
{
  "status": "ok",
  "service": "ESPANGLISH"
}
```

## Scripts disponíveis

```json
{
  "dev": "tsx watch src/server.ts",
  "build": "tsc",
  "start": "node dist/server.js",
  "test": "vitest run",
  "test:watch": "vitest"
}
```

## Testes

O projeto conta com testes unitários, funcionais e end-to-end.

- unitários: validadores de payload e regras de negócio
- funcionais: controle de controllers
- e2e: execução real das rotas via supertest

Para executar a suíte:

```bash
npm test
```

## Observações importantes

- a API foi construída para uso de backend com banco real, e o código assume Firebird em ambiente local
- a validação de payloads é estrita: erros de digitação em campos esperados são rejeitados com 400
- todos os endpoints usam prefixo /api
- certos endpoints de listagem aceitam /:id para consulta individual
- rotas de alteração exigem o id na URL e o corpo com dados atualizados

## Documentação complementar

- README das rotas: [README-API.md](README-API.md)
- README de testes: [README-TESTES.md](README-TESTES.md)
