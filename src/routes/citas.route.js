const express = require('express')
const router = express.Router()

const citasController = require('../controllers/citas.controller')

router.get('/:anio/:mes/:dia', citasController.getDateByDay)
router.get('/:id', citasController.getDateById)
router.post('/', citasController.createDate)

module.exports = router