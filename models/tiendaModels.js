const { pool } = require("../database/connection.js");

const bcrypt = require("bcryptjs");
const format = require("pg-format");

const existeEmail = async (email) => {
  const formattedQueryValida = format(
    `select count(*) ya_existe from usuarios where email = '%s'`,
    email
  );
  const data = await pool.query(formattedQueryValida);
  const { ya_existe } = data.rows[0];
  return ya_existe;
};

const retornarUsuario = async (email, id_usuario) => {
  // console.log(email)

  const usuario = {
    text: `SELECT id_usuario, email, COALESCE(nombre, '') nombre, COALESCE(telefono, '') telefono, COALESCE(sexo, 'No contesta') sexo, COALESCE(id_sexo, 4) id_sexo, avatar
    FROM usuarios 
    LEFT OUTER JOIN sexos ON id_sexo=fk_id_sexo
    WHERE email=$1
      AND id_usuario=$2`,
    values: [email, id_usuario],
  };

  console.log(usuario);
  const { rows } = await pool.query(usuario);

  return rows[0];
};

const modificarUsuario = async ({
  id_usuario,
  email,
  nombre,
  telefono,
  id_sexo,
  avatar,
}) => {
  const usuario = {
    text: `UPDATE usuarios SET 
    email=$1, 
    nombre=$2, 
    telefono=$3, 
    fk_id_sexo=$4,
    avatar=$5
    WHERE id_usuario=$6`,
    values: [email, nombre, telefono, id_sexo, avatar, id_usuario],
  };

  //console.log(usuario)
  const { rowCount } = await pool.query(usuario);
  return rowCount;
};

const registraUsuario = async ({ email, uid }) => {
  //const passwordEncriptada = bcrypt.hashSync(password);

  const consulta = {
    text: "INSERT INTO usuarios (id_usuario, email, uid) VALUES (DEFAULT,$1, $2) returning id_usuario",
    values: [email, uid],
  };

  //console.log(consulta)
  const { rows } = await pool.query(consulta);
  const { id_usuario } = rows[0];
  return id_usuario;
};

const validaUsuario = async ({ email, uid }) => {
  const consulta = {
    text: "SELECT id_usuario FROM usuarios where email=$1 and uid=$2",
    values: [email, uid],
  };
  const { rows, rowCount } = await pool.query(consulta);
  //const passwordValida = bcrypt.compareSync(password, clave_registrada);
  if (rowCount > 0) {
    const { id_usuario } = rows[0];
    return id_usuario;
  } else {
    throw { code: 401, message: "Usuario no registrado" };
  }
};

//PRODUCTOS
const registrarProducto = async ({
  nombre,
  descripcion_corta,
  descripcion_completa,
  foto,
  precio,
  stock,
  id_usuario,
  id_categoria,
}) => {
  const consulta = {
    text: "INSERT INTO productos VALUES (DEFAULT,$1, $2, $3, $4, $5, $6, $7, $8)",
    values: [
      nombre,
      descripcion_corta,
      descripcion_completa,
      foto,
      precio,
      stock,
      id_usuario,
      id_categoria,
    ],
  };

  //console.log(consulta)
  const { rowsCount } = await pool.query(consulta);

  return rowsCount;
};

const traeProductos = async ({
  limits = 9,
  page = 1,
  order_by = "precio_ASC",
}) => {
  const [campo, direccion] = order_by.split("_");
  const offset = Math.abs(((page <= 0 ? 1 : page) - 1) * limits);

  const formattedQuery = format(
    `select id_producto, pr.nombre nombre_producto, descripcion_corta, descripcion_completa, foto, precio, stock, us.nombre nombre_usuario, email, categoria
      from productos pr
      inner join usuarios us on id_usuario=fk_id_usuario
      inner join categorias on id_categoria = fk_id_categoria
      order by %s %s
      LIMIT %s
      OFFSET %s`,
    campo,
    direccion,
    limits,
    offset
  );

  const { rows } = await pool.query(formattedQuery);

  return rows;
};

