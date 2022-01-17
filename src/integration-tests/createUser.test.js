const chai = require('chai');
const chaiHttp = require('chai-http');
const { MongoClient } = require('mongodb');
const sinon = require('sinon');

const { getConnection } = require('./mockConnection');
const server = require('../api/app');

chai.use(chaiHttp);

const { expect } = chai;

describe('POST /users', () => {
  describe('quando o usuário é criado com sucesso', () => {
    let response = {};

    before(async () => {
      const connectionMock = await getConnection;
      sinon.stub(MongoClient, 'connect')
        .resolves(connectionMock);

      response = await chai.request(server)
        .post('/users')
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

  describe('quando o campo name é nulo', () => {
    let response = {};

    before(async () => {
      const connectionMock = await getConnection;
      sinon.stub(MongoClient, 'connect')
        .resolves(connectionMock);

      response = await chai.request(server)
        .post('/users')
        .send({
          email: 'test@email.com',
          password: 'test123',
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

  describe('quando o campo email é nulo', () => {
    let response = {};

    before(async () => {
      const connectionMock = await getConnection;
      sinon.stub(MongoClient, 'connect')
        .resolves(connectionMock);

      response = await chai.request(server)
        .post('/users')
        .send({
          name: 'test name',
          password: 'test123',
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

  describe('quando o campo email é invalido', () => {
    let response = {};

    before(async () => {
      const connectionMock = await getConnection;
      sinon.stub(MongoClient, 'connect')
        .resolves(connectionMock);

      response = await chai.request(server)
        .post('/users')
        .send({
          name: 'test name',
          email: 'testemail.com',
          password: 'test123'
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

  describe('quando o campo senha é nulo', () => {
    let response = {};

    before(async () => {
      const connectionMock = await getConnection;
      sinon.stub(MongoClient, 'connect')
        .resolves(connectionMock);

      response = await chai.request(server)
        .post('/users')
        .send({
          name: 'test name',
          email: 'test@email.com',
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

  describe('quando o email passado já é cadastrado', () => {
    let response = {};

    before(async () => {
      const connectionMock = await getConnection;
      sinon.stub(MongoClient, 'connect')
        .resolves(connectionMock);

      await chai.request(server)
        .post('/users')
        .send({
          name: 'another name',
          email: 'test@email.com',
          password: 'test123',
        });

      response = await chai.request(server)
        .post('/users')
        .send({
          name: 'another name',
          email: 'test@email.com',
          password: 'test123',
        });
    });

    after(() => {
      MongoClient.connect.restore();
    });

    it('retorna o código de status 409', () => {
      expect(response).to.have.status(400);
    });

    it('retorna um objeto com a mensagem "Email already registered"', () => {
      expect(response.body).to.be.a('object');
      expect(response.body.message).to.be.equal('Email already registered');
    });
  });
});
