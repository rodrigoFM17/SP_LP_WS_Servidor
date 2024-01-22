const express = require('express')
const usuariosController = require('../controllers/usuarios.controller')
const router = express.Router()


router.post('/', usuariosController.createUser)
router.get('/', usuariosController.index)

module.exports = router