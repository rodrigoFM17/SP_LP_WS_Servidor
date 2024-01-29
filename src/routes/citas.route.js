const express = require('express')
const router = express.Router()

const citasController = require('../controllers/citas.controller')

router.get('/', citasController.index)
router.get('/:anio/:mes/:dia', citasController.getDateByDay)
router.get('/:anio/:mes/:dia/:usuarioId/:hora', citasController.getMissingTime)
router.get('/update', citasController.updateDate)
router.post('/', citasController.createDate)
router.get('/:year/:month', citasController.getDateByMonth)


module.exports = router