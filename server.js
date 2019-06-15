import express from 'express'
import dotenv from 'dotenv';
import 'babel-polyfill';
import User from './client/src/controllers/Users';
import Authenticate from './client/src/tpi/Authenticate';
const path = require('path');
const bodyParser = require('body-parser');
const database = require('./queries');
const fetch = require('isomorphic-fetch');
const slackconfig = require('./slack');
const app = express();
const port = process.env.PORT || 8080;

dotenv.config();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// API calls
app.post('/api/v1/users', User.create);
app.post('/api/v1/users/login',User.login);
app.delete('/api/v1/users/me', Authenticate.verifyToken, User.delete);

app.get('/api/hello', (req, res) => {
    res.send({ express: 'Hello From Express' });
});

app.post('/api/world', (req, res) => {
    console.log(req.body);
    res.send(
        `I received your POST request. This is what you sent me: ${req.body.post}`,
    );
});

app.get('/loginQ/:email', database.loginQ);

app.get('/loginQ/:email', database.loginQ);
app.get('/verifyUser/:email/:status', database.verifyUser);
app.get('/getStatsBetweenDates/:startDate/:endDate', database.getStatsBetweenDates);
app.get('/getYear4Timetable/', database.getYear4Timetable);
app.post('/authQ', database.authQ);
app.get('/roomInfo/:id', database.roomInfo);
app.get('/roomNames', database.roomNames);
app.get('/getRooms/', database.getRooms);
app.get('/getBookings', database.getBookings);
app.get('/getAdminData', database.getAdminData);
app.post('/makeBooking', database.makeBooking);
app.post('/cancelBooking', database.cancelBooking);
app.post('/updatePass', database.updatePass);
app.get('/userLocation/:email', database.userLocation);
app.post('/updateUserLocation', database.updateUserLocation);
app.post('/updateAdmin', database.updateAdmin);
app.post('/updateNotifications', database.updateNotifications);
app.post('/updateProfile', database.updateProfile);
app.post('/changeTemp', database.changeTemperature);
app.post('/changeVent', database.changeVentilation);
app.post('/changeLighting', database.changeLighting);

app.get('/', (request, response) => {
    response.json({ info: 'Welcome to CS-Dash, a React.js, Node.js and express application' })
})

var jsonParser = bodyParser.json();

app.post('/api/slack', jsonParser, (req, res) => {
    fetch(slackconfig.WEBHOOK_URL, {
        method: 'POST',
        body: JSON.stringify(req.body)
    })
        .then(response => {
            return res.status(response.status).send({
                status: response.status,
                statusText: response.statusText
            });
        });
});

if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, 'client/build')));

    app.get('*', function(req, res) {
        res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
    });
}

app.listen(port, () => console.log(`Listening on port ${port}`));