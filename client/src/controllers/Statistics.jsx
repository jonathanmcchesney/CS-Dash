const Statistics = {
    async getStatsBetweenDates(req, res) {
        let startDate = req.startDate;
        let endDate = req.endDate;
        try {
            let api = `/getStatsBetweenDates/`+startDate+`/`+endDate;
            const response = await fetch(api);
            const {rows} = await response.json();
            if (!rows[0]) {
                return {'message': 'There are no statistics between this date range!'};
            }
            return {
                'message': 'statistics retrieved successfully!',
                'stats': rows,
            };
        } catch (err) {
            return (err);
        }
    }
}
export default Statistics;