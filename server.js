const express = require('express');
const sql = require('mssql/msnodesqlv8');  
const cors = require('cors');

const app = express();
app.use(express.json()); 
app.use(cors()); 

const dbConfig = {
    connectionString:"Driver={ODBC Driver 17 for SQL Server};Server=mssql,1433;Database=snake_data;UID=sa;PWD=Snake_Pass123!;TrustServerCertificate=yes;",
    driver: "msnodesqlv8",
    // user: 'sa', 
    // password: 'Nikpro12345', 
    // server: 'localhost',
    // port: 1433,
    // database: 'snake_data', 
    // options: {
    //      encrypt: false, 
    //      trustServerCertificate: true 
    // }
};

app.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body;

        let pool = await sql.connect(dbConfig);

        const checkUsers = await pool.request()
            .input('username', sql.NVarChar, username)
            .query("SELECT * from dbo.users WHERE username = @username");
            
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
        
        res.status(200).send('Пользователь успешно зарегистрирован!');
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

        console.log(`Запрос от ${username}. Строк обновлено в базе:`, result.rowsAffected[0]);

        if (!result.rowsAffected || result.rowsAffected[0] === 0) {
            return res.status(404).send("Пользователь не найден в базе данных, обновление не выполнено");
        }

        res.status(200).send('Статистика в SQL Server успешно обновлена!');
    } catch (err) {
        console.error('Ошибка:', err);
        res.status(500).send('Ошибка сервера');
    }
});

app.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).send("Заполните все поля");
        }

        let pool = await sql.connect(dbConfig);

        const result = await pool.request()
            .input('username', sql.NVarChar, username)
            .query("SELECT * from dbo.users WHERE username = @username");
        
        if (!result.recordset || result.recordset.length === 0) {
            return res.status(401).send("Неверное имя пользователя или пароль");
        }

        const user = result.recordset[0]; 
        const dbPassword = user.password || user.Password;
        
        if (dbPassword !== password) {
            return res.status(401).send("Неверное имя пользователя или пароль");
        }

        const statsResult = await pool.request()
            .input('username', sql.NVarChar, username)
            .query("SELECT AppleCollection, TimeCollection, StartCollection FROM dbo.[Statistics] WHERE Username = @username");

        const rawStats = (statsResult.recordset && statsResult.recordset.length > 0) 
            ? statsResult.recordset[0] 
            : { AppleCollection: 0, TimeCollection: 0, StartCollection: 0 };

      
        const buildHistoryArray = (count) => {
            return Array.from({ length: count || 0 }, () => ({ points: 1, time: Date.now() }));
        };

        const statisticsForClient = {
            AppleCollection: buildHistoryArray(rawStats.AppleCollection),
            TimeCollection: buildHistoryArray(rawStats.TimeCollection),
            StartCollection: buildHistoryArray(rawStats.StartCollection)
        };

        res.status(200).json({
            message: "Вход успешно выполнен!",
            user: {
                id: user.id || user.Id || null, 
                username: user.username || user.Username
            },
            statistics: statisticsForClient 
        });        
        
    } catch (err) {
        console.error('Критическая ошибка сервера:', err);
        res.status(500).send('Ошибка сервера');
    }
});

app.listen(3000, () => {
    console.log('Сервер запущен на http://127.0.0.1:3000');
});
