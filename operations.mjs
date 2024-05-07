import { db } from './db.mjs';

export class User {
    #id;
    #user;
    #password;

    constructor(id, username, password) {
        this.#id = id;
        this.#user = username;
        this.#password = password;
    }


    static async create(data) {
        if (!data ||
            typeof data.username !== 'string' || data.username.trim() === '' ||
            typeof data.password !== 'string' || data.password.trim() === '') {
            return null;
        }

        try {
            const newUser = await new Promise((resolve, reject) => {
                db.run('INSERT INTO users (username, password) VALUES (?, ?)', [data.username.trim(), data.password.trim()], function (err) {
                    if (err) reject(err);
                    else resolve(this);
                });
            });
            return new User(newUser.lastID, data.username.trim(), data.password.trim());
        }

        catch (error) {
            console.error(error);
            return null;
        }
    }


    static async getByID(id) {
        if (typeof id !== 'number' || id < 0) {
            return null;
        }

        try {
            const row = await new Promise((resolve, reject) => {
                db.get('SELECT * FROM users WHERE user_id = ?', [id], (err, row) => {
                    if (err) reject(err);
                    else resolve(row);
                });
            });

            if (row) {
                return new User(row.id, row.username, row.password);
            }
            return null;
        }

        catch (error) {
            console.error("User not found");
            return null;
        }
    }


    static async currentUser(data) {
        if (!data
            || typeof data.username !== 'string' || typeof data.password !== 'string'
            || data.username.trim() === '' || data.password.trim() === ''
        ) {
            return null;
        }

        try {
            const row = await new Promise((resolve, reject) => {
                db.get('SELECT * FROM users WHERE username = ? AND password = ?', [data.username, data.password], (err, row) => {
                    if (err) reject(err);
                    else resolve(row);
                });
            });

            if (row) {
                return new User(row.user_id, row.username, row.password);
            }
            return null;
        }


        catch (error) {
            console.error(error);
            return null;
        }
    }


    json() {
        return {
            id: this.#id,
            username: this.#user,
            password: this.#password
        };
    }


    static async resetDb() {
        try {
            await new Promise((resolve, reject) => {
                db.serialize(() => {
                    db.run('DROP TABLE IF EXISTS users', function (err) {
                        if (err) reject(err);
                    });
                    db.run('CREATE TABLE users (username TEXT UNIQUE NOT NULL, password TEXT NOT NULL, user_id INTEGER PRIMARY KEY AUTOINCREMENT)', function (err) {
                        if (err) reject(err);
                        else resolve();
                    });
                });
            });
            return true;
        }


        catch (error) {
            console.error('Failed to reset database:', error);
            return false;
        }
    }
}



export class Event {
    #id;
    #title;
    #completed;
    #user_id;


    constructor(id, title, completed = false, user_id) {
        this.#id = id;
        this.#title = title;
        this.#completed = completed;
        this.#user_id = user_id;
    }


    static async create(data) {
        if (!data || typeof data.title !== 'string' || data.title.trim() === '' || typeof data.user_id !== 'number') {
            return null;
        }

        try {
            const stmt = await new Promise((resolve, reject) => {
                db.run('INSERT INTO events (title, completed, user_id) VALUES (?, ?, ?)', [data.title.trim(), data.completed || false, data.user_id], function (err) {
                    if (err) reject(err);
                    else resolve(this);
                });
            });
            return new Event(stmt.lastID, data.title.trim(), data.completed || false, data.user_id);
        }

        catch (error) {
            console.error('Failed to create a new event:', error);
            return null;
        }
    }


    static async findAll() {
        try {
            const rows = await new Promise((resolve, reject) => {
                db.all('SELECT * FROM events', [], (err, rows) => {
                    if (err) reject(err);
                    else resolve(rows);
                });
            });
            return rows.map(row => new Event(row.id, row.title, row.completed, row.user_id));
        }

        catch (error) {
            console.error('Failed to retrieve events:', error);
            return [];
        }
    }


    static async findById(id) {
        try {
            const row = await new Promise((resolve, reject) => {
                db.get('SELECT * FROM events WHERE id = ?', [id], (err, row) => {
                    if (err) reject(err);
                    else resolve(row);
                });
            });

            if (row) {
                return new Event(row.id, row.title, row.completed, row.user_id);
            }
            return null;
        }


        catch (error) {
            console.error('Failed to retrieve events:', error);
            return null;
        }
    }


    static async updateById(id, updatedData) {
        try {
            const setClause = Object.keys(updatedData).map(key => `${key} = ?`).join(', ');
            const values = [...Object.values(updatedData), id];

            await new Promise((resolve, reject) => {
                db.run(`UPDATE events SET ${setClause} WHERE id = ?`, values, function (err) {
                    if (err) reject(err);
                    else resolve(this);
                });
            });
            const updatedEvent = await Event.findById(id);
            return updatedEvent;
        }

        catch (error) {
            console.error('Failed to update event:', error);
            return null;
        }
    }


