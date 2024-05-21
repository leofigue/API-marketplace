require("dotenv").config();

const express = require("express");
const cors = require("cors");

// SDK de Mercado Pago
const { MercadoPagoConfig, Preference } = require("mercadopago");

// Agrega credenciales
const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN,
});

const app = express();
const PORT = process.env.PGPORT || 3000;
const route = require("./routes/route.js");

app.use(express.json());
app.use(cors());
app.use("/", route);

//Prueba MercadoPago

app.post("/create_preference", async (req, res) => {
  try {
    const body = {
      items: [
        {
          title: req.body.title,
          quantity: Number(req.body.quantity),
          unit_price: Number(req.body.price),
          currency_id: "CL",
        },
      ],
      back_urls: {
        success: "www.youtube.com",
        failure: "www.youtube.com",
        pending: "www.youtube.com",
      },
      auto_return: "approved",
    };

    const preference = new Preference(client);
    const result = await preference.create({ body });
    res.json({
      id: result.id,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error al crear la preferencia." });
  }
});

//Levanta el servidor
app.listen(PORT, console.log("Servidor iniciado!!!"));

module.exports = app;
