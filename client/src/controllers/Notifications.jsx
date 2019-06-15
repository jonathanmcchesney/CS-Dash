const Notifications = {

    async getNotifications(req, res) {

        try {
            let api = '/getAdminData'
            const response = await fetch(api);
            const {rows} = await response.json();

            if (!rows[0]) {
                let userMsg = 'Admin data does not exist!'
                return {'message': userMsg};
            }

            return {
                'message': 'Admin data retrieved successfully!',
                'successAlert': rows[0].success_alert,
                'warningAlert': rows[0].warning_alert,
                'dangerAlert': rows[0].danger_alert
            };
        } catch (err) {
            return (err)
        }
    },

    async updateNotifications(req, res) {
        let notifications = {
          successAlert: req.successAlert,
          warningAlert: req.warningAlert,
          dangerAlert: req.dangerAlert,
        }

        try {
            let api = '/updateNotifications'
            await fetch(api, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                method: "post",
                body: JSON.stringify({
                    successAlert: notifications.successAlert,
                    warningAlert: notifications.warningAlert,
                    dangerAlert: notifications.dangerAlert
                })
            });
            return {'message': 'Notifications updated successfully!'};
        } catch (err) {
            return {'message': err}
        }
    }
}

export default Notifications;
