const db = require('../../config/db');
exports.getEvents = async function(sortBy, q, organizerId) {
    const conn = await db.getPool().getConnection();
    const query = 'select ec.event_id eventId, title, GROUP_CONCAT(distinct category_id) categories, first_name organizerFirstName, last_name organizerLastName, count(distinct case when (event.id = ea.event_id and ea.attendance_status_id = 1) then user_id end) numAcceptedAttendees, capacity from event join event_category ec on event.id = ec.event_id join user on event.organizer_id = user.id join event_attendees ea where (title like ? or description like ?) and event.organizer_id like ? group by event.id order by ' + sortBy;
    const [result] = await conn.query(query, [q, q, organizerId]);
    for (let i = 0; i < result.length; i++) {
        result[i].categories = result[i].categories.split(',').map(Number);
    }
    conn.release();
    return result;
};

exports.getEventsOrganizer = async function(sortBy, q, organizerId) {
    const conn = await db.getPool().getConnection();
    const query = 'select ec.event_id eventId, title, GROUP_CONCAT(distinct category_id) categories, first_name organizerFirstName, last_name organizerLastName, count(distinct case when (event.id = ea.event_id and ea.attendance_status_id = 1) then user_id end) numAcceptedAttendees, capacity from event join event_category ec on event.id = ec.event_id join user on event.organizer_id = user.id join event_attendees ea where (title like ? or description like ?) and event.organizer_id = ? group by event.id order by ' + sortBy;
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
    const query = 'select ec.event_id eventId, title, GROUP_CONCAT(distinct category_id) categories, first_name organizerFirstName, last_name organizerLastName, count(distinct case when (event.id = ea.event_id and ea.attendance_status_id = 1) then user_id end) numAcceptedAttendees, capacity, description, organizer_id, date, is_online, url, venue, requires_attendance_control, fee from event join event_category ec on event.id = ec.event_id join user on event.organizer_id = user.id join event_attendees ea where event.id = ? group by event.id';
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
    conn.release();
}

exports.deleteEventAttendees = async function(id) {
    const conn = await db.getPool().getConnection();
    const query = 'delete from event_attendees where event_id = ?';
    await conn.query(query, [id]);
    conn.release();
}

exports.deleteEvent = async function(id) {
    const conn = await db.getPool().getConnection();
    const query = 'delete from event where id = ?';
    await conn.query(query, [id]);
    conn.release();
}

exports.checkEvent = async function(title, date, userId) {
    const conn = await db.getPool().getConnection();
    const query = 'select * from event where title = ? and date = ? and organizer_id = ?';
    const [result] = await conn.query( query, [title, date, userId] );
    conn.release();
    return result;
};

exports.setTitle = async function(id, title) {
    const conn = await db.getPool().getConnection();
    const query = 'update event set title = ? where id = ?';
    await conn.query(query, [title, id]);
    conn.release();
};

exports.setDescription = async function(id, description) {
    const conn = await db.getPool().getConnection();
    const query = 'update event set description = ? where id = ?';
    await conn.query(query, [description, id]);
    conn.release();
};

exports.setDate = async function(id, date) {
    const conn = await db.getPool().getConnection();
    const query = 'update event set date = ? where id = ?';
    await conn.query(query, [date, id]);
    conn.release();
};

exports.setOnline = async function(id, isOnline) {
    const conn = await db.getPool().getConnection();
    const query = 'update event set is_online = ? where id = ?';
    await conn.query(query, [isOnline, id]);
    conn.release();
};

exports.setUrl = async function(id, url) {
    const conn = await db.getPool().getConnection();
    const query = 'update event set url = ? where id = ?';
    await conn.query(query, [url, id]);
    conn.release();
};

exports.setVenue = async function(id, venue) {
    const conn = await db.getPool().getConnection();
    const query = 'update event set venue = ? where id = ?';
    await conn.query(query, [venue, id]);
    conn.release();
};

exports.setCapacity = async function(id, capacity) {
    const conn = await db.getPool().getConnection();
    const query = 'update event set capacity = ? where id = ?';
    await conn.query(query, [capacity, id]);
    conn.release();
};

exports.setControl = async function(id, requiresAttendanceControl) {
    const conn = await db.getPool().getConnection();
    const query = 'update event set requires_attendance_control = ? where id = ?';
    await conn.query(query, [requiresAttendanceControl, id]);
    conn.release();
};

exports.setFee = async function(id, fee) {
    const conn = await db.getPool().getConnection();
    const query = 'update event set fee = ? where id = ?';
    await conn.query(query, [fee, id]);
    conn.release();
};

exports.deleteCategories = async function(id) {
    const conn = await db.getPool().getConnection();
    const query = 'delete from event_category where event_id = ?';
    await conn.query(query, [id]);
    conn.release();
};

exports.insertCategories = async function(id, categoryId) {
    const conn = await db.getPool().getConnection();
    const query = 'insert into event_category (event_id, category_id) values (?, ?)';
    await conn.query(query, [id, categoryId]);
    conn.release();
};