import React, { Component } from 'react';
import Rooms from '../../controllers/Room';
import Thermometer from 'react-thermometer-component'
import Bad from '../../assets/img/bad.png';
import Good from '../../assets/img/good.png';
import ErrorPage from "../Error/ErrorPage";
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';
import Weather from '../Weather/Weather';
import ModalTemp from '../Modal/ModalTemp';
import ModalVent from '../Modal/ModalVent';
import Gauge from 'react-svg-gauge';
import HVAC from "../../controllers/HVAC";
import HVACStatus from "./HVACStatus";
import './HVACPage.css';

class HVACPage extends Component {

    constructor(props) {
        super(props);
        let today = new Date(),
            date = today.getDate() + ' - ' + (today.getMonth() + 1) + ' - ' + (today.getFullYear());
        this.state = {
            title: this.props.title,
            contents: this.props.contents,
            rooms: null,
            errors: null,
            date: date,
            ventilation: null,
        }
    }

    componentDidMount() {
      this.getRooms();
    }

    getRooms() {
        Rooms.getRooms().then(result => {
            this.setState({
                rooms : result.rooms
            });
        });
    }

    tempCard(roomName, temperature, id) {
        let key = "tempKey"+id;
        let imgSrc;
        let imgStyle;
        let cardBorder;
        let cardHeader;
        if(temperature <= 30 && temperature > 10) {
            imgSrc = Good;
            imgStyle = {width: 45, height: 50};
            cardHeader = "card-header";
            cardBorder = "card text-center";
        } else {
            imgSrc = Bad;
            imgStyle = {width: 50, height: 50};
            cardHeader = "card-header bg-transparent border-danger";
            cardBorder = "card border-danger mb-3";
        }
        return (
            <div key={key}>
                <div className={cardBorder} style={{left: 30, margin: 10, width: 210}} key={roomName}>
                    <div className={cardHeader}> {roomName} </div>
                    <div className="card-body">
                        <div className="card-text">
                            <div style={{float: 'left'}}>
                                <Thermometer
                                    theme="dark"
                                    value={temperature}
                                    max="50"
                                    format="°C"
                                    height="150"
                                />
                            </div>
                        </div>
                        <div style={{float:'left'}}>
                            <div style={{marginBottom: 40}}>
                                <img src={imgSrc} style={imgStyle}/>
                            </div>
                            <ModalTemp room={roomName} currentTemp={temperature} id={id}/>
                        </div>
                        <a href={"/room/"+id} className="btn btn-danger" style={{marginTop: 10}}>More Room Details</a>
                    </div>
                </div>
            </div>
        );
    }

    renderTemp() {
        let thermo = [];
        this.state.rooms.map(room => {
            thermo.push( this.tempCard(room.room_name, room.temperature, room.id) );
        });
        return thermo;
    }

    ventCard(roomName, ventilation, id) {
        let key = "ventKey"+id;
        return (
            <div key={key}>
                {
                    (ventilation > 30) ?
                        <div className="card text-center" style={{left: 30, margin: 10, width: 420}} key={roomName}>
                            <div className="card-header"> {roomName} </div>
                            <div className="card-body">
                                <div className="card-text">
                                    <div style={{float: 'left'}}>
                                        <Gauge
                                            label="Litres/sec"
                                            color="#35dc45"
                                            value={ventilation}
                                            min="0"
                                            max="100"
                                            height="140"
                                            width="200"
                                        />
                                    </div>
                                    <div style={{float:'left'}}>
                                        <div style={{marginTop: 20, marginBottom: 5, marginLeft: 50}}>
                                            <img src={Good} style={{width: 45, height: 50}}/>
                                        </div>
                                        <div className="vent-modal-extra-margin">
                                            <ModalVent room={roomName} currentVent={ventilation} id={id}/>
                                        </div>
                                    </div>
                                </div>
                                <a href={"/room/"+id} className="btn btn-danger" style={{marginTop: 10}}>More Room Details</a>
                            </div>
                        </div> :
                        <div className="card border-danger mb-3" style={{left: 30, margin: 10, width: 420}} key={roomName}>
                            <div className="card-header bg-transparent border-danger"> {roomName} </div>
                            <div className="card-body">
                                <div className="card-text">
                                    <div style={{float: 'left'}}>
                                        <Gauge
                                            label="Litres/sec"
                                            color="#dc3545"
                                            value={ventilation}
                                            min="0"
                                            max="100"
                                            height="140"
                                            width="200"
                                        />
                                    </div>
                                    <div style={{float:'left'}}>
                                        <div style={{marginTop: 20, marginBottom: 5, marginLeft: 50}}>
                                            <img src={Bad} style={{width: 50, height: 50}}/>
                                        </div>
                                        <div className="vent-modal">
                                            <ModalVent room={roomName} currentVent={ventilation} id={id}/>
                                        </div>
                                    </div>
                                </div>
                                <a href="/room" className="btn btn-danger" style={{marginTop: 10}}>More Room Details</a>
                            </div>
                        </div>
                }
            </div>
        );
    }

