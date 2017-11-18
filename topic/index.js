'use strict;'

var express = require('express');
var controller = require('./topic.controller');

var router = express.Router();

router.get('/', controller.getAll);
router.get('/:name', controller.getByName);
router.get('/test/:name', controller.create);
router.post('/', controller.create);
/*router.put('/:id', auth.hasRole('publisher'), controller.update);
router.patch('/:id', auth.hasRole('publisher'), controller.update);
router.delete('/:id', auth.hasRole('publisher'), controller.destroy);
*/
module.exports = router;
