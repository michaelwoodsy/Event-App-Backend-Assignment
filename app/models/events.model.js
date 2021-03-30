const db = require('../../config/db');
exports.getEvents = async function() {
    const conn = await db.getPool().getConnection();
    const query = 'select ec.event_id eventId, title, GROUP_CONCAT(distinct category_id) categories, first_name organizerFirstName, last_name organizerLastName, count(distinct ea.user_id) numAcceptedAttendees, capacity from event join event_category ec on event.id = ec.event_id join user on event.organizer_id = user.id join event_attendees ea on event.id = ea.event_id join attendance_status `as` where ea.attendance_status_id = 1 group by ec.event_id'
    const [result] = await conn.query(query);
    for (let i = 0; i < result.length; i++) {
        result[i].categories = result[i].categories.split(',').map(Number);
    }
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
        sortBy = "attendees";
    } else if (sortBy === "ATTENDEES_DESC") {
        sortBy = "attendees desc";
    } else if (sortBy === "CAPACITY_ASC") {
        sortBy = "capacity";
    } else if (sortBy === "CAPACITY_DESC") {
        sortBy = "capacity";
    }
    return sortBy
}