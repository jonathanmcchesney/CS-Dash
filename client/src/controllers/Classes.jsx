const Classes = {
    async getYear4Timetable(req, res) {
        try {
            let api  = `/getYear4Timetable/`;
            const response = await fetch(api);
            const {rows} = await response.json();

            if (!rows[0]) {
                return {'message': 'Error 404: timetable not found!'};
            }

            return {
                'timetable' : rows
            }
        } catch (err) {
            return(err);
        }
    }
}
export default Classes;