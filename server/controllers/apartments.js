/* eslint-disable newline-per-chained-call, new-cap, no-param-reassign, consistent-return, no-underscore-dangle, array-callback-return, max-len */
import express from 'express';
import Apartment from '../models/apartment';
import paramsValidator from '../validators/params';
import apartmentBodyValidator from '../validators/apartmentBody';
const router = module.exports = express.Router();

router.get('/', (req, res) => {
  Apartment.find((err, apartments) => {
    res.send({ apartments });
  });
});

router.get('/:id', (req, res) => {
  Apartment.findById(req.params.id, (err, apartment) => {
    if (apartment) {
      res.send({ apartment });
    } else {
      res.status(400).send({ messages: ['id not found'] });
    }
  });
});

router.post('/', apartmentBodyValidator, (req, res) => {
  Apartment.create(res.locals, (err, apartment) => {
    res.send({ apartment });
  });
});

router.delete('/:id', paramsValidator, (req, res) => {
  Apartment.findByIdAndRemove(req.params.id, (err, apartment) => {
    if (apartment) {
      res.send({ id: apartment._id });
    } else {
      res.status(400).send({ messages: ['id not found'] });
    }
  });
});

router.put('/:id', (req, res) => {
  Apartment.findByIdAndUpdate(req.params.id, req.body, { new: true }, (err, apartment) => {
    res.send({ apartment });
  });
});
