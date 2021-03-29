const db = require('../../config/db');

exports.getUser = async function(id) {
    const conn = await db.getPool().getConnection();
    const query = 'select * from user where id = ?';
    const [result] = await conn.query( query, [id] );
    conn.release();
    return result;
};

exports.set = async function() {
    const conn = await db.getPool().getConnection();
    const query = 'insert into user';
    const [result] = await conn.query(query);
    conn.release();
    return result;
};

exports.delete = async function() {
    const conn = await db.getPool().getConnection();
    const query = 'insert into user';
    const [result] = await conn.query(query);
    conn.release();
    return result;
};