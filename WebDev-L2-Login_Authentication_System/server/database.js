const path = require('path');
const sqlite3 = require('sqlite3').verbose();

const dbPath = path.join(__dirname, '..', 'database', 'users.db');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error connecting to SQLite database:', err.message);
  } else {
    console.log('Connected to SQLite database at:', dbPath);
  }
});

// Initialize database schema
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `, (err) => {
    if (err) {
      console.error('Failed to create users table:', err.message);
    } else {
      console.log('Users table verified/created successfully.');
    }
  });
});

// Helper functions using Promises
const findUserByUsernameOrEmail = (identifier) => {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT * FROM users 
      WHERE LOWER(username) = LOWER(?) OR LOWER(email) = LOWER(?)
      LIMIT 1
    `;
    db.get(query, [identifier, identifier], (err, row) => {
      if (err) return reject(err);
      resolve(row);
    });
  });
};

const findUserById = (id) => {
  return new Promise((resolve, reject) => {
    const query = `SELECT id, username, email, created_at FROM users WHERE id = ?`;
    db.get(query, [id], (err, row) => {
      if (err) return reject(err);
      resolve(row);
    });
  });
};

const createUser = (username, email, passwordHash) => {
  return new Promise((resolve, reject) => {
    const query = `
      INSERT INTO users (username, email, password_hash)
      VALUES (?, ?, ?)
    `;
    db.run(query, [username, email, passwordHash], function (err) {
      if (err) return reject(err);
      resolve({ id: this.lastID, username, email });
    });
  });
};

module.exports = {
  db,
  findUserByUsernameOrEmail,
  findUserById,
  createUser
};
