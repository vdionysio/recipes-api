# Recipes API
A aplicação consiste numa API para gestão de receitas.
As principais tecnologias utlizadas no desenvolvimento foram:
- NodeJS;
- ExpressJS;
- MongoDB;
- Mocha e Chai para testes.

Obs: A cobertura de testes atual está em 95.42%

## Instalação
Para instalar o projeto na sua máquina é necessário seguir os passos:

1. clonar o projeto: `git clone git@github.com:vdionysio/recipes-api.git`
2. entrar na pasta do projeto: `cd recipes-api`
3. instalar as dependências necessárias: `npm install`
4. e então rodar a aplicação: `npm start`

## Utilização
As rotas possíveis dentro da API são.

### 1. Criar um usuário - POST /users
Onde um json contendo nome, email e password deve ser passado como body.

Ex:
```
{
  "name": "Vinícius",
  "email": "vini.dionysio@gmail.com",
  "password": "senhasegura"
}
```

### 2. Logar com um usuário - POST /login
Onde um json contendo email e password deve ser passado como body.

Ex:
```
{
  "email": "vini.dionysio@gmail.com",
  "password": "senhasegura"
}
```

### 3. Adicionar uma receita ao banco - POST /recipes
Onde um json contendo name, ingredients e preparation deve ser passado como body. Além de um token passado no header authorization. Esse token é gerado no login ou na criação de usuário.

Ex:
```
{
  "name": "Receitinha boa",
  "ingredients": "Abobrinha, Berinjela, ...",
  "preparation": "cozinar por tantos minutos..."
}
```

### 4. Listar todas receitas do banco - GET /recipes
Essa rota irá retornar um json com todas as receitas armazenadas.

### 5. Consultar uma receita específica - GET /recipes/:id
O id de uma receita específica deve ser passada como parâmetro da rota de requisição. Retorna as informações da receita específica.

### 6. Atualizar uma receita do banco - PUT /recipes/:id
Onde um json contendo name, ingredients e preparation deve ser passado como body. Além de um token passado no header authorization. Esse token é gerado no login ou na criação de usuário.

Ex:
```
{
  "name": "Receitinha boa 2.0",
  "ingredients": "Abobrinha, Berinjela,tomate",
  "preparation": "cozinar por muitos minutos..."
}
```

### 7. Deletar uma receita do banco - DELETE /recipes/:id
O id de uma receita específica a ser deletada deve ser passado como parâmetro da rota de requisição. Além de um token passado no header authorization. Esse token é gerado no login ou na criação de usuário.

### 8. Adicionar uma imagem a receita - PUT /recipes/:id/image
Onde uma imagem deve ser passada para a requisição. Além de um token passado no header authorization. Esse token é gerado no login ou na criação de usuário.

### 9. Adicionar um admin - POST /users/admin
Onde um json contendo nome, email e password deve ser passado como body. Além de um token passado no header authorization. Esse token é gerado no login ou na criação de usuário e deve conter o role de admin.

Ex:
```
{
  "name": "Vinícius",
  "email": "vini.dionysio@gmail.com",
  "password": "senhasegura"
}
```