    renderVent() {
        let vent = [];
        this.state.rooms.map(room => {
            vent.push( this.ventCard(room.room_name, room.ventilation, room.id) );
        });
        return vent;
    }

    lightCard(room) {
        let lightbulbStyles = (room.lighting === 0) ? "lightbulb" : "lightbulb lightbulb-on"
        // ok if the lights are on and the room is occupied, or if the lights are off and the room is empty
        let ok = (room.lighting === 1 && room.occupancy > 0) || (room.lighting === 0 && room.occupancy === 0) ? true : false;
        let cardStyles = "card text-center light-card-container";
        let headerStyles = "card-header";
        let imgSrc = Good;
        let imgStyle = {width: 45, height: 50};

        if (!ok) {
            cardStyles += " border-danger mb-3";
            headerStyles += " bg-transparent border-danger";
            imgSrc = Bad;
            imgStyle = {width: 50, height: 50};
        }

        return (
            <div className={cardStyles} key={room.room_name}>
                <div className={headerStyles}>{room.room_name}</div>
                <div className="card-body">
                    <div className="card-text">
                        <span className={lightbulbStyles}/>
                    </div>
                    <div>
                        <div>
                            <img src={imgSrc} style={imgStyle}/>
                        </div>
                        <p>{(room.occupancy / room.capacity) * 100}% occupancy</p>
                        <div>
                            <button className="btn btn-outline-danger btn-sm"  onClick={() => {this.handleLightbulbClick(room)}}>
                                {(room.lighting === 0 )? "Turn on" : "Turn off"}
                            </button>
                        </div>
                    </div>
                    <a href={"/room/"+room.id} className="btn btn-danger" style={{marginTop: 10}}>More Room Details</a>
                </div>
            </div>
        );
    }

    renderLighting() {
        let lighting = [];
        this.state.rooms.map(room => {
            lighting.push(this.lightCard(room))
        });
        return lighting;
    }

    handleLightbulbClick(room) {
        let newValue = (room.lighting === 0) ? 1 : 0;
        let req = {
            lighting: newValue,
            room_name: room.room_name,
        }
        HVAC.changeLighting(req).then(result => {
            this.getRooms();
        })
    }

    render() {
        if (sessionStorage.getItem('status') === 'admin') {
            if (this.props.user !== 'guest' && this.state.rooms) {
                return (
                    <div>
                        <nav>
                            <div className="nav nav-tabs" id="nav-tab" role="tablist">
                                <a className="nav-item nav-link active" id="hvac-overall-tab" data-toggle="tab"
                                   href="#nav-overall"
                                   role="tab" aria-controls="nav-home" aria-selected="true">Overall Status</a>
                                <a className="nav-item nav-link" id="hvac-temperature-tab" data-toggle="tab"
                                   href="#nav-temp"
                                   role="tab" aria-controls="nav-home" aria-selected="true">Temperature Control</a>
                                <a className="nav-item nav-link" id="hvac-lighting-tab" data-toggle="tab"
                                   href="#nav-light"
                                   role="tab" aria-controls="nav-profile" aria-selected="false">Lighting Control</a>
                                <a className="nav-item nav-link" id="hvac-ventilation-tab" data-toggle="tab"
                                   href="#nav-vent"
                                   role="tab" aria-controls="nav-home" aria-selected="false">Ventilation Control</a>
                            </div>
                        </nav>

                        <div className="tab-content" id="nav-tabContent">
                            <div className="tab-pane fade show active" id="nav-overall" role="tabpanel"
                                 aria-labelledby="hvac-overall-tab">
                                <div className="row ticky-boyo" style={{display: 'flex', alignItems: 'flex-start'}}>
                                    <HVACStatus rooms={this.state.rooms}/>
                                </div>
                            </div>
                            <div className="tab-pane fade" id="nav-temp" role="tabpanel"
                                 aria-labelledby="hvac-temperature-tab">
                                <div style={{float: 'left', margin: 20}}><Weather/></div>
                                <div className="row" style={{display: 'flex', alignItems: 'flex-start'}}>
                                    {this.renderTemp()}
                                </div>
                            </div>
                            <div className="tab-pane fade" id="nav-light" role="tabpanel"
                                 aria-labelledby="hvac-lighting-tab">
                                 <div className="row" style={{display: 'flex', alignItems: 'flex-start'}}>
                                 {this.renderLighting()}
                                </div>
                            </div>
                            <div className="tab-pane fade" id="nav-vent" role="tabpanel"
                                 aria-labelledby="hvac-ventilation-tab">
                                <div className="row" style={{display: 'flex', alignItems: 'flex-start'}}>
                                    {this.renderVent()}
                                </div>
                            </div>
                        </div>
                    </div>
                )
            } else {
                return <div><LoadingSpinner/></div>
            }
        } else {
            let username = sessionStorage.getItem('user')
            username = username.charAt(0).toUpperCase() + username.slice(1)
            return (
                <ErrorPage errorCode="ERROR 403: " contents = {username}/>
            )
        }
    }
}

export default HVACPage;
