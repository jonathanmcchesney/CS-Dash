let email = null;
let showlocation = null;

const userLocation = {

    async getLocation(req, res) {
        email = req.email;

        try {
            let api = '/userLocation/' + email;
            const res = await fetch(api);
            const {rows} = await res.json();

            if (!rows[0]) {
                return {'message': 'Error 404: Location setting not found!'};
            }

            if(rows[0].showlocation === 1){
                return {
                    showlocation: true
                };
            } else {
                return {
                    showlocation: false
                };
            }
        } catch (err) {
            return (err)
        }
    },

    async updateLocation(req, res) {
        email = req.email;
        showlocation = req.showlocation;

        try {
            let api = '/updateUserLocation';
            await fetch(api, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                method: "post",
                body: JSON.stringify({
                    showlocation: showlocation,
                    email: email
                })
            });

            return {
                'showlocation': showlocation
            };
        } catch (err) {
            return (err)
        }
    }
};

export default userLocation