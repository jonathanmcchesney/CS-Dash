const HVAC = {

    async changeTemperature(req, res) {
        let temperature = req.temperature;
        let room_name = req.room_name;
        try {
            let api = `/changeTemp`;
            const response = await fetch(api, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                method: "post",
                body: JSON.stringify({
                    temperature: temperature,
                    room_name: room_name,
                })
            });
            return {'message': 'Temperature changed successfully!'};
        } catch (err) {
            return {'message': err};
        }
    },

    async changeVentilation(req, res) {
        let ventilation = req.ventilation;
        let room_name = req.room_name;
        try {
            let api = `/changeVent`;
            const response = await fetch(api, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                method: "post",
                body: JSON.stringify({
                    ventilation: ventilation,
                    room_name: room_name,
                })
            });
            return {'message': 'Ventilation changed successfully!'};
        } catch (err) {
            return {'message': err};
        }
    },

    async changeLighting(req, res) {
        let lighting = req.lighting;
        let room_name = req.room_name;
        try {
            let api = `/changeLighting`;
            const response = await fetch(api, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                method: 'post',
                body: JSON.stringify({
                    lighting: lighting,
                    room_name: room_name
                })
            });
            return {'message': 'Lighting changed successfully!'};
        } catch (err) {
            return {'message': err};
        }
    }
}
export default HVAC;