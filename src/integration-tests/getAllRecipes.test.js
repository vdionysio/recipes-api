const chai = require('chai');
const chaiHttp = require('chai-http');
const { MongoClient } = require('mongodb');
const sinon = require('sinon');

const { getConnection } = require('./mockConnection');
const server = require('../api/app');

chai.use(chaiHttp);

const { expect } = chai;

describe('GET /recipes', () => {
  describe('quando a requisição é realizada', () => {
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
      await chai.request(server)
        .post('/recipes')
        .set('authorization', token)
        .send({
          name: 'Refogado brabo',
          ingredients: 'Berinjela, Abobrinha',
          preparation: '20 minutos na airfryer',
        });
      // list all recipes
      response = await chai.request(server)
        .get('/recipes');
    });

    after(() => {
      MongoClient.connect.restore();
    });

    it('retorna o código de status 200', () => {
      expect(response).to.have.status(200);
    });

    it('retorna um array', () => {
      expect(response.body).to.be.an('array');
    });

    it('o primeiro elemento do array possui um nome igual ao nome da receita adicionada', () => {
      const recipes = response.body;
      expect(recipes[0]).to.be.an('object');
      expect(recipes[0]).have.a.property('name');
      expect(recipes[0].name).to.be.equal('Refogado brabo')
    });
  });
});
