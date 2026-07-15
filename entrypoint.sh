#!/bin/sh
set -e

echo "▶ Patching ODBC driver version…"
node -e "
const fs = require('fs');
let s = fs.readFileSync('/app/server.js', 'utf8');
s = s.replace(/ODBC Driver 17 for SQL Server/g, 'ODBC Driver 18 for SQL Server');
fs.writeFileSync('/app/server.js', s);
console.log('Patched.');
"

echo "▶ Waiting for SQL Server to be ready…"
for i in $(seq 1 30); do
  /opt/mssql-tools18/bin/sqlcmd -S mssql -U sa -P "$MSSQL_SA_PASSWORD" \
    -Q "SELECT 1" -C -l 3 > /dev/null 2>&1 && break
  echo "  waiting… ($i/30)"
  sleep 2
done

echo "▶ Creating database and tables…"
/opt/mssql-tools18/bin/sqlcmd -S mssql -U sa -P "$MSSQL_SA_PASSWORD" -C -Q "
IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = 'snake_data')
    CREATE DATABASE snake_data;
"

/opt/mssql-tools18/bin/sqlcmd -S mssql -U sa -P "$MSSQL_SA_PASSWORD" -C -d snake_data -Q "
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='users' AND xtype='U')
CREATE TABLE dbo.users (
    Username NVARCHAR(50) NOT NULL PRIMARY KEY,
    CreatedAt DATETIME DEFAULT GETDATE(),
    Password NVARCHAR(255) NOT NULL
);

IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Statistics' AND xtype='U')
CREATE TABLE dbo.[Statistics] (
    Username NVARCHAR(50) NOT NULL PRIMARY KEY,
    AppleCollection INT NOT NULL DEFAULT 0,
    TimeCollection INT NOT NULL DEFAULT 0,
    StartCollection INT NOT NULL DEFAULT 0,
    LastUpdatedAt DATETIME DEFAULT GETDATE(),
    CONSTRAINT FK_UserStats_Users FOREIGN KEY (Username)
        REFERENCES dbo.users(Username)
        ON UPDATE CASCADE ON DELETE CASCADE
);
"

echo "▶ Starting WEBSnake…"
exec node server.js