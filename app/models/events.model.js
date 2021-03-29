const db = require('../../config/db');
exports.read = async function( ) {
    console.log( 'Request to view all events from the database...' );
    const conn = await db.getPool().getConnection();
    const query = 'select * from event';
    const [ rows ] = await conn.query( query );
    conn.release();
    return rows;
};