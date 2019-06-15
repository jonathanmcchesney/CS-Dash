let connectionString = "";
const { Pool } = require('pg');
const pool = new Pool({
    connectionString: connectionString,
    ssl: true,
    host: 'localhost',
    port: 5432,
    user: 'x',
    password: 'x',
    database: 'x'
});

const createUserTable = (request, response) => {

    const text =
        `CREATE TABLE IF NOT EXISTS
          users(
            id UUID PRIMARY KEY,
            email VARCHAR(128) UNIQUE NOT NULL,
            password VARCHAR(128) NOT NULL,
            created_date TIMESTAMP,
            modified_date TIMESTAMP`;

    pool.query(text, (error, results) => {
        if (error) {
            throw error;
        }
        response.status(200).json(results);
    });
}

const deleteUserTable = (request, response) => {
    pool.query('DROP TABLE IF EXISTS users returning *', (error, results) => {
        if (error) {
            throw error;
        }
        response.status(200).json(results);
    });
}

const authQ = (request, response) => {
    const sql = `INSERT INTO
      users(id, email, password, created_date, modified_date, status, roundimage, imagecolour, imagefgcolour)
      VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9)
      returning *`;
    pool.query(sql, [request.body.id, request.body.email, request.body.password, request.body.created_date, request.body.modified_date, request.body.status, request.body.rounded, request.body.colour, request.body.fgcolour], (error, results) => {
    if (error) {
        throw error;
    }
    response.status(200).json(results);
    });
}


const loginQ = (request, response) => {
    pool.query('SELECT * FROM users WHERE email = $1', [request.params.email], (error, results) => {
        if (error) {
            throw error;
        }
        response.status(200).json(results);
    });
}

const verifyUser = (request, response) => {
    pool.query('SELECT * FROM users WHERE email = $1 AND status = $2', [request.params.email, request.params.status], (error, results) => {
        if (error) {
            throw error;
        }
        response.status(200).json(results);
    })
}

const updatePass = (request, response) => {
    pool.query('UPDATE users SET password = $1 WHERE email = $2 returning *', [request.body.password, request.body.email], (error, results) => {
        if (error) {
            throw error;
        }
        response.status(200).json(results);
    })
}
const updateAdmin = (request, response) => {
    pool.query('UPDATE users SET status = $1 WHERE email = $2 returning *', [request.body.status, request.body.email], (error, results) => {
        if (error) {
            throw error;
        }
        response.status(200).json(results);
    })
}

const updateProfile = (request, response) => {
    pool.query('UPDATE users SET imagefgcolour = $1, imagecolour = $2, roundimage = $3 WHERE email = $4 returning *', [request.body.fgColour, request.body.bgColour, request.body.rounded, request.body.email], (error, results) => {
        if (error) {
            throw error;
        }
        response.status(200).json(results);
    })
}

const getStatsBetweenDates = (request, response) => {
    pool.query(`SELECT * from stats WHERE date between $1 AND $2 ORDER BY date ASC`, [request.params.startDate, request.params.endDate], (error, results) => {
        if (error) {
            throw error;
        }
        response.status(200).json(results);
    });
}

const roomInfo = (request, response) => {
    pool.query('SELECT * FROM rooms WHERE id = $1', [request.params.id], (error, results) => {
        if (error) {
            throw error;
        }
        response.status(200).json(results);
    });
}

const roomNames = (request, response) => {
    pool.query('SELECT room_name FROM rooms ORDER BY id', (error, results) => {
        if (error) {
            throw error;
        }
        response.status(200).json(results);
    });
}

const getBookings = (request, response) => {
    pool.query(`SELECT * from bookings`, (error, results) => {
        if (error) {
            throw error;
        }
        response.status(200).json(results);
    });
}

const makeBooking = (request, response) => {
    pool.query(`INSERT INTO bookings(day, time, booked_by) VALUES($1, $2, $3)`, [request.body.day, request.body.time, request.body.booked_by], (error, results) => {
        if (error) {
            throw error;
        }
        response.status(200).json(results);
    });
}

const cancelBooking = (request, response) => {
    pool.query(`DELETE FROM bookings WHERE day = $1 AND time = $2;`, [request.body.day, request.body.time], (error, results) => {
        if (error) {
            throw error;
        }
        response.status(200).json(results);
    });
}

const getRooms = (request, response) => {
    pool.query('SELECT * FROM rooms', (error, results) => {
        if (error) {
            throw error;
        }
        response.status(200).json(results);
    });
}

const userLocation = (request, response) => {
    pool.query('SELECT * FROM users WHERE email = $1', [request.params.email], (error, results) => {
        if (error) {
            throw error;
        }
        response.status(200).json(results);
    });
}

const updateUserLocation = (request, response) => {
    pool.query('UPDATE users SET showlocation = $1 WHERE email = $2', [request.body.showlocation, request.body.email], (error, results) => {
        if (error) {
            throw error;
        }
        response.status(200).json(results);
    });
}

const getYear4Timetable = (request, response) => {
    pool.query(`SELECT * FROM year_4_timetable INNER JOIN classes ON year_4_timetable.module_code = classes.module_code AND year_4_timetable.session_type = classes.session_type`, (error, results) => {
        if (error) {
            throw error;
        }
        response.status(200).json(results);
    });
}

const updateNotifications = (request, response) => {
    pool.query(`UPDATE admin SET 
  success_alert = $1,
  warning_alert = $2,
  danger_alert = $3 
WHERE id = 1;`, [request.body.successAlert, request.body.warningAlert, request.body.dangerAlert], (error, results) => {
        if (error) {
            throw error;
        }
        response.status(200).json(results);
    });
}

const getAdminData = (request, response) => {
    pool.query(`Select * from admin where id = 1;`, (error, results) => {
        if (error) {
            throw error;
        }
        response.status(200).json(results);
    });
}

const changeTemperature = (request, response) => {
    pool.query('UPDATE rooms SET temperature = $1 WHERE room_name = $2', [request.body.temperature, request.body.room_name], (error, results) => {
        if (error) {
            throw error;
        }
        response.status(200).json(results);
    });
}

const changeVentilation = (request, response) => {
    pool.query('UPDATE rooms SET ventilation = $1 WHERE room_name = $2', [request.body.ventilation, request.body.room_name], (error, results) => {
        if (error) {
            throw error;
        }
        response.status(200).json(results);
    });
}

const changeLighting = (request, response) => {
    pool.query(`UPDATE rooms SET lighting = $1 WHERE room_name = $2`, [request.body.lighting, request.body.room_name], (error, results) => {
        if (error) {
            throw error;
        }
        response.status(200).json(results);
    });
}

module.exports = {
    createUserTable,
    deleteUserTable,
    loginQ,
    authQ,
    getStatsBetweenDates,
    getYear4Timetable,
    updatePass,
    updateAdmin,
    updateProfile,
    roomInfo,
    roomNames,
    getRooms,
    getBookings,
    makeBooking,
    verifyUser,
    userLocation,
    updateUserLocation,
    cancelBooking,
    updateNotifications,
    getAdminData,
    changeTemperature,
    changeVentilation,
    changeLighting
};

require('make-runnable');
