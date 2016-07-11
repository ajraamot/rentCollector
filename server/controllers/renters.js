/* eslint-disable newline-per-chained-call, new-cap, no-param-reassign, consistent-return, no-underscore-dangle, array-callback-return, max-len */

import express from 'express';
import Renter from '../models/renter';
import renterBodyValidator from '../validators/renterBody';
import renterParamValidator from '../validators/params';
const router = module.exports = express.Router();

router.get('/', (req, res) => {
  Renter.find((err, renters) => {
    res.send({ renters });
  });
});


router.get('/:id', (req, res) => {
  Renter.findById(req.params.id, (err, renter) => {
    if (renter) {
      res.send({ renter });
    } else {
      res.status(400).send({ messages: ['id not found'] });
    }
  });
});

router.post('/', renterBodyValidator, (req, res) => {
  Renter.create(res.locals, (err, renter) => {
    res.send({ renter });
  });
});

router.delete('/:id', renterParamValidator, (req, res) => {
  Renter.findByIdAndRemove(req.params.id, (err, renter) => {
    if (renter) {
      res.send({ id: renter._id });
    } else {
      res.status(400).send({ messages: ['id not found'] });
    }
  });
});

router.put('/:id', renterBodyValidator, (req, res) => {
  Renter.findByIdAndUpdate(req.params.id, req.body, { new: true }, (err, renter) => {
    res.send({ renter });
  });
});
