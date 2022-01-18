const chai = require('chai');
const chaiHttp = require('chai-http');
const { MongoClient } = require('mongodb');
const sinon = require('sinon');

const { getConnection } = require('./mockConnection');
const server = require('../api/app');

chai.use(chaiHttp);

const { expect } = chai;

describe('POST /recipes', () => {
  describe('quando a receita é adicionada com sucesso', () => {
    let connectionMock;
    let response = {};
    let user;

    before(async () => {
      connectionMock = await getConnection();
      sinon.stub(MongoClient, 'connect')
        .resolves(connectionMock);

      // create user
      user = await chai.request(server)
        .post('/users')
        .send({
          name: 'test name',
          email: 'test@email.com',
          password: 'test123',
        })
        .then((res) => res.body.user);
      // login and get token
      const token = await chai.request(server)
        .post('/login')
        .send({
          email: 'test@email.com',
          password: 'test123',
        })
        .then((res) => res.body.token);
      // add a new recipe
      response = await chai.request(server)
        .post('/recipes')
        .set('authorization', token)
        .send({
          name: 'Refogado brabo',
          ingredients: 'Berinjela, Abobrinha',
          preparation: '20 minutos na airfryer',
        });
    });

    after(() => {
      MongoClient.connect.restore();
    });

    it('retorna o código de status 201', () => {
      expect(response).to.have.status(201);
    });

    it('retorna um objeto', () => {
      expect(response.body).to.be.a('object');
    });

    it('o objeto possui um objeto interno de nome recipe', () => {
      expect(response.body).to.have.property('recipe');
    });

    it('o objeto recipe possui uma propriedade name com o mesmo valor passado na criação', () => {
      const { recipe } = response.body;
      expect(recipe.name).to.be.equal('Refogado brabo');
    });

    it('o objeto recipe possui um userId igual ao id do usuário logado', () => {
      const { userId } = response.body.recipe;
      expect(userId).to.be.equal(user['_id']);
    });
  });

  describe('quando o campo name é nulo', () => {
    let connectionMock;
    let response = {};

    before(async () => {
      connectionMock = await getConnection();
      sinon.stub(MongoClient, 'connect')
        .resolves(connectionMock);

      // create user
      const user = await chai.request(server)
        .post('/users')
        .send({
          name: 'test name',
          email: 'test@email.com',
          password: 'test123',
        })
        .then((res) => res.body.user);

      // login and get token
      const token = await chai.request(server)
        .post('/login')
        .send({
          email: 'test@email.com',
          password: 'test123',
        })
        .then((res) => res.body.token);
      
      // add a new recipe
      response = await chai.request(server)
        .post('/recipes')
        .set('authorization', token)
        .send({
          ingredients: 'Berinjela, Abobrinha',
          preparation: '20 minutos na airfryer',
        });
    });

    after(() => {
      MongoClient.connect.restore();
    });

    it('retorna o código de status 400', () => {
      expect(response).to.have.status(400);
    });

    it('retorna um objeto com a mensagem "Invalid entries. Try again."', () => {
      expect(response.body).to.be.a('object');
      expect(response.body.message).to.be.equal('Invalid entries. Try again.');
    });
  });

  describe('quando o campo ingredients é nulo', () => {
    let connectionMock;
    let response = {};

    before(async () => {
      connectionMock = await getConnection();
      sinon.stub(MongoClient, 'connect')
        .resolves(connectionMock);

      // create user
      const user = await chai.request(server)
        .post('/users')
        .send({
          name: 'test name',
          email: 'test@email.com',
          password: 'test123',
        })
        .then((res) => res.body.user);

      // login and get token
      const token = await chai.request(server)
        .post('/login')
        .send({
          email: 'test@email.com',
          password: 'test123',
        })
        .then((res) => res.body.token);
      
      // add a new recipe
      response = await chai.request(server)
        .post('/recipes')
        .set('authorization', token)
        .send({
          name: 'Refogado brabo',
          preparation: '20 minutos na airfryer',
        });
    });

    after(() => {
      MongoClient.connect.restore();
    });

    it('retorna o código de status 400', () => {
      expect(response).to.have.status(400);
    });

    it('retorna um objeto com a mensagem "Invalid entries. Try again."', () => {
      expect(response.body).to.be.a('object');
      expect(response.body.message).to.be.equal('Invalid entries. Try again.');
    });
  });

  describe('quando o campo preparation é nulo', () => {
    let connectionMock;
    let response = {};

    before(async () => {
      connectionMock = await getConnection();
      sinon.stub(MongoClient, 'connect')
        .resolves(connectionMock);

      // create user
      const user = await chai.request(server)
        .post('/users')
        .send({
          name: 'test name',
          email: 'test@email.com',
          password: 'test123',
        })
        .then((res) => res.body.user);

      // login and get token
      const token = await chai.request(server)
        .post('/login')
        .send({
          email: 'test@email.com',
          password: 'test123',
        })
        .then((res) => res.body.token);
      
      // add a new recipe
      response = await chai.request(server)
        .post('/recipes')
        .set('authorization', token)
        .send({
          name: 'Refogado brabo',
          ingredients: 'Berinjela, Abobrinha',
        });
    });

    after(() => {
      MongoClient.connect.restore();
    });

    it('retorna o código de status 400', () => {
      expect(response).to.have.status(400);
    });

    it('retorna um objeto com a mensagem "Invalid entries. Try again."', () => {
      expect(response.body).to.be.a('object');
      expect(response.body.message).to.be.equal('Invalid entries. Try again.');
    });
  });

  describe('quando o token passado é inválido', () => {
    let connectionMock;
    let response = {};

    before(async () => {
      connectionMock = await getConnection();
      sinon.stub(MongoClient, 'connect')
        .resolves(connectionMock);

      // create user
      const user = await chai.request(server)
        .post('/users')
        .send({
          name: 'test name',
          email: 'test@email.com',
          password: 'test123',
        })
        .then((res) => res.body.user);

      // login and get token
      const tokenFake = 'token-fake123123123123123'
      
      // add a new recipe
      response = await chai.request(server)
        .post('/recipes')
        .set('authorization', tokenFake)
        .send({
          name: 'Refogado brabo',
          ingredients: 'Berinjela, Abobrinha',
          preparation: '20 minutos na airfryer',
        });
    });

    after(() => {
      MongoClient.connect.restore();
    });

    it('retorna o código de status 401', () => {
      expect(response).to.have.status(401);
    });

    it('retorna um objeto com a mensagem "jwt malformed"', () => {
      expect(response.body).to.be.a('object');
      expect(response.body.message).to.be.equal('jwt malformed');
    });
  });
});
