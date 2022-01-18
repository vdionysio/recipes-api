const chai = require('chai');
const chaiHttp = require('chai-http');
const { MongoClient } = require('mongodb');
const sinon = require('sinon');

const userModel = require('../models/userModel');
const { getConnection } = require('./mockConnection');
const server = require('../api/app');

chai.use(chaiHttp);

const { expect } = chai;

describe('PUT /recipes/:id', () => {
  describe('quando a requisição é realizada com sucesso', () => {
    let connectionMock;
    let response = {};

    before(async () => {
      connectionMock = await getConnection();
      sinon.stub(MongoClient, 'connect')
        .resolves(connectionMock);

      await userModel.cleanCollection();
      // create user
      await chai.request(server)
        .post('/users')
        .send({
          name: 'test name',
          email: 'test@email.com',
          password: 'test123',
        });
      // login and get token
      const token = await chai.request(server)
        .post('/login')
        .send({
          email: 'test@email.com',
          password: 'test123',
        })
        .then((res) => res.body.token);
      // add a new recipe
      const recipe = await chai.request(server)
        .post('/recipes')
        .set('authorization', token)
        .send({
          name: 'Refogado brabo',
          ingredients: 'Berinjela, Abobrinha',
          preparation: '20 minutos na airfryer',
        })
        .then((res) => res.body.recipe);
      // edit recipe by id
      response = await chai.request(server)
        .put(`/recipes/${recipe['_id']}`)
        .set('authorization', token)
        .send({
          name: 'Refogado brabo',
          ingredients: 'Berinjela, Abobrinha, Pimentão',
          preparation: '20 minutos na airfryer',
        })
    });

    after(() => {
      MongoClient.connect.restore();
    });

    it('retorna o código de status 200', () => {
      expect(response).to.have.status(200);
    });

    it('retorna um objeto', () => {
      expect(response.body).to.be.an('object');
    });

    it('com uma prop ingredients de valor igual ao ingredients passado atualização da receita', () => {
      const recipe = response.body;
      expect(recipe).have.a.property('ingredients');
      expect(recipe.ingredients).to.be.equal('Berinjela, Abobrinha, Pimentão');
    });
  });

  describe('quando o id passado é inválido', () => {
    let connectionMock;
    let response = {};
    const fakeId = '61e6b240fe463e2b815e93dd';

    before(async () => {
      connectionMock = await getConnection();
      sinon.stub(MongoClient, 'connect')
        .resolves(connectionMock);

      await userModel.cleanCollection();

      // create user
      await chai.request(server)
        .post('/users')
        .send({
          name: 'test name',
          email: 'test@email.com',
          password: 'test123',
        });
      // login and get token
      const token = await chai.request(server)
        .post('/login')
        .send({
          email: 'test@email.com',
          password: 'test123',
        })
        .then((res) => res.body.token);
      // add a new recipe
      await chai.request(server)
        .post('/recipes')
        .set('authorization', token)
        .send({
          name: 'Refogado brabo',
          ingredients: 'Berinjela, Abobrinha',
          preparation: '20 minutos na airfryer',
        })
        .then((res) => res.body.recipe);
      // edit recipe by id
      response = await chai.request(server)
        .put(`/recipes/${fakeId}`)
        .set('authorization', token)
        .send({
          name: 'Refogado brabo',
          ingredients: 'Berinjela, Abobrinha, Pimentão',
          preparation: '20 minutos na airfryer',
        });
    });

    after(() => {
      MongoClient.connect.restore();
    });

    it('retorna o código de status 404', () => {
      expect(response).to.have.status(404);
    });

    it('retorna um objeto com a mensagem "recipe not found"', () => {
      expect(response.body).to.be.an('object');
      expect(response.body.message).to.be.equal('recipe not found');
    });
  });

  describe('quando o usuário não está autenticado', () => {
    let connectionMock;
    let response = {};

    before(async () => {
      connectionMock = await getConnection();
      sinon.stub(MongoClient, 'connect')
        .resolves(connectionMock);

      await userModel.cleanCollection();

      // create user
      await chai.request(server)
        .post('/users')
        .send({
          name: 'test name',
          email: 'test@email.com',
          password: 'test123',
        });
      // login and get token
      const token = await chai.request(server)
        .post('/login')
        .send({
          email: 'test@email.com',
          password: 'test123',
        })
        .then((res) => res.body.token);
      // add a new recipe
      const recipe = await chai.request(server)
        .post('/recipes')
        .set('authorization', token)
        .send({
          name: 'Refogado brabo',
          ingredients: 'Berinjela, Abobrinha',
          preparation: '20 minutos na airfryer',
        })
        .then((res) => res.body.recipe);
      // edit recipe by id
      response = await chai.request(server)
        .put(`/recipes/${recipe['_id']}`)
        .send({
          name: 'Refogado brabo',
          ingredients: 'Berinjela, Abobrinha, Pimentão',
          preparation: '20 minutos na airfryer',
        })
    });

    after(() => {
      MongoClient.connect.restore();
    });

    it('retorna o código de status 401', () => {
      expect(response).to.have.status(401);
    });

    it('retorna um objeto com a mensagem "missing auth token"', () => {
      expect(response.body).to.be.an('object');
      expect(response.body.message).to.be.equal('missing auth token');
    });
  });

  describe('quando o token passado é inválido', () => {
    let connectionMock;
    let response = {};

    before(async () => {
      connectionMock = await getConnection();
      sinon.stub(MongoClient, 'connect')
        .resolves(connectionMock);

      await userModel.cleanCollection();

      // create user
      await chai.request(server)
        .post('/users')
        .send({
          name: 'test name',
          email: 'test@email.com',
          password: 'test123',
        });
      // login and get token
      const token = await chai.request(server)
        .post('/login')
        .send({
          email: 'test@email.com',
          password: 'test123',
        })
        .then((res) => res.body.token);
      // add a new recipe
      const recipe = await chai.request(server)
        .post('/recipes')
        .set('authorization', token)
        .send({
          name: 'Refogado brabo',
          ingredients: 'Berinjela, Abobrinha',
          preparation: '20 minutos na airfryer',
        })
        .then((res) => res.body.recipe);
      // edit recipe by id
      response = await chai.request(server)
        .put(`/recipes/${recipe['_id']}`)
        .set('authorization', 'invalid-token')
        .send({
          name: 'Refogado brabo',
          ingredients: 'Berinjela, Abobrinha, Pimentão',
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
      expect(response.body).to.be.an('object');
      expect(response.body.message).to.be.equal('jwt malformed');
    });
  });

  describe('quando a receita não pertence ao usuário autenticado', () => {
    let connectionMock;
    let response = {};

    before(async () => {
      connectionMock = await getConnection();
      sinon.stub(MongoClient, 'connect')
        .resolves(connectionMock);

      await userModel.cleanCollection();

      // create user 1
      await chai.request(server)
        .post('/users')
        .send({
          name: 'test name',
          email: 'test@email.com',
          password: 'test123',
        });
      // create user 2
      await chai.request(server)
        .post('/users')
        .send({
          name: 'test name 2',
          email: 'test2@email.com',
          password: 'test123',
        });
      // login and get token with user 1
      const token = await chai.request(server)
        .post('/login')
        .send({
          email: 'test@email.com',
          password: 'test123',
        })
        .then((res) => res.body.token);
      // add a new recipe with user 1
      const recipe1 = await chai.request(server)
        .post('/recipes')
        .set('authorization', token)
        .send({
          name: 'Refogado brabo',
          ingredients: 'Berinjela, Abobrinha',
          preparation: '20 minutos na airfryer',
        })
        .then((res) => res.body.recipe);
      // login and get token with user 2
      const token2 = await chai.request(server)
      .post('/login')
      .send({
        email: 'test2@email.com',
        password: 'test123',
      })
      .then((res) => res.body.token);
      // edit recipe by id
      response = await chai.request(server)
        .put(`/recipes/${recipe1['_id']}`)
        .set('authorization', token2)
        .send({
          name: 'Refogado brabo',
          ingredients: 'Berinjela, Abobrinha, Pimentão',
          preparation: '20 minutos na airfryer',
        });
    });

    after(() => {
      MongoClient.connect.restore();
    });

    it('retorna o código de status 401', () => {
      expect(response).to.have.status(401);
    });

    it('retorna um objeto com a mensagem "you dont have access"', () => {
      expect(response.body).to.be.an('object');
      expect(response.body.message).to.be.equal('you dont have access');
    });
  });
});
