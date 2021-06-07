/**
 * PATH = 'api/login'
 */


const { Router } = require('express');
const { check } = require('express-validator');

const { crearUsuario, logIn, renewToken } = require('../controllers/auth');
const valiarCampos = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router();


router.post('/new', [
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('email', 'El email es obligatorio').isEmail(),
    check('password', 'El password es obligatorio').not().isEmpty(),
    valiarCampos
] ,crearUsuario)

router.post('/', [
    check('email', 'El email es obligatorio').isEmail(),
    check('password', 'El password es obligatorio').not().isEmpty(),
    valiarCampos
], logIn)

router.get('/renew', validarJWT, renewToken)


module.exports = router;