/* eslint-disable no-unused-expressions, no-underscore-dangle, max-len */

const expect = require('chai').expect;
const request = require('supertest');
const app = require('../../dst/server');
const cp = require('child_process');
const Apartment = require('../../dst/models/apartment');


describe('apartment', () => {
  beforeEach((done) => {
    cp.execFile(`${__dirname}/../scripts/populateApartments.sh`, { cwd: `${__dirname}/../scripts` }, () => {
      done();
    });
  });

  describe('get /apartments', () => {
    it('should return all apartments', (done) => {
      request(app)
      .get('/apartments')
      .end((err, rsp) => {
        expect(err).to.be.null;
        expect(rsp.status).to.equal(200);
        expect(rsp.body.apartments).to.have.length(2);
        done();
      });
    });
  });
  describe('get /apartments/:id', () => {
    it('should get one apartment', (done) => {
      request(app)
      .get('/apartments/012345678901234567890010')
      .end((err, rsp) => {
        expect(err).to.be.null;
        expect(rsp.status).to.equal(200);
        expect(rsp.body.apartment._id).to.equal('012345678901234567890010');
        expect(rsp.body.apartment.name).to.equal('a1');
        done();
      });
    });
    it('should not retrieve an apartment that does not exist', (done) => {
      request(app)
      .get('/apartments/012345678901234567899999')
      .end((err, rsp) => {
        expect(err).to.be.null;
        expect(rsp.status).to.equal(400);
        expect(rsp.body.messages[0]).to.equal('id not found');
        done();
      });
    });
  });
  describe('post /apartments', () => {
    it('should create a apartment', (done) => {
      request(app)
      .post('/apartments')
      .send({ name: 'a22', sqft: 1500, bedrooms: 2, floor: 2, rent: 1800 })
      .end((err, rsp) => {
        expect(err).to.be.null;
        expect(rsp.status).to.equal(200);
        expect(rsp.body.apartment_id).to.not.be.null;
        expect(rsp.body.apartment.name).to.equal('a22');
        expect(rsp.body.apartment.sqft).to.equal(1500);
        expect(rsp.body.apartment.bedrooms).to.equal(2);
        expect(rsp.body.apartment.floor).to.equal(2);
        expect(rsp.body.apartment.rent).to.equal(1800);
        done();
      });
    });
    it('should NOT create an apartment -- name missing', (done) => {
      request(app)
      .post('/apartments')
      .send({ sqft: 1500, bedrooms: 2, floor: 2, rent: 1800 })
      .end((err, rsp) => {
        expect(err).to.be.null;
        expect(rsp.status).to.equal(400);
        expect(rsp.body.messages).to.deep.equal(['"name" is required']);
        done();
      });
    });
    it('should NOT create an apartment -- sqft missing', (done) => {
      request(app)
      .post('/apartments')
      .send({ name: 'Penthouse', bedrooms: 2, floor: 2, rent: 1800 })
      .end((err, rsp) => {
        expect(err).to.be.null;
        expect(rsp.status).to.equal(400);
        expect(rsp.body.messages).to.deep.equal(['"sqft" is required']);
        done();
      });
    });
    it('should NOT create an apartment -- bedrooms missing', (done) => {
      request(app)
      .post('/apartments')
      .send({ name: 'Penthouse', sqft: 1522, floor: 2, rent: 1800 })
      .end((err, rsp) => {
        expect(err).to.be.null;
        expect(rsp.status).to.equal(400);
        expect(rsp.body.messages).to.deep.equal(['"bedrooms" is required']);
        done();
      });
    });
    it('should NOT create an apartment -- floor missing', (done) => {
      request(app)
      .post('/apartments')
      .send({ name: 'Penthouse', bedrooms: 2, sqft: 1522, rent: 1800 })
      .end((err, rsp) => {
        expect(err).to.be.null;
        expect(rsp.status).to.equal(400);
        expect(rsp.body.messages).to.deep.equal(['"floor" is required']);
        done();
      });
    });
    it('should NOT create an apartment -- rent missing', (done) => {
      request(app)
      .post('/apartments')
      .send({ name: 'Penthouse', bedrooms: 2, floor: 2, sqft: 1522 })
      .end((err, rsp) => {
        expect(err).to.be.null;
        expect(rsp.status).to.equal(400);
        expect(rsp.body.messages).to.deep.equal(['"rent" is required']);
        done();
      });
    });
  });
  describe('delete /apartments/:id', () => {
    it('should delete an apartment', (done) => {
      Apartment.create({ name: 'a22', sqft: 1500, bedrooms: 2, floor: 2, rent: 1800 }, (err1, apartment) => {
        const id = apartment._id.toString();
        request(app)
        .delete(`/apartments/${id}`)
        .end((err2, rsp) => {
          expect(err2).to.be.null;
          expect(rsp.status).to.equal(200);
          expect(rsp.body.id).to.equal(id);
          done();
        });
      });
    });
    it('should not delete an apartment who does not exist', (done) => {
      request(app)
      .delete('/apartments/012345678901234567899999')
      .end((err, rsp) => {
        expect(err).to.be.null;
        expect(rsp.status).to.equal(400);
        expect(rsp.body.messages).to.deep.equal(['id not found']);
        done();
      });
    });
    it('should NOT delete an apartment -- bad id', (done) => {
      request(app)
      .delete('/apartments/badid')
      .end((err2, rsp) => {
        expect(err2).to.be.null;
        expect(rsp.status).to.equal(400);
        expect(rsp.body.messages[0]).to.contain('"id" with value "badid" fails to match the required pattern');
        done();
      });
    });
  });
  describe('put /apartments/:id', () => {
    it('should update apartment', (done) => {
      request(app)
      .put('/apartments/012345678901234567890010')
      .send({ name: 'a100', sqft: 1700 })
      .end((err, rsp) => {
        expect(err).to.be.null;
        expect(rsp.status).to.equal(200);
        expect(rsp.body.apartment.name).to.equal('a100');
        expect(rsp.body.apartment.sqft).to.equal(1700);
        done();
      });
    });
  });
});
