USE snake_data;

CREATE TABLE dbo.[Statistics] (
    Username NVARCHAR(50) NOT NULL PRIMARY KEY,
    AppleCollection INT NOT NULL DEFAULT 0,
    TimeCollection INT NOT NULL DEFAULT 0,
    StartCollection INT NOT NULL DEFAULT 0,
    LastUpdatedAt DATETIME DEFAULT GETDATE(),
    
    CONSTRAINT FK_UserStats_Users FOREIGN KEY (Username) 
        REFERENCES snake_data.dbo.users(Username) 
        ON UPDATE CASCADE 
        ON DELETE CASCADE
);
