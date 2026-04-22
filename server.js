const express = require('express');
const sql = require('mssql');
const cors = require('cors');

const app = express();

const dbConfig = {
    user: 'sa', 
    password: 'YourStrongPassword123', 
    server: 'localhost', 
    port: 1433,
    database: 'master 2', 
    options: {
        encrypt: false, 
        trustServerCertificate: true 
    }
};

app.use(cors()); 
app.use(express.json()); 

app.post('/api/register', async (req, res) => {
    try {
        const { username, password } = req.body;

        let pool = await sql.connect(dbConfig);

        await pool.request()
            .input('name', sql.NVarChar, username)
            .input('pass', sql.NVarChar, password)
            .query('INSERT INTO Users (Username, Password) VALUES (@name, @pass)');

        res.status(200).send('Пользователь успешно зарегистрирован!');
    } catch (err) {
        console.error('Ошибка БД:', err);
        res.status(500).send('Ошибка на стороне сервера');
    }
});

app.listen(3000, () => {
    console.log('Сервер запущен на http://localhost:3000');
});
