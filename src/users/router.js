const express = require('express');
const api = require('./api');
const userValidation = require('./validate');
// const generalValidation = require('../middleware/validate');
const router = express.Router();

// router.param('id', generalValidation.objectId);

router.route('/')
  .get(api.list)
  .post(userValidation.create, api.register);

router.route('/:id')
  .get(api.fetch)
  .put(userValidation.update, api.update)
  .delete(api.remove);

router.route('/token')
  .post(api.generateToken);

module.exports = router;
