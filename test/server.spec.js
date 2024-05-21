const request = require("supertest");
const server = require("../index");

describe("Datos del Usuario",()=>{
    
    it('Consulta los datos de un usuario sin token', async ()=>{
        const respuesta = await request(server)
        .get('/usuarios')
        .send();
        expect(respuesta.statusCode).toBe(500);
    });

    it('Consulta los datos de un usuario con token', async ()=>{
        const jwt = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Imxlby5maWd1ZXJvYS5hQGdtYWlsLmNvbSIsImlkX3VzdWFyaW8iOjEsImlhdCI6MTcxMzkyODkzMn0.kqsRFi1Fp7JpaGSPq5S5kZcFHYPfLOJVosSg4yfQW4w";
        const respuesta = await request(server)
        .get('/usuarios')
        .set("Authorization", jwt)
        .send();
        expect(respuesta.statusCode).toBe(200);
    });

});

describe("TESTING Productos",()=>{

    it('Consultar todos los Productos', async ()=>{
        const respuesta = await request(server)
        .get('/productos')
        .send();
        expect(respuesta.statusCode).toBe(200);
    });
});

describe("TESTING LIKE y Mensajes",()=>{

    it('Insertar un like', async ()=>{
        const like = {id_usuario: '1', id_producto:'1'};
        const respuesta = await request(server)
        .delete('/producto/like')
        .send(like);
        expect(respuesta.statusCode).toBe(400);
    });

    it('Eliminar un like sin token', async ()=>{
        const like = {id_usuario: '1', id_producto:'3'};
        const respuesta = await request(server)
        .delete('/producto/like')
        .send(like);
        expect(respuesta.statusCode).toBe(400);
    });
    
    it('Eliminar un like', async ()=>{
        const jwt = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Imxlby5maWd1ZXJvYS5hQGdtYWlsLmNvbSIsImlkX3VzdWFyaW8iOjEsImlhdCI6MTcxMzkyODkzMn0.kqsRFi1Fp7JpaGSPq5S5kZcFHYPfLOJVosSg4yfQW4w";
        const like = {id_usuario: '1', id_producto:'3'};
        const respuesta = await request(server)
        .delete('/producto/like')
        .set("Authorization", jwt)
        .send(like);

        expect(respuesta.statusCode).toBe(200);
    });

    it('Traer Mensajes', async ()=>{
        const jwt = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Imxlby5maWd1ZXJvYS5hQGdtYWlsLmNvbSIsImlkX3VzdWFyaW8iOjEsImlhdCI6MTcxMzkyODkzMn0.kqsRFi1Fp7JpaGSPq5S5kZcFHYPfLOJVosSg4yfQW4w";
        const idUsuario = 1
        const respuesta = await request(server)
        .get(`/producto/mensajes/${idUsuario}`)
        .set("Authorization", jwt)
        .send();
        expect(respuesta.statusCode).toBe(200);
    });

});