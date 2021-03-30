const db = require('../../config/db');
const crypto = require('crypto');
const bcrypt = require("bcrypt");

exports.register = async function(firstName, lastName, email, password) {
    const hash = await bcrypt.hash(password, 10);
    const conn = await db.getPool().getConnection();
    const query = 'insert into user (email, first_name, last_name, password) values (?, ?, ?, ?)';
    const [result] = await conn.query(query, [[firstName, lastName, email, hash]]);
    conn.release();
    return result;
};

exports.getEmail = async function(email) {
    const conn = await db.getPool().getConnection();
    const query = 'select * from user where email = ?';
    const [result] = await conn.query( query, [email]);
    conn.release();
    return result;
};

exports.setToken = async function(id) {
    const token = await crypto.randomBytes(32).toString('base64');
    const conn = await db.getPool().getConnection();
    const query = 'update user set auth_token = ? where id = ?';
    await conn.query(query, [token, id]);
    conn.release();
    return token;
};

exports.findToken = async function(token) {
    const conn = await db.getPool().getConnection();
    const query = 'select * from user where auth_token = ?';
    const [result] = await conn.query( query, [token]);
    conn.release();
    return result;

}

exports.logout = async function(id) {
    const conn = await db.getPool().getConnection();
    const query = 'update user set auth_token = null where id = ?';
    await conn.query(query, [id]);
    conn.release();
};

exports.getUser = async function(id) {
    const conn = await db.getPool().getConnection();
    const query = 'select * from user where id = ?';
    const [result] = await conn.query( query, [id] );
    conn.release();
    return result;
};

exports.setFirstName = async function(id, firstName) {
    const conn = await db.getPool().getConnection();
    const query = 'update user set first_name = ? where id = ?';
    const [result] = await conn.query(query, [firstName, id]);
    conn.release();
    return result;
};

exports.setLastName = async function(id, lastName) {
    const conn = await db.getPool().getConnection();
    const query = 'update user set last_name = ? where id = ?';
    await conn.query(query, [lastName, id]);
    conn.release();
};

exports.setEmail = async function(id, email) {
    const conn = await db.getPool().getConnection();
    const query = 'update user set email = ? where id = ?';
    await conn.query(query, [email, id]);
    conn.release();
};

exports.setPassword = async function(id, password) {
    const hash = await bcrypt.hash(password, 10);
    const conn = await db.getPool().getConnection();
    const query = 'update user set password = ? where id = ?';
    await conn.query(query, [hash, id]);
    conn.release();
};
