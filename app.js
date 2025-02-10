require('dotenv').config();    //llamado para usar COLOR_FAVORITO
const {db} = require('./conexion.js')

const express = require('express');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');

const PORT = process.env.PORT || 3000

const server = express();
server.use(express.json());

// Cargar Swagger
const swaggerDocs = YAML.load('./swagger.yaml');
// Middleware de Swagger
server.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

server.get("/", (req, res) => {
    const letra = process.env.LETRA || 'KA'
    const dia = process.env.DIA
    const color = process.env.COLOR_FAVORITO;
    const info = `<br>  Host de la base de datos:<b>${db.config.connectionConfig.host} </b> <br>database: ${db.config.connectionConfig.database} `
    res.send(`★彡[ᴀᴘɪ | ꜰᴜɴᴄɪᴏɴᴀɴᴅᴏ ᴄᴏʀʀᴇᴄᴛᴀᴍᴇɴᴛᴇ]彡★ ${info} <br> ${color} <br> ${letra} <br> ${dia} `);
});

//GET | Ruta para obtener usuarios desde la base de datos
server.get('/usuarios', (req, res) => {
    db.query('SELECT id, nombre, edad FROM usuarios', (err, results) => {
        if (err) {
            res.status(500).json({ error: 'Error en la consulta' });
            return;
        }
        res.json(results);    //result debuleve un array de obejtos de los usuarios
    });
});

//GET | obtener 1 usuario
server.get('/usuarios/:id',(req,res)=>{
    const userId = req.params.id
    const sql = ('SELECT id, nombre,edad FROM usuarios WHERE id=?')
    db.query(sql,[userId],(err,result)=>{
        if (err) {
            return res.status(500).json({ error: 'Error en el servidor' });
        }
        if (result.length === 0) {
            return res.status(404).json({ error: 'Usuario no encontrado - id' });
        }
        res.json(result[0]) //debuelve array /se pone [0] para entrar directo al objeto
    })
})

//POST | Ruta para insertar un nuevo usuario en la base de datos
server.post('/usuarios', (req, res) => {
    const { nombre, edad } = req.body;
    const sql = 'INSERT INTO usuarios (nombre, edad) VALUES (?, ?)';
    db.query(sql, [nombre, edad], (err, result) => {
        if (err) {
            console.error('Error al insertar un usuario:', err);
            return res.status(500).json({ error: 'Error al insertar usuario' });
        }
        res.status(201).json({ message: 'Usuario agregado con éxito', id: result.insertId });
    });
});

//PUT | actualizar usuario
server.put('/usuarios/:id', (req, res)=>{
    const userId = req.params.id;   //params.id obetiene el id de la url 
    const {nombre, edad} = req.body
    const sql = 'UPDATE usuarios SET nombre = ?, edad = ? WHERE id = ?';
    db.query(sql, [nombre, edad, userId], (err, result) => {
        if (err) {
            console.error('Error al actualizar usuario:', err);
            return res.status(500).json({ error: 'Error en el servidor' });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }
        res.json({ message: 'Usuario actualizado correctamente' });
    });
})

//DELETE eliminar usuario
server.delete('/usuarios/:id',(req,res)=>{
    const userId = req.params.id
    const sql = "DELETE FROM usuarios WHERE id=?"
    db.query(sql,[userId],(err, result)=>{
        if(err){
            return res.status(500).json({error: 'no se pudo eliminar'})
        }
        if(result.affectedRows === 0){
            return res.status(500).json({error:'Usuario no encontrado'})
        }
        res.json({message:'Usuario Eliminado Corectamente'})
    })
})

// Iniciar el servidor
server.listen(PORT, function(){console.log('Servidor corriendo')});


// npm install express 
// npm install mysql2
// npm install swagger-ui-express
// npm install yamljs
// npm install dotenv