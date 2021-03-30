const db = require('../../config/db');
exports.getEvent = async function(id) {
    const conn = await db.getPool().getConnection();
    const query = 'select * from event where id = ?';
    const [result] = await conn.query(query, [id]);
    conn.release();
    return result;
}

exports.getAttendees = async function(id) {
    const conn = await db.getPool().getConnection();
    const query = 'select user_id attendeeId, name status, first_name firstName, last_name lastName, date_of_interest dateOfInterest from event_attendees ea join attendance_status `as` on ea.attendance_status_id = `as`.id join user u on ea.user_id = u.id where event_id = ? and attendance_status_id = 1 order by date_of_interest';
    const [result] = await conn.query(query, [id]);
    conn.release();
    return result;
}

exports.getAttendeesAll = async function(id) {
    const conn = await db.getPool().getConnection();
    const query = 'select user_id attendeeId, name status, first_name firstName, last_name lastName, date_of_interest dateOfInterest from event_attendees ea join attendance_status `as` on ea.attendance_status_id = `as`.id join user u on ea.user_id = u.id where event_id = ? order by date_of_interest';
    const [result] = await conn.query(query, [id]);
    conn.release();
    return result;
}

exports.getAttendeesSelf = async function(id, user) {
    const conn = await db.getPool().getConnection();
    const query = 'select user_id attendeeId, name status, first_name firstName, last_name lastName, date_of_interest dateOfInterest from event_attendees ea join attendance_status `as` on ea.attendance_status_id = `as`.id join user u on ea.user_id = u.id where event_id = ? and (attendance_status_id = 1 or u.id = ?) order by date_of_interest';
    const [result] = await conn.query(query, [id, user]);
    conn.release();
    return result;
}

exports.getAttendee = async function(eventId, userId) {
    const conn = await db.getPool().getConnection();
    const query = 'select user_id attendeeId, name status, first_name firstName, last_name lastName, date_of_interest dateOfInterest from event_attendees ea join attendance_status `as` on ea.attendance_status_id = `as`.id join user u on ea.user_id = u.id where event_id = ? and user_id = ? order by date_of_interest';
    const [result] = await conn.query(query, [eventId, userId]);
    conn.release();
    return result;
}

exports.addAttendee = async function(eventId, userId) {
    const conn = await db.getPool().getConnection();
    const query = 'insert into event_attendees (event_id, user_id, attendance_status_id) values (?, ?, 2)';
    await conn.query(query, [eventId, userId]);
}