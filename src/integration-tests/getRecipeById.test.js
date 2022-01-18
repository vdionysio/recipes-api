const chai = require('chai');
const chaiHttp = require('chai-http');
const { MongoClient } = require('mongodb');
const sinon = require('sinon');

const userModel = require('../models/userModel');
const { getConnection } = require('./mockConnection');
const server = require('../api/app');

chai.use(chaiHttp);

const { expect } = chai;

describe('GET /recipes/:id', () => {
  describe('quando a requisição é realizada com sucesso', () => {
    let connectionMock;
    let response = {};

    before(async () => {
      connectionMock = await getConnection();
      sinon.stub(MongoClient, 'connect')
        .resolves(connectionMock);

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
      // list recipe by id
      response = await chai.request(server)
        .get(`/recipes/${recipe['_id']}`);
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

    it('com uma propriedade name de valor igual ao name passado na criação da receita', () => {
      const recipe = response.body;
      expect(recipe).have.a.property('name');
      expect(recipe.name).to.be.equal('Refogado brabo')
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
      response = await chai.request(server)
        .get(`/recipes/${fakeId}`);
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
});
