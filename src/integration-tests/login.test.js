const chai = require('chai');
const chaiHttp = require('chai-http');
const { MongoClient } = require('mongodb');
const sinon = require('sinon');

const { getConnection } = require('./mockConnection');
const server = require('../api/app');

chai.use(chaiHttp);

const { expect } = chai;

describe('POST /login', () => {
  describe('quando o usuário é criado com sucesso', () => {
    let connectionMock;
    let response = {};

    before(async () => {
      connectionMock = await getConnection();
      sinon.stub(MongoClient, 'connect')
        .resolves(connectionMock);

      response = await chai.request(server)
        .post('/login')
        .send({
          name: 'test name',
          email: 'test@email.com',
          password: 'test123',
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

    it('o objeto possui um objeto interno user', () => {
      expect(response.body).to.have.property('user');
    });

    it('o objeto user tem uma propriedade role com o valor "user"', () => {
      expect(response.body.user).to.have.property('role');
      expect(response.body.user.role).to.be.equal('user')
    });
  });
});
