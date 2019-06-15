import React, { Component } from 'react';
import './App.css';
import Page from './components/Page/Page';
import Login from './components/Login/Login';
import NavBar from './components/NavBar/NavBar';
import { Switch, Route, Redirect } from 'react-router-dom';
import DashCard from './components/DashCard/DashCard';
import Table from './components/Table/Table';
import Map from './components/Map/Map';
import Stats from "./components/Stats/Stats";
import Settings from "./components/Settings/Settings";
import Weather from "./components/Weather/Weather";
import HVAC from "./components/HVAC/HVACPage";
import Faq from "./components/Faq/Faq";
import Notify from "./components/Notify/Notify";
import AdminDash from "./components/Dashboard/AdminDash";
import GuestDash from "./components/Dashboard/GuestDash";
import StudentDash from "./components/Dashboard/StudentDash";
import Room from "./components/Room/Room";
import Profile from "./components/Settings/Profile";

class App extends Component {

    state = {
        response: '',
        post: '',
        responseToPost: '',
        initUser: 'guest',
        initStatus: 'guest',
        initBgColour: '',
        initFgColour: '',
        initRounded: null,
        notifications: '1'
    };

    componentDidMount() {
        if (sessionStorage.getItem('user')==null)
            sessionStorage.setItem('user', this.state.initUser);
        if (sessionStorage.getItem('status')==null)
            sessionStorage.setItem('status', this.state.initStatus);
        if (sessionStorage.getItem('profileRounded')==null)
            sessionStorage.setItem('profileRounded', this.state.initRounded);
        if (sessionStorage.getItem('profileBgColour')==null)
            sessionStorage.setItem('profileBgColour', this.state.initBgColour);
        if (sessionStorage.getItem('profileFgColour')==null)
            sessionStorage.setItem('profileFgColour', this.state.initFgColour);
        if (sessionStorage.getItem('notifications')==null)
            sessionStorage.setItem('notifications', this.state.notifications);

    }

    renderDash() {
        switch (sessionStorage.getItem('status')) {
            case "admin" :
                return <AdminDash/>
                break;
            case "student" :
                return <StudentDash/>
                break;
            case "guest" :
                return <GuestDash/>
                break;
            default:
                return <GuestDash/>
        }
    }

    render() {
        return (
            <div>
                <NavBar user={sessionStorage.getItem('user')} status={sessionStorage.getItem('status')} bgColour={sessionStorage.getItem('profileBgColour')} fgColour={sessionStorage.getItem('profileFgColour')} rounded={sessionStorage.getItem('profileRounded')} notifications={sessionStorage.getItem('notifications')}/>
                <Switch>
                    {/*<Route exact path="/" render={() => <Page title="CS-Dash" contents={*/}
                        {/*<div className="rows" style={{display: 'flex', alignItems: 'flex-start'}}>*/}
                            {/*<Weather/>*/}
                            {/*<DashCard link="/timetable" text="View Timetable"/>*/}
                            {/*<DashCard link="/room" text="View Rooms"/>*/}
                            {/*<DashCard link="/booking" text="View Bookings"/>*/}
                            {/*<DashCard link="/map" text="View Maps"/>*/}
                            {/*<DashCard link="/stats" text="View Statistics"/>*/}
                            {/*<DashCard link="/hvac" text="HVAC Control"/>*/}
                        {/*</div>}/>}/>*/}
                    <Route exact path="/" render={() => <Page title="Home | CS-Dash" contents={this.renderDash()}/>}/>
                    <Route exact path="/settings" render={() => <Page title="Update Password | CS-Dash" contents={<Settings/>}/>}/>
                    <Route exact path="/stats" render={() => <Page title="Statistics | CS-Dash" contents={<Stats/>}/>}/>
                    <Route exact path="/login" render={() => <Page title="Login | CS-Dash" contents={<Login/>}/>}/>
                    <Route exact path="/room" render={() => <Page title="Rooms | CS-Dash" contents={<Room/>}/>}/>
                    <Route path="/room/:id" component={() => <Room/>}/>
                    <Route exact path="/timetable" render={() => <Page title="Timetable | CS-Dash" contents={<Table user={sessionStorage.getItem('user')} type='timetable'/>}/>}/>
                    <Route exact path ="/booking" render={() => <Page title="Room Booking | CS-Dash" contents={<Table user={sessionStorage.getItem('user')} type='booking'/>}/>}/>
                    <Route exact path="/hvac" render={() => <Page title="HVAC | CS-Dash" contents={<HVAC user={sessionStorage.getItem('user')}/>}/>}/>
                    <Route exact path="/faq" render={() => <Page title="FAQs | CS-Dash" contents={<Faq/>}/>}/>
                    <Route exact path="/map" render={() => <Page title="Maps | CS-Dash" contents={<Map/>}/>}/>
                    <Route exact path="/profile" render={() => <Page title="Profile Settings | CS-Dash" contents={<Profile user={sessionStorage.getItem('user')} bgColour={sessionStorage.getItem('profileBgColour')} fgColour={sessionStorage.getItem('profileFgColour')} rounded={sessionStorage.getItem('profileRounded')}/>}/>}/>
                    <Route exact path="/notifications" render={() => <Page title="CS-Dash" contents={<Notify/>}/>}/>
                    <Redirect to="/"/>
                </Switch>
            </div>
        );
    }
}
export default App;