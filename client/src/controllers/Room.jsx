const Rooms = {

    async getRooms(req, res) {
        try {
            let api = '/getRooms/';
            const res = await fetch(api);
            const {rows} = await res.json();

            if (!rows[0]) {
                return {'message': 'Error 404: Room not found!'};
            }

            rows.sort((id1, id2)=>{return id1.id - id2.id});

            return {
                rooms: rows
            };
        } catch (err) {
            return (err)
        }
    }
}

export default Rooms;