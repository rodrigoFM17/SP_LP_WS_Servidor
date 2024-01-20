const db = require('../config/db.config')
const crypto = require('node:crypto')


const index = async (req, res) =>{

    try {

        const connection = await db.createConnection()

        const [rows] = await connection.execute('select * from usuario')
        connection.end()

        res.status(200).json({
            message: 'usuarios obtenidos correctamente',
            usuarios: rows
        })

    } catch (error){

        console.log(error)

        res.status(500).json({
            message: 'error al obtener los usuarios',
            error: error.message
        })
    }
}


const createUser = async (req, res) => {

    try{
       
        const { nombre, telefono} = req.body
        
        const newUser = {
            id: crypto.randomUUID(),
            nombre, 
            telefono,
        }

        const connection = await db.createConnection()

        connection.execute('insert into usuario (id, nombre, telefono) values (?, ?, ?) ', [newUser.id, newUser.nombre, newUser.telefono])
        connection.end()

        res.status(201).json({
            message: 'usuario creado exitosamente',
            newUser
        })

    } catch( error){
        
        res.status(500).json({
            message: 'hubo un problema al crear el usuario',
            error: error.message
        })

        console.log(error)
    }
    
}

const userAuthentication = async (req, res) =>{

    try {

        const { telefono } = req.params

        const connection = await db.createConnection()

        const [rows] = await connection.execute('select * from usuario where telefono = ?', [telefono])
        connection.end()

        if(rows.length == 0){
            res.status(401).json({
                message: 'telefono invalido',
                success: false
            })
        } else {

            res.status(200).json({
                message: 'usuario autenticado correctamente',
                success: true,
                userId: rows[0].id,
                name: rows[0].nombre
            })
        }

    } catch (error){

        console.log(error)

        res.status(500).json({
            message: 'error al obtener los usuarios',
            error: error.message
        })
    }
}

module.exports = {
    index,
    createUser,
    userAuthentication
}
