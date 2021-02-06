# mandou-bem-massa

Esse projeto é para me ajudar a criar uma massa de dados para o projeto Mandou Bem :)

# Requisitos

- NodeJS
- Yarn

# Instruções

## Instalar dependências

`yarn`

## Criar massa de dados

Antes de criar a massa de dados copie o arquivo `.env.example` renomeando para `.env`.
Lá dentro coloque as credenciais dos bancos que você quer popular. Se os bancos **não** estiverem local então deixe a variável `NODE_ENV` com o valor `production`.

Tenha a certeza que o PostgreSQL já esteja com a estrutura das tabelas, senão, vá para o projeto
`mandou-bem-api` e execute as *migrations*.

Para de fato executar a criação das massas de dados basta executar o seguinte comando:

`yarn data:generate`

