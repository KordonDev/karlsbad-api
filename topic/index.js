'use strict;'

var express = require('express');
var controller = require('./topic.controller');

var router = express.Router();

router.get('/', controller.getAll);
router.get('/:id', controller.getById);
/* router.post('/', auth.hasRole('publisher'), controller.create);
router.put('/:id', auth.hasRole('publisher'), controller.update);
router.patch('/:id', auth.hasRole('publisher'), controller.update);
router.delete('/:id', auth.hasRole('publisher'), controller.destroy);
*/
module.exports = router;