    static async deleteById(id) {
        try {
            await new Promise((resolve, reject) => {
                db.run('DELETE FROM events WHERE id = ?', [id], function (err) {
                    if (err) reject(err);
                    else resolve(this);
                });
            });
            return true;
        }

        catch (error) {
            console.error('Failed to delete event:', error);
            return false;
        }
    }


    json() {
        return {
            id: this.#id,
            title: this.#title,
            completed: this.#completed,
            user_id: this.#user_id
        };
    }


    static async resetDb() {
        try {
            await new Promise((resolve, reject) => {
                db.serialize(() => {
                    db.run('DROP TABLE IF EXISTS events', function (err) {
                        if (err) reject(err);
                    });
                    db.run('CREATE TABLE events (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL, completed BOOLEAN NOT NULL DEFAULT 0, user_id INTEGER NOT NULL, FOREIGN KEY(user_id) REFERENCES users(user_id))', function (err) {
                        if (err) reject(err);
                        else resolve();
                    });
                });
            });
            return true;
        }

        catch (error) {
            console.error('Failed to reset database:', error);
            return false;
        }
    }
}



export class Quote {
    #id;
    #quote;
    #user_id;


    constructor(id, quote, user_id) {
        this.#id = id;
        this.#quote = quote;
        this.#user_id = user_id;
    }


    static async create(data) {
        if (!data || typeof data.quote !== 'string' || data.quote.trim() === '' || typeof data.user_id !== 'number') {
            return null;
        }

        try {
            const stmt = await new Promise((resolve, reject) => {
                db.run('INSERT INTO quotes (quote, user_id) VALUES (?, ?)', [data.quote.trim(), data.user_id], function (err) {
                    if (err) reject(err);
                    else resolve(this);
                });
            });
            return new Quote(stmt.lastID, data.quote.trim(), data.user_id);
        }

        catch (error) {
            console.error('Failed to create a new quote:', error);
            return null;
        }
    }


    static async findAll() {
        try {
            const rows = await new Promise((resolve, reject) => {
                db.all('SELECT * FROM quotes', [], (err, rows) => {
                    if (err) reject(err);
                    else resolve(rows);
                });
            });
            return rows.map(row => new Quote(row.id, row.quote, row.user_id));
        }

        catch (error) {
            console.error('Failed to retrieve quotes:', error);
            return [];
        }
    }


    static async findById(id) {
        try {
            const row = await new Promise((resolve, reject) => {
                db.get('SELECT * FROM quotes WHERE id = ?', [id], (err, row) => {
                    if (err) reject(err);
                    else resolve(row);
                });
            });
            if (row) {
                return new Quote(row.id, row.quote, row.user_id);
            }
            return null;
        }

        catch (error) {
            console.error('Failed to retrieve quote:', error);
            return null;
        }
    }


    static async updateById(id, quote) {
        try {
            await new Promise((resolve, reject) => {
                db.run('UPDATE quotes SET quote = ? WHERE id = ?', [quote, id], function (err) {
                    if (err) reject(err);
                    else resolve(this);
                });
            });
            return new Quote(id, quote);
        }

        catch (error) {
            console.error('Failed to update quote:', error);
            return null;
        }
    }


    static async deleteById(id) {
        try {
            await new Promise((resolve, reject) => {
                db.run('DELETE FROM quotes WHERE id = ?', [id], function (err) {
                    if (err) reject(err);
                    else resolve(this);
                });
            });
            return true;
        }

        catch (error) {
            console.error('Failed to delete quote:', error);
            return false;
        }
    }


    json() {
        return {
            id: this.#id,
            quote: this.#quote,
            user_id: this.#user_id
        };
    }


    static async resetDb() {
        try {
            await new Promise((resolve, reject) => {
                db.serialize(() => {
                    db.run('DROP TABLE IF EXISTS quotes', function (err) {
                        if (err) {
                            reject(err);
                        } else {
                            console.log('Quotes table dropped');
                        }
                    });
                    db.run('CREATE TABLE quotes (id INTEGER PRIMARY KEY AUTOINCREMENT, quote TEXT NOT NULL, user_id INTEGER NOT NULL, FOREIGN KEY(user_id) REFERENCES users(user_id))', function (err) {
                        if (err) {
                            reject(err);
                        } else {
                            console.log('Quotes table created');
                            resolve();
                        }
                    });
                });
            });
            return true;
        }

        catch (error) {
            console.error('Failed to reset quotes database:', error);
            return false;
        }
    }
}