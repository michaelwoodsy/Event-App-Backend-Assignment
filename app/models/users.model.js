const db = require('../../config/db');

exports.register = async function(firstName, lastName, email, password) {
    const conn = await db.getPool().getConnection();
    const query = 'insert into user (first_name, last_name, email, password) values (?)';
    const [result] = await conn.query(query, [[firstName, lastName, email, password]]);
    conn.release();
    return result;
};

exports.getEmail = async function(email) {
    const conn = await db.getPool().getConnection();
    const query = 'select * from user where email = ?';
    const [result] = await conn.query( query, [email] );
    conn.release();
    return result;
};