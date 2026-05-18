const express = require('express');
const sql = require('mssql/msnodesqlv8'); 
const cors = require('cors');
import { LocalStorage } from 'node-localstorage';
const localStorage = new LocalStorage("./scratch");

const app = express();
app.use(express.json()); 
app.use(cors()); 

const dbConfig = {
    connectionString:"Driver={ODBC Driver 17 for SQL Server};Server=A102PCPREPOD\\A102PCPREPOD;Database=users_snake;Trusted_Connection=Yes;",
    driver: "msnodesqlv8",
    // user: 'sa', 
    // password: 'Nikpro12345', 
    // server: 'localhost',
    // port: 1433,
    // database: 'snake_data', 
    // options: {
    //     encrypt: false, 
    //     trustServerCertificate: true 
    // }
};

app.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body;

        let pool = await sql.connect(dbConfig);

        const checkUsers = await pool.request()
            .input('username', sql.NVarChar, username)
            .query("SELECT * from dbo.users WHERE username = @username")
            if(checkUsers.recordset.length > 0){
             const haveUser = localStorage.setItem("posthaveUser", checkUsers);
             return res.status(400).send("Пользователь уже существует с таким именем");
            }

        await pool.request()
            .input('username', sql.NVarChar, username)
            .input('password', sql.NVarChar, password)
            .query('INSERT INTO dbo.users (username, password) VALUES (@username, @password)');      
        res.status(200).send('Пользователь успешно зарегистрирован!')
    } catch (err) {
        console.error('Ошибка БД:', err);
        res.status(500).send('Ошибка на стороне сервера');
    }
});

// //get all statistics from database
// app.get('/statistics', async(req, res) => {
//     const connect = await sql.connect(dbConfig);

//     const result = await connect.request()
//                 .query("SELECT * from dbo.statistics");
    
//     res.json(result.recodset);
// });

app.listen(3000, () => {
    console.log('Сервер запущен на http://127.0.0.1:3000');
});
