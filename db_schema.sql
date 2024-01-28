
-- This makes sure that foreign_key constraints are observed and that errors will be thrown for violations
PRAGMA foreign_keys=ON;

BEGIN TRANSACTION;

-- Create your tables with SQL commands here (watch out for slight syntactical differences with SQLite vs MySQL)

CREATE TABLE IF NOT EXISTS customers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL,
    password TEXT NOT NULL,
    created_at NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS agents (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL,
    password TEXT NOT NULL,
    created_at NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS callbacks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    -- topic TEXT NOT NULL, //temporarily disabled during development
    customer_id INTEGER NOT NULL,
    created_at NOT NULL DEFAULT CURRENT_TIMESTAMP,
    call_from TIMESTAMP NOT NULL,
    -- call_to TIMESTAMP NOT NULL, //temporarily disabled during development
    FOREIGN KEY(customer_id) REFERENCES customers(id)
);

CREATE TABLE IF NOT EXISTS active_calls (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    customer_id INTEGER NOT NULL,
    agent_id INTEGER NOT NULL,
    callback_id INTEGER default -1, -- not every outbound call is due to a callback 
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    validation_token INTEGER NOT NULL,
    is_validated BOOLEAN NOT NULL DEFAULT 0, 
    validated_at TIMESTAMP,
    FOREIGN KEY(customer_id) REFERENCES customers(id),
    FOREIGN KEY(agent_id) REFERENCES agents(id)
    -- FOREIGN KEY(callback_id) REFERENCES callbacks(id)
);

CREATE TABLE IF NOT EXISTS fraud_reports (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    customer_id INTEGER NOT NULL,
    fraud_time TEXT NOT NULL,
    fraud_tel TEXT NOT NULL,
    fraud_description TEXT NOT NULL,
    created_at NOT NULL DEFAULT CURRENT_TIMESTAMP,    
    FOREIGN KEY(customer_id) REFERENCES customers(id)
);

INSERT INTO customers ('username', 'password') VALUES ('Dave', '123456');
INSERT INTO customers ('username', 'password') VALUES ('Karthik', '123456');
INSERT INTO customers ('username', 'password') VALUES ('John Doe', '123456');
INSERT INTO agents ('username', 'password') VALUES ('Shahbaz', '123456');
INSERT INTO agents ('username', 'password') VALUES ('Nkoyo', '123456');
INSERT INTO agents ('username', 'password') VALUES ('Jane Doe', '123456');

COMMIT;

