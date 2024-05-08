 import sqlite3 from 'sqlite3';

 const db = new sqlite3.Database('./operations.db', (err) => {
     if (err) {
         console.error('Error opening database ' + err.message);
     } else {
         console.log('The database has connected!');

         db.run('CREATE TABLE IF NOT EXISTS users (username TEXT UNIQUE NOT NULL, password TEXT NOT NULL, user_id INTEGER PRIMARY KEY AUTOINCREMENT)', (err) => {
             if (err) {
                 console.error('Error creating users table: ' + err.message);
             } else {
                 console.log('Users table created');
             }
         });

         db.run('CREATE TABLE IF NOT EXISTS events (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL, description TEXT, location TEXT, "date" TEXT, duration INTEGER, user_id INTEGER, FOREIGN KEY(user_id) REFERENCES users(id))', (err) => {
             if (err) {
                 console.error('Error creating events table: ' + err.message);
             } else {
                 console.log('Events table created');
             }
         });
     }
 });

 export { db };
