    # Testes do projeto ESPANGLISH

Este arquivo documenta a estratégia de testes do backend e como a suíte foi organizada.

## Objetivo

Garantir que:

- os validadores rejeitam payloads incorretos
- os controladores tratam entradas, parâmetros e erros esperados
- as rotas da API respondem corretamente para cenários de sucesso e falha
- regras de negócio, como datas inválidas, notas fora do intervalo e tipos de pontuação desconhecidos, sejam protegidas por testes automatizados

## Estrutura da suíte

A suíte está em `tests/` e foi organizada em três níveis:

### 1. Testes unitários

Arquivo:

- `tests/unit/validators.test.ts`

Cobertura:

- eventos
- equipes
- categorias
- critérios
- jurados
- associação jurado-categoria
- avaliações
- notas
- movimentações de pontuação

Esses testes validam regras de negócio e erros de payload antes mesmo que o código de serviço ou repository seja executado.

Exemplos de casos:

- nome em branco
- data final anterior à data inicial
- competência fora do intervalo permitido
- campos com digitação incorreta (`idEvent` em vez de `idEvento`)
- nota fora do intervalo 0-100
- tipo de pontuação inválido

### 2. Testes funcionais de controladores

Arquivo:

- `tests/functional/controllers.test.ts`

Esse nível verifica se cada controller:

- chama o service correto
- parseia corretamente os parâmetros da URL
- rejeita entradas inválidas antes de chamar o repository
- responde com o status esperado
- dispara erros de domínio (`ValidationError`, `NotFoundError`)

Exemplos de cenários:

- listar evento por id com parâmetro correto
- rejeitar `id` textual em `listar`
- criar equipe com payload válido
- rejeitar categoria inexistente ao atualizar
- criar critério com payload grafado incorretamente
- alterar nota com id inválido

### 3. Testes end-to-end das rotas

Arquivo:

- `tests/e2e/routes.test.ts`

Esses testes usam `supertest` para invocar a aplicação Express diretamente e verificar o comportamento real das rotas.

Cenários cobertos:

- listagem de eventos em `/api/eventos`
- criação de categoria em `/api/categorias`
- rejeição de payload com typo em equipe (`/api/equipes`)
- rejeição de tipo com ortografia inválida em movimentação de pontuação
- criação válida de movimentação de pontuação

## Framework e ferramentas

- Vitest: executor e suíte de testes
- Supertest: testes HTTP em rotas Express
- `vi.spyOn(...)`: mock de repositories para focar no comportamento das rotas e controladores

## Comandos

Instalação:

```bash
npm install
```

Execução da suíte completa:

```bash
npm test
```

Executar em modo watch:

```bash
npm run test:watch
```

## Padrões de validação testados

### Erros de validação

- payload malformado
- campo com nome errado
- id em formato inválido
- número fora do intervalo esperado
- tipo de movimentação fora da lista permitida

### Erros de domínio

- registro não encontrado
- ausência de dados para atualização
- parâmetro numérico ausente ou inválido

### Casos de sucesso

- criação de categoria
- criação de movimentação válida
- listagem de eventos
- resposta 201 em criações bem-sucedidas
- resposta 200 em leitura e atualização

## Observações importantes

- os testes não dependem de um banco Firebird real, e sim de mocks de repositories para isolar a camada HTTP e de validação
- a suíte foi desenhada para quebrar regressões em campos de entrada e na composição das rotas
- as mensagens de erro são parte crítica dos testes, porque o sistema valida campos com mensagens específicas e exatamente formatadas

## Recomendação de extensão

Ao adicionar novos módulos ou alterar regras de validação, os testes devem seguir o mesmo padrão:

1. testar payload válido
2. testar payload inválido
3. testar erro de domínio
4. testar endpoint real da rota

Isso mantém consistência com a arquitetura atual e torna a API mais previsível para integração.