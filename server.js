const express = require('express');
const sql = require('mssql/'); //msnodesqlv8 
const cors = require('cors');

const app = express();
app.use(express.json()); 
app.use(cors()); 

const dbConfig = {
    // connectionString:"Driver={ODBC Driver 17 for SQL Server};Server=A102PCPREPOD\\A102PCPREPOD;Database=users_snake;Trusted_Connection=Yes;",
    // driver: "msnodesqlv8",
    user: 'sa', 
    password: 'Nikpro12345', 
    server: 'localhost',
    port: 1433,
    database: 'snake_data', 
    options: {
         encrypt: false, 
         trustServerCertificate: true 
    }
};

app.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body;

        let pool = await sql.connect(dbConfig);

        const checkUsers = await pool.request()
            .input('username', sql.NVarChar, username)
            .query("SELECT * from dbo.users WHERE username = @username")
            if(checkUsers.recordset.length > 0){
             return res.status(400).send("Пользователь уже существует с таким именем");
            }

        await pool.request()
            .input('username', sql.NVarChar, username)
            .input('password', sql.NVarChar, password)
            .query('INSERT INTO dbo.users (username, password) VALUES (@username, @password)');

        await pool.request()
            .input('username', sql.NVarChar, username)
            .query('INSERT INTO dbo.[Statistics] (Username, AppleCollection, TimeCollection, StartCollection) VALUES (@username, 0, 0, 0)');    
        res.status(200).send('Пользователь успешно зарегистрирован!')
    } catch (err) {
        console.error('Ошибка БД:', err);
        res.status(500).send('Ошибка на стороне сервера');
    }
});

app.post('/statistics', async (req, res) => {
      try {
        const { username, apple_collection, time_collection, start_collection } = req.body;
        
        let pool = await sql.connect(dbConfig);

        const result = await pool.request()
            .input('username', sql.NVarChar, username)
            .input('apples', sql.Int, parseInt(apple_collection) || 0)
            .input('time', sql.Int, parseInt(time_collection) || 0)
            .input('starts', sql.Int, parseInt(start_collection) || 0)
             .query(`
                UPDATE dbo.[Statistics] 
                SET 
                    AppleCollection = @apples,
                    TimeCollection = @time,
                    StartCollection = @starts,
                    LastUpdatedAt = GETDATE()
                WHERE Username = @username
            `);

        const rowsUpdated = result.rowsAffected && result.rowsAffected[0] ? result.rowsAffected[0] : 0;        

        console.log(`Запрос от ${username}. Строк обновлено в базе:`, result.rowsAffected[0]);

        if (result.rowsAffected === 0) {
          return res.status(404).send("Пользователь не найден в базе данных, статистика не обновлена");
        }

        if (result.rowsAffected[0] === 0) {
            return res.status(404).send("Пользователь не найден в базе данных, обновление не выполнено");
        }

        res.status(200).send('Статистика в SQL Server успешно обновлена!');
    } catch (err) {
        console.error('Ошибка:', err);
        res.status(500).send('Ошибка сервера');
    }
    
});

app.listen(3000, () => {
    console.log('Сервер запущен на http://127.0.0.1:3000');
});
