const { registraUsuario, validaUsuario, retornarUsuario, modificarUsuario } = require('../models/tiendaModels.js');
const jwt = require("jsonwebtoken");

class usuarioController{
    constructor(){}
    async registrarUsuario (req, res) {
        try {
            const { email } = req.body
            const id_usuario = await registraUsuario(req.body);
            console.log(id_usuario)
            const token = jwt.sign( {email, "id_usuario": id_usuario} , process.env.CLAVE_JWT);
            console.log("Token generado para usuario: ",email);
            console.log(token);
            res.status(200).json({token});
        } catch ({ code, message }) {
            console.log(message);
            res.status(code || 500).json({message});
        }
    }
    
    async retornarUsuario (req, res) {
        try {
            //console.log("HEADER: " + req.header("Authorization"))
            const Authorization = req.header("Authorization")
            const token = Authorization.split("Bearer ")[1]
            //console.log("TOKEN: " + token)
            jwt.verify(token, process.env.CLAVE_JWT)
            const { email, id_usuario } = jwt.decode(token)

            console.log(`Token: ${token}`)
            console.log(`Email: ${email}, Id: ${id_usuario}`)

            const user = await retornarUsuario(email, id_usuario);
            //console.log(user)
            res.status(200).json(user)
        } catch ({ code, message }) {
            console.log(message);
            res.status(code || 500).json({message});
        }
    }
    async modificarUsuario (req, res) {
        try {
            
            
            const user = await modificarUsuario(req.body);
            user > 0 ? res.status(200).json({"message": "Usuario actualizado"})
                     : res.status(400).json({"message": "La actualizacion no se realizo"}) 
            
        } catch ({ code, message }) {
            console.log(message);
            res.status(code || 500).json({message});
        }
    }
    
    async validaUsuario (req, res) {
        try {
            const { email } = req.body
            const acceso = await validaUsuario(req.body);
            console.log(acceso)
            const token = jwt.sign( {email, "id_usuario": acceso} , process.env.CLAVE_JWT);
            console.log("Token generado para usuario: ",email);
            console.log(token);
            res.status(200).json({token});    
        } catch ({ code, message }) {
            console.log(message);
            res.status(code || 500).json({message});
        }
    }
    
}

module.exports = new usuarioController();