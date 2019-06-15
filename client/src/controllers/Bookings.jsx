const Bookings = {
    async getBookings(req, res) {
        try {
            let api = `/getBookings`;
            const response = await fetch(api);
            const {rows} = await response.json();

            if (!rows[0]) {
                return {'message': 'Error 404: no room bookings found!'};
            }

            return {
                "bookings": rows
            }
        } catch (err) {
            return(err);
        }
    },
    async makeBooking(req, res) {
        let day = req.day;
        let time = req.time;
        let booked_by = req.booked_by;
        try {
            let api = `/makeBooking`;
            const response = await fetch(api, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                method: "post",
                body: JSON.stringify({
                    day: day,
                    time: time,
                    booked_by: booked_by
                })
            });
            return {'message': 'Room booked successfully!'};
        } catch (err) {
            return {'message': err};
        }
    },
    async cancelBooking(req, res) {
        let day = req.day;
        let time = req.time;
        try {
            let api = `/cancelBooking`;
            const response = await fetch(api, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                method: "post",
                body: JSON.stringify({
                    day: day,
                    time: time
                })
            });
            return {'message': 'Booking cancelled successfully!'};
        } catch (err) {
            return {'message': err};
        }
    }
}
export default Bookings;