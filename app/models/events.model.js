const db = require('../../config/db');
exports.getEvents = async function(sortBy, q, organizerId) {
    const conn = await db.getPool().getConnection();
    const query = 'select ec.event_id eventId, title, GROUP_CONCAT(distinct category_id) categories, first_name organizerFirstName, last_name organizerLastName, count(distinct ea.user_id) numAcceptedAttendees, capacity from event join event_category ec on event.id = ec.event_id join user on event.organizer_id = user.id join event_attendees ea on event.id = ea.event_id where ea.attendance_status_id = 1 and (title like ? or description like ?) and event.organizer_id like ? group by ec.event_id order by ' + sortBy;
    const [result] = await conn.query(query, [q, q, organizerId]);
    for (let i = 0; i < result.length; i++) {
        result[i].categories = result[i].categories.split(',').map(Number);
    }
    conn.release();
    return result;
};

exports.checkCategory = async function(categoryId) {
    const conn = await db.getPool().getConnection();
    const query = 'select * from category where id = ?';
    const [result] = await conn.query(query, [categoryId]);
    conn.release();
    return result;
};

exports.sortMapper = async function(sortBy) {
    if (sortBy === "ALPHABETICAL_ASC") {
        sortBy = "title";
    } else if (sortBy === "ALPHABETICAL_DESC") {
        sortBy = "title desc";
    } else if (sortBy === "DATE_ASC") {
        sortBy = "date";
    } else if (sortBy === "DATE_DESC") {
        sortBy = "date desc";
    } else if (sortBy === "ATTENDEES_ASC") {
        sortBy = "numAcceptedAttendees";
    } else if (sortBy === "ATTENDEES_DESC") {
        sortBy = "numAcceptedAttendees desc";
    } else if (sortBy === "CAPACITY_ASC") {
        sortBy = "capacity";
    } else if (sortBy === "CAPACITY_DESC") {
        sortBy = "capacity desc";
    }
    return sortBy;
}

exports.getId = async function() {
    const conn = await db.getPool().getConnection();
    const query = 'select count(*) minusID from event';
    const [result] = await conn.query(query);
    conn.release();
    return result;
}

exports.addEvent = async function(title, description, date, isOnline, url, venue, capacity, requiresAttendanceControl, fee, user) {
    const conn = await db.getPool().getConnection();
    const query = 'insert into event (title, description, date, is_online, url, venue, capacity, requires_attendance_control, fee, organizer_id) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
    const [result] = await conn.query(query, [title, description, date, isOnline, url, venue, capacity, requiresAttendanceControl, fee, user]);
    conn.release();
    return result;
}

exports.addEventCategory = async function(eventId, category) {
    const conn = await db.getPool().getConnection();
    const query = 'insert into event_category (event_id, category_id) values (?, ?)';
    const [result] = await conn.query(query, [eventId, category]);
    conn.release();
    return result;
}

exports.getEvent = async function(id) {
    const conn = await db.getPool().getConnection();
    const query = 'select ec.event_id eventId, title, GROUP_CONCAT(distinct category_id) categories, first_name organizerFirstName, last_name organizerLastName, count(distinct ea.user_id) numAcceptedAttendees, capacity, description, organizer_id, date, is_online, url, venue, requires_attendance_control, fee from event join event_category ec on event.id = ec.event_id join user on event.organizer_id = user.id join event_attendees ea on event.id = ea.event_id where ea.attendance_status_id = 1 and ea.event_id = ? group by ec.event_id';
    const [result] = await conn.query(query, [id]);
    for (let i = 0; i < result.length; i++) {
        result[i].categories = result[i].categories.split(',').map(Number);
    }
    conn.release();
    return result;
};

exports.getCategories = async function() {
    const conn = await db.getPool().getConnection();
    const query = 'select category.id categoryId, category.name from event_category natural join category order by categoryId';
    const [result] = await conn.query(query);
    conn.release();
    return result;
}

exports.deleteEventCategory = async function(id) {
    const conn = await db.getPool().getConnection();
    const query = 'delete from event_category where event_id = ?';
    await conn.query(query, [id]);

}

exports.deleteEventAttendees = async function(id) {
    const conn = await db.getPool().getConnection();
    const query = 'delete from event_attendees where event_id = ?';
    await conn.query(query, [id]);
}

exports.deleteEvent = async function(id) {
    const conn = await db.getPool().getConnection();
    const query = 'delete from event where id = ?';
    await conn.query(query, [id]);
}