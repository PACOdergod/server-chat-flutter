const { response, json } = require('express')
const bcryptjs = require('bcryptjs')

const  Usuario  = require('../models/usuario');
const { generarJWT } = require('../helpers/JWT');


const crearUsuario = async (req, res = response)=>{ 

    const { email,password } = req.body;

    console.log(email, password);
    
    try {

        const existeEmail = await Usuario.findOne({email : email})
        if (existeEmail) {
            return res.status(400).json({
                ok: false,
                msg: 'el correo ya esta registrado'
            })
        }
        const usuario = new Usuario(req.body)

        // encriptar contraseña
        const salt = bcryptjs.genSaltSync();
        usuario.password = bcryptjs.hashSync( password, salt)

        await usuario.save();


        // Generar JWT
        const token = await generarJWT(usuario.id)


        res.json({
            ok: true,
            usuario:{
                id: usuario.id,
                email:usuario.email,
                nombre: usuario.nombre
            },
            token
        })
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok:false,
            msg: 'intentelo dentro de unos minutos'
        })
    }
}

const logIn = async (req, res = response)=>{
    const { email,password } = req.body;

    const usuarioDB = await Usuario.findOne({email})
   
    try {
        if (!usuarioDB) {
            return res.status(404).json({
                ok: false,
                msg: 'el correo no esta registrado'
            })
        }


        //comparar password
        const validPassword = bcryptjs.compareSync(password, usuarioDB.password);
        if (!validPassword) {
            return res.status(400).json({
                ok: false,
                msg: 'la contraseña no es valida'
            })
        }

        // todo ok
        const token = await generarJWT(usuarioDB.id)
        res.json({
            ok: true,
            usuario:{
                id: usuarioDB.id,
                nombre: usuarioDB.nombre,
                email:usuarioDB.email,
            },
            token
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok:false,
            msg: 'intentelo dentro de unos minutos'
        })
    }
}

const renewToken = async (req, res = response)=>{

    const uid = req.uid;

    const token = await generarJWT(uid)

    const usuario = await Usuario.findById(uid)

    

    res.json({
        ok:true,
        usuario,
        token
    })
}



module.exports={
    crearUsuario,
    logIn,
    renewToken
}