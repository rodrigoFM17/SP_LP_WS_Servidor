const express = require('express')
const usuariosController = require('../controllers/usuarios.controller')
const router = express.Router()


router.post('/', usuariosController.createUser)
router.get('/', usuariosController.index)
router.get('/authentication/:telefono', usuariosController.userAuthentication )

module.exports = router