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
    await conn.query(query, [image_filename, id]);
    conn.release();
};

exports.delete = async function(id) {
    const conn = await db.getPool().getConnection();
    const query = 'update user set image_filename = null where id = ?';
    await conn.query(query, [id]);
    conn.release();
};