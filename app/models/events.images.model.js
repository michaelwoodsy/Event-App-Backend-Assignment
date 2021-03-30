const db = require('../../config/db');

exports.getEvent = async function(id) {
    const conn = await db.getPool().getConnection();
    const query = 'select * from event where id = ?';
    const [result] = await conn.query( query, [id] );
    conn.release();
    return result;
};