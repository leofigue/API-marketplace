const { existeEmail } = require("../models/tiendaModels.js");
const jwt = require("jsonwebtoken");

const validaRegistro = async (req, res, next) => {
  const { email, uid } = req.body;

  // Verificar si algún campo no está definido o no tiene datos.
  if (!email || !uid) {
    console.log("Los datos están incompletos, no puede continuar.");
    return res.status(400).json({ message: "Datos incompletos" });
  }

  // Valida si el email ingresado ya existe en la base de datos.
  const existe = await existeEmail(email);
  if (existe > 0) {
    console.log("El email ingresado ya esta registrado");
    return res
      .status(400)
      .json({ message: "El email ingresado ya esta registrado" });
  }

  console.log("Puede continuar con el registro del usuario.");
  next();
};

const validaLogin = async (req, res, next) => {
  const { email, uid } = req.body;
  console.log(`BACK email: ${email}, uid:${uid}`);

  // Verificar si algún campo no está definido o no tiene datos.
  if (!email || !uid) {
    console.log("Los datos están incompletos, no puede continuar.");
    return res.status(400).json({ message: "Datos incompletos" });
  }

  // Valida si el email ingresado ya existe en la base de datos.
  const existe = await existeEmail(email);
  if (existe == 0) {
    console.log("El email ingresado NO esta registrado");
    return res
      .status(400)
      .json({ message: "El email ingresado NO esta registrado" });
  }

  console.log("Puede continuar con el acceso al sistema.");
  next();
};

const validarProducto = async (req, res, next) => {
  const Authorization = req.header("Authorization");
  if (!Authorization) {
    return res.status(400).json({ message: "El token no esta adjunto" });
  }

  const token = Authorization.split("Bearer ")[1];
  //console.log("TOKEN: " + token)
  try {
    jwt.verify(token, process.env.CLAVE_JWT);
    console.log("Token correcto, puede continuar");
  } catch (error) {
    return res.status(400).json({ message: "El token adjunto no es correcto" });
  }

  const {
    nombre,
    descripcion_corta,
    descripcion_completa,
    foto,
    precio,
    stock,
    id_usuario,
    id_categoria,
  } = req.body;

  // Verificar si algún campo no está definido o no tiene datos.
  if (
    !nombre ||
    !descripcion_corta ||
    !descripcion_completa ||
    !foto ||
    !precio ||
    !stock ||
    !id_usuario ||
    !id_categoria
  ) {
    console.log("Los datos están incompletos, no puede continuar1.");
    return res.status(400).json({ message: "Datos incompletos" });
  }

  console.log("Puede continuar con el registro de producto.");
  next();
};

const validarToken = async (req, res, next) => {
  try {
    //console.log("HEADER: " + req.header("Authorization"))
    const Authorization = req.header("Authorization");
    if (!Authorization) {
      return res.status(400).json({ message: "El token no esta adjunto" });
    }

    const token = Authorization.split("Bearer ")[1];
    //console.log("TOKEN: " + token)
    jwt.verify(token, process.env.CLAVE_JWT);
    console.log("Token correcto, puede continuar");
    next();
  } catch ({ code, message }) {
    console.log(message);
    return res.status(code || 500).json({ message });
  }
};

module.exports = { validaRegistro, validaLogin, validarProducto, validarToken };
