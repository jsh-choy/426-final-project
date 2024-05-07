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

         db.run('CREATE TABLE IF NOT EXISTS events (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL, completed BOOLEAN NOT NULL DEFAULT 0, user_id INTEGER NOT NULL, FOREIGN KEY(user_id) REFERENCES users(user_id))', (err) => {
             if (err) {
                 console.error('Error creating events table: ' + err.message);
             } else {
                 console.log('Events table created');
             }
         });

         db.run('CREATE TABLE IF NOT EXISTS quotes (id INTEGER PRIMARY KEY AUTOINCREMENT, quote TEXT NOT NULL, user_id INTEGER NOT NULL, FOREIGN KEY(user_id) REFERENCES users(user_id))', (err) => {
             if (err) {
                 console.error('Error creating quotes table: ' + err.message);
             } else {
                 console.log('Quotes table created');
             }
         });
     }
 });

 export { db };
