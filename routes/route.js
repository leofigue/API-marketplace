const express = require("express");
const controladorUsuario = require("../controllers/usuarioController.js");
const controladorProducto = require("../controllers/productoController.js");
const {
  validaRegistro,
  validaLogin,
  validarProducto,
  validarToken,
} = require("../middleware/validaciones.js");

const registroActividad = require("../utils/registro_actividad.js");

const router = express.Router();

router.use(registroActividad);

//Valida las credenciales email y uid de google, además, retorna TOKEN
router.post("/login", validaLogin, controladorUsuario.validaUsuario);
//Retorna la información del usuario
router.get("/usuario/profile", controladorUsuario.retornarUsuario);
//Actualiza los datos de un usuario
router.put(
  "/usuario/profile",
  validarToken,
  controladorUsuario.modificarUsuario
);
//Registra un nuevo usuario solo con el email y uid de google
router.post(
  "/usuario/registro",
  validaRegistro,
  controladorUsuario.registrarUsuario
);

//PRODUCTOS uso publico
router.get("/productos", controladorProducto.productos); // Trae todos los productos
router.get("/productos/categoria", controladorProducto.productosCategoria); // Trae todos los productos filtrados por categoria
router.get("/productos/producto/:id", controladorProducto.producto); //Trae un solo producto
//PRIVADO requiere token
router.get("/productos/usuario", controladorProducto.productosUsuario); // Trae todos los productos filtrados por usuario
router.post(
  "/producto",
  validarProducto,
  controladorProducto.registrarProducto
); //Registra un nuevo producto
router.get("/producto/like", controladorProducto.traeLike); //Trae like de un producto
router.post("/producto/like", validarToken, controladorProducto.registrarLike); //Registra un nuevo like
router.delete("/producto/like", validarToken, controladorProducto.eliminarLike); //Elimina un like

router.get(
  "/producto/mensajes/:id",
  validarToken,
  controladorProducto.traerMensajesUsario
); //Registra un nuevo like
router.post(
  "/producto/mensaje",
  validarToken,
  controladorProducto.registrarMensaje
); //Registra un nuevo like

module.exports = router;