const traeProductosUsuario = async ({
  limits = 15,
  page = 1,
  order_by = "pr.nombre_ASC",
  id_usuario,
}) => {
  const [campo, direccion] = order_by.split("_");
  const offset = Math.abs(((page <= 0 ? 1 : page) - 1) * limits);

  const formattedQuery = format(
    `select id_producto, pr.nombre nombre_producto, descripcion_corta, descripcion_completa, foto, precio, stock, us.nombre nombre_usuario, email, categoria
      from productos pr
      inner join usuarios us on id_usuario=fk_id_usuario
      inner join categorias on id_categoria = fk_id_categoria
      WHERE fk_id_usuario=%s
      order by %s %s
      LIMIT %s
      OFFSET %s`,
    id_usuario,
    campo,
    direccion,
    limits,
    offset
  );

  const { rows } = await pool.query(formattedQuery);

  return rows;
};
const traeProductosCategoria = async ({
  limits = 1,
  page = 1,
  order_by = "pr.nombre_ASC",
  id_categoria,
}) => {
  const [campo, direccion] = order_by.split("_");
  const offset = Math.abs(((page <= 0 ? 1 : page) - 1) * limits);

  const formattedQuery = format(
    `select id_producto, pr.nombre nombre_producto, descripcion_corta, descripcion_completa, foto, precio, stock, us.nombre nombre_usuario, email, categoria
      from productos pr
      inner join usuarios us on id_usuario=fk_id_usuario
      inner join categorias on id_categoria = fk_id_categoria
      WHERE fk_id_categoria=%s
      order by %s %s
      LIMIT %s
      OFFSET %s`,
    id_categoria,
    campo,
    direccion,
    limits,
    offset
  );

  console.log(formattedQuery);
  const { rows } = await pool.query(formattedQuery);
  return rows;
};

const traeProducto = async ({ id }) => {
  const formattedQuery = format(
    `select id_producto, pr.nombre nombre_producto, descripcion_corta, descripcion_completa, foto, precio, stock, us.nombre nombre_usuario, email, categoria
      from productos pr
      inner join usuarios us on id_usuario=fk_id_usuario
      inner join categorias on id_categoria = fk_id_categoria
      WHERE id_producto=%s`,
    id
  );

  //console.log(usuario)
  const { rows } = await pool.query(formattedQuery);
  return rows[0];
};

const traeLike = async (id_usuario) => {
  console.log("Resultado de id usuario:" + id_usuario);
  const formattedQuery = format(
    `select id_producto, nombre nombre_producto, descripcion_corta, descripcion_completa, foto, precio, stock, categoria, id_like
    from likes lk
  INNER JOIN productos ON id_producto=fk_id_producto
    inner join categorias on id_categoria = fk_id_categoria
    where lk.fk_id_usuario=%s
  order by 2`,

    id_usuario
  );
  console.log(formattedQuery);
  const { rows } = await pool.query(formattedQuery);

  return rows;
};

const registraLike = async ({ id_usuario, id_producto }) => {
  const consulta = {
    text: "INSERT INTO likes VALUES (DEFAULT,$1, $2)",
    values: [id_usuario, id_producto],
  };

  //console.log(consulta)
  const { rowsCount } = await pool.query(consulta);

  return rowsCount;
};

const eliminaLike = async ({ id_usuario, id_producto }) => {
  const formattedQuery = format(
    `DELETE FROM likes
      WHERE fk_id_usuario=%s
        AND fk_id_producto=%s`,
    id_usuario,
    id_producto
  );
  //console.log(consulta)
  const { rowsCount } = await pool.query(formattedQuery);
  return rowsCount;
};

const traeMensajesUsuario = async (id, limits, page, order_by) => {
  const [campo, direccion] = order_by.split("|");
  const offset = Math.abs(((page <= 0 ? 1 : page) - 1) * limits);

  const formattedQuery = format(
    `select id_mensaje, mensaje, us.nombre usuario, email, id_producto, pr.nombre producto
    from mensajes
    inner join usuarios us on us.id_usuario=fk_id_usuario
    inner join productos pr on pr.id_producto=fk_id_producto
    where mensajes.fk_id_usuario=%s
    order by %s %s
      LIMIT %s
      OFFSET %s`,
    id,
    campo,
    direccion,
    limits,
    offset
  );

  //console.log(formattedQuery)
  const { rows } = await pool.query(formattedQuery);
  return rows;
};

const registraMensaje = async ({ mensaje, id_usuario, id_producto }) => {
  const consulta = {
    text: "INSERT INTO mensajes VALUES (DEFAULT,$1, $2, $3)",
    values: [mensaje, id_usuario, id_producto],
  };

  //console.log(consulta)
  const { rowsCount } = await pool.query(consulta);

  return rowsCount;
};

module.exports = {
  existeEmail,
  registraUsuario,
  validaUsuario,
  retornarUsuario,
  registrarProducto,
  traeProductos,
  modificarUsuario,
  traeProductosUsuario,
  traeProductosCategoria,
  traeProducto,
  traeLike,
  registraLike,
  eliminaLike,
  registraMensaje,
  traeMensajesUsuario,
};
