const express = require('express')

const router = express.Router()
const tratamientosController = require('../controllers/tratamientos.controller')

router.get('/', tratamientosController.index)