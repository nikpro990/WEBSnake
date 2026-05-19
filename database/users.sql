USE snake_data;
go

CREATE TABLE snake_data.dbo.users (
    Username NVARCHAR(50) NOT NULL PRIMARY KEY,
    CreatedAt DATETIME DEFAULT GETDATE(),   
    Password NVARCHAR(255) NOT NULL
);
