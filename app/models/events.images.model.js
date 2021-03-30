const db = require('../../config/db');

exports.getEvent = async function(id) {
    const conn = await db.getPool().getConnection();
    const query = 'select * from event where id = ?';
    const [result] = await conn.query( query, [id] );
    conn.release();
    return result;
};

exports.set = async function(id, image_filename) {
    const conn = await db.getPool().getConnection();
    const query = 'update event set image_filename = ? where id = ?';
    await conn.query(query, [image_filename, id]);
    conn.release();
};

exports.delete = async function(id) {
    const conn = await db.getPool().getConnection();
    const query = 'update event set image_filename = null where id = ?';
    await conn.query(query, [id]);
    conn.release();
};