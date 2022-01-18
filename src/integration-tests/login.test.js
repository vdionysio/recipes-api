const chai = require('chai');
const chaiHttp = require('chai-http');
const { MongoClient } = require('mongodb');
const sinon = require('sinon');

const { getConnection } = require('./mockConnection');
const server = require('../api/app');
const jwt = require('jsonwebtoken');

chai.use(chaiHttp);

const { expect } = chai;

describe('POST /login', () => {
  describe('quando o usuário é logado com sucesso', () => {
    let connectionMock;
    let response = {};

    before(async () => {
      connectionMock = await getConnection();
      sinon.stub(MongoClient, 'connect')
        .resolves(connectionMock);

      await chai.request(server)
        .post('/users')
        .send({
          name: 'test name',
          email: 'test@email.com',
          password: 'test123',
        });

      response = await chai.request(server)
        .post('/login')
        .send({
          email: 'test@email.com',
          password: 'test123',
        });
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

    it('o objeto possui uma propriedade token com o email usado no login', () => {
      expect(response.body).to.have.property('token');
      const { token } = response.body;
      const payload = jwt.decode(token);
      expect(payload.email).to.be.equal('test@email.com');
    });
  });

  describe('quando o campo email é nulo', () => {
    let connectionMock;
    let response = {};

    before(async () => {
      connectionMock = await getConnection();
      sinon.stub(MongoClient, 'connect')
        .resolves(connectionMock);

      response = await chai.request(server)
        .post('/login')
        .send({
          password: 'test123',
        });
    });

    after(() => {
      MongoClient.connect.restore();
    });

    it('retorna o código de status 401', () => {
      expect(response).to.have.status(401);
    });

    it('retorna um objeto com a mensagem "All fields must be filled"', () => {
      expect(response.body).to.be.an('object');
      expect(response.body.message).to.be.equal('All fields must be filled');
    });
  });

  describe('quando o campo password é nulo', () => {
    let connectionMock;
    let response = {};

    before(async () => {
      connectionMock = await getConnection();
      sinon.stub(MongoClient, 'connect')
        .resolves(connectionMock);

      response = await chai.request(server)
        .post('/login')
        .send({
          email: 'test@email.com',
        });
    });

    after(() => {
      MongoClient.connect.restore();
    });

    it('retorna o código de status 401', () => {
      expect(response).to.have.status(401);
    });

    it('retorna um objeto com a mensagem "All fields must be filled"', () => {
      expect(response.body).to.be.an('object');
      expect(response.body.message).to.be.equal('All fields must be filled');
    });
  });

  describe('quando o email é inválido', () => {
    let connectionMock;
    let response = {};

    before(async () => {
      connectionMock = await getConnection();
      sinon.stub(MongoClient, 'connect')
        .resolves(connectionMock);

      response = await chai.request(server)
        .post('/login')
        .send({
          email: 'notregistered@email.com',
          password: 'test123',
        });
    });

    after(() => {
      MongoClient.connect.restore();
    });

    it('retorna o código de status 401', () => {
      expect(response).to.have.status(401);
    });

    it('retorna um objeto com a mensagem "Incorrect username or password"', () => {
      expect(response.body).to.be.an('object');
      expect(response.body.message).to.be.equal('Incorrect username or password');
    });
  });

  describe('quando a senha é inválida', () => {
    let connectionMock;
    let response = {};

    before(async () => {
      connectionMock = await getConnection();
      sinon.stub(MongoClient, 'connect')
        .resolves(connectionMock);

      await chai.request(server)
        .post('/users')
        .send({
          name: 'test name',
          email: 'test@email.com',
          password: 'test123',
        });

      response = await chai.request(server)
        .post('/login')
        .send({
          email: 'test@email.com',
          password: 'wrongpass',
        });
    });

    after(() => {
      MongoClient.connect.restore();
    });

    it('retorna o código de status 401', () => {
      expect(response).to.have.status(401);
    });

    it('retorna um objeto com a mensagem "Incorrect username or password"', () => {
      expect(response.body).to.be.an('object');
      expect(response.body.message).to.be.equal('Incorrect username or password');
    });
  });
});
