/* eslint-disable no-unused-expressions, no-underscore-dangle, max-len */

const expect = require('chai').expect;
const request = require('supertest');
const app = require('../../dst/server');
const cp = require('child_process');
const Renter = require('../../dst/models/renter');


describe('renter', () => {
  beforeEach((done) => {
    cp.execFile(`${__dirname}/../scripts/populate.sh`, { cwd: `${__dirname}/../scripts` }, () => {
      done();
    });
  });

  describe('get /renters', () => {
    it('should return all renters', (done) => {
      request(app)
      .get('/renters')
      .end((err, rsp) => {
        expect(err).to.be.null;
        expect(rsp.status).to.equal(200);
        expect(rsp.body.renters).to.have.length(2);
        done();
      });
    });
  });
  describe('get /renters/:id', () => {
    it('should get one renter', (done) => {
      request(app)
      .get('/renters/012345678901234567890010')
      .end((err, rsp) => {
        expect(err).to.be.null;
        expect(rsp.status).to.equal(200);
        expect(rsp.body.renter._id).to.equal('012345678901234567890010');
        expect(rsp.body.renter.name).to.equal('Bob');
        done();
      });
    });
    it('should not retrieve a renter that does not exist', (done) => {
      request(app)
      .get('/renters/012345678901234567899999')
      .end((err, rsp) => {
        expect(err).to.be.null;
        expect(rsp.status).to.equal(400);
        expect(rsp.body.messages[0]).to.equal('id not found');
        done();
      });
    });
  });
  describe('post /renters', () => {
    it('should create a renter', (done) => {
      request(app)
      .post('/renters')
      .send({ name: 'Andrew', money: 40000 })
      .end((err, rsp) => {
        expect(err).to.be.null;
        expect(rsp.status).to.equal(200);
        expect(rsp.body.renter_id).to.not.be.null;
        expect(rsp.body.renter.name).to.equal('Andrew');
        expect(rsp.body.renter.money).to.equal(40000);
        done();
      });
    });
    it('should not create a renter without a name', (done) => {
      request(app)
      .post('/renters')
      .send({ money: 40000 })
      .end((err, rsp) => {
        expect(err).to.be.null;
        expect(rsp.status).to.equal(400);
        expect(rsp.body.messages).to.deep.equal(['"name" is required']);
        done();
      });
    });
  });
  describe('delete /renters/:id', () => {
    it('should delete a renter', (done) => {
      Renter.create({ name: 'Jon' }, (err1, renter) => {
        const id = renter._id.toString();
        request(app)
        .delete(`/renters/${id}`)
        .end((err2, rsp) => {
          expect(err2).to.be.null;
          expect(rsp.status).to.equal(200);
          expect(rsp.body.id).to.equal(id);
          done();
        });
      });
    });
    it('should not delete a renter who does not exist', (done) => {
      request(app)
      .delete('/renters/012345678901234567899999')
      .end((err, rsp) => {
        expect(err).to.be.null;
        expect(rsp.status).to.equal(400);
        expect(rsp.body.messages).to.deep.equal(['id not found']);
        done();
      });
    });
    it('should NOT delete a renter -- bad id', (done) => {
      request(app)
      .delete('/renters/badid')
      .end((err2, rsp) => {
        expect(err2).to.be.null;
        expect(rsp.status).to.equal(400);
        expect(rsp.body.messages[0]).to.contain('"id" with value "badid" fails to match the required pattern');
        done();
      });
    });
  });
  describe('put /renters/:id', () => {
    it('should update renter', (done) => {
      request(app)
      .put('/renters/012345678901234567890010')
      .send({ name: 'Kirk' })
      .end((err, rsp) => {
        expect(err).to.be.null;
        expect(rsp.status).to.equal(200);
        expect(rsp.body.renter.name).to.equal('Kirk');
        done();
      });
    });
    it('should NOT update renter - invalid money', (done) => {
      request(app)
      .put('/renters/012345678901234567890010')
      .send({ name: 'Bobby', money: 'foo' })
      .end((err, rsp) => {
        expect(err).to.be.null;
        expect(rsp.status).to.equal(400);
        expect(rsp.body.messages[0]).to.contain('"money" must be a number');
        done();
      });
    });
  });
});
