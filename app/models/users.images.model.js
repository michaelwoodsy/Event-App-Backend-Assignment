const db = require('../../config/db');

exports.getUser = async function(id) {
    const conn = await db.getPool().getConnection();
    const query = 'select * from user where id = ?';
    const [result] = await conn.query( query, [id] );
    conn.release();
    return result;
};

exports.set = async function(id, image_filename) {
    const conn = await db.getPool().getConnection();
    const query = 'update user set image_filename = ? where id = ?';
    const [result] = await conn.query(query, [image_filename, id]);
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