const chai = require('chai');
const chaiHttp = require('chai-http');
const { MongoClient } = require('mongodb');
const sinon = require('sinon');

const userModel = require('../models/userModel');
const { getConnection } = require('./mockConnection');
const server = require('../api/app');

chai.use(chaiHttp);

const { expect } = chai;

describe('POST /users/admin', () => {
  describe('quando a requisição é realizada com sucesso', () => {
    let connectionMock;
    let response = {};

    before(async () => {
      connectionMock = await getConnection();
      sinon.stub(MongoClient, 'connect')
        .resolves(connectionMock);

      await userModel.cleanCollection();
      // create an initial adm
      await connectionMock.db('Cookmaster')
        .collection('users')
        .insertOne({ name: 'admin', email: 'admin@email.com', password: 'admin', role: 'admin' });;
      // login and get adm token
      const token = await chai.request(server)
        .post('/login')
        .send({
          email: 'admin@email.com',
          password: 'admin',
        })
        .then((res) => res.body.token);
      // add a new admin
      response = await chai.request(server)
        .post('/users/admin')
        .set('authorization', token)
        .send({
          name: 'admin2',
          email: 'admin2@email.com',
          password: 'admin2',
        })
    });

    after(() => {
      MongoClient.connect.restore();
    });

    it('retorna o código de status 201', () => {
      expect(response).to.have.status(201);
    });

    it('retorna um objeto', () => {
      expect(response.body).to.be.an('object');
    });

    it('com um objeto interno chamado user com uma propriedade role = admin', () => {
      expect(response.body).to.have.a.property('user')
      expect(response.body.user.role).to.be.equal('admin')
    });
  });

  describe('quando não está autenticado como admin', () => {
    let connectionMock;
    let response = {};

    before(async () => {
      connectionMock = await getConnection();
      sinon.stub(MongoClient, 'connect')
        .resolves(connectionMock);

      await userModel.cleanCollection();
      // create an initial adm
      await connectionMock.db('Cookmaster')
        .collection('users')
        .insertOne({ name: 'user', email: 'user@email.com', password: 'user', role: 'user' });;
      // login and get user token
      const token = await chai.request(server)
        .post('/login')
        .send({
          email: 'user@email.com',
          password: 'user',
        })
        .then((res) => res.body.token);
      // add a new admin
      response = await chai.request(server)
        .post('/users/admin')
        .set('authorization', token)
        .send({
          name: 'admin2',
          email: 'admin2@email.com',
          password: 'admin2',
        })
    });

    after(() => {
      MongoClient.connect.restore();
    });

    it('retorna o código de status 403', () => {
      expect(response).to.have.status(403);
    });

    it('retorna um objeto', () => {
      expect(response.body).to.be.an('object');
    });

    it('com uma mensagem "Only admins can register new admins"', () => {
      expect(response.body).to.be.an('object');
      expect(response.body.message).to.be.equal('Only admins can register new admins');
    });
  });
});
