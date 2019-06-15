import React, { Component } from 'react';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner'
import Rooms from "../../controllers/Room";
import {withRouter} from 'react-router';


class Room extends Component {

    constructor(props) {
        super(props);
        this.state = {
            title: this.props.title,
            contents: this.props.contents,
            rooms: null,
            display: this.props.match.params.id ? (parseInt(this.props.match.params.id, 10)-1).toString(): this.props.display ? this.props.display : null
        }
    }

    componentDidMount() {
        Rooms.getRooms().then(result => {
            this.setState({
                rooms : result.rooms
            })
        })
    }

    updateOnClick(id) {
        this.setState({display: id})
    }

    roomDetails(id) {
        return (
            <div className="card border-success mb-3 shadow-lg p-3 mb-5 bg-white rounded" data-parent="display">
                <h5 className="card-header text-white bg-success mb-3">{this.state.rooms[id].floorname}</h5>
                <div className="card-body">
                    <h5 className="card-title">{this.state.rooms[id].room_name}</h5>
                    <ul className="list-group list-group-flush">
                        <li className="list-group-item">Location: {this.state.rooms[id].location}</li>
                        <li className="list-group-item">Capacity: {this.state.rooms[id].capacity} people</li>
                        <li className="list-group-item">Temperature: {this.state.rooms[id].temperature}°C</li>
                        <li className="list-group-item">Contents: {this.state.rooms[id].itinerary}</li>
                        <li className="list-group-item">Space available: {100 - ((this.state.rooms[id].occupancy / this.state.rooms[id].capacity) * 100)} %</li>
                    </ul>
                </div>
                <div className="card-footer text-center">
                    {
                        (this.state.rooms[id].room_name === 'Project Room - 037') ?
                            <button className="btn btn-danger" onClick={() => document.location.href="/booking"}>Book this room!</button>
                            : <span/>
                    }
                    </div>
            </div>
        )
    }

    createButton(roomName, id) {
        return (
            <div className="row">
                <button className="btn btn-success" type="button" style={{margin: 10}} onClick={() => this.updateOnClick(id)}>
                    {roomName}
                    </button>
            </div>
        )
    }

    renderMenu(item, floorName, num) {
        let target = "#" + item;
        return (
            <div>
                <li className="list-group-item d-flex justify-content-between align-items-center" type="button" data-toggle="collapse"
                    data-target={target} aria-expanded="true" aria-controls={item}>
                    {floorName}
                    <span className="badge badge-success badge-pill">{num}</span>
                </li>
                <div className="collapse" id={item}>
                    <div className="card card-body">
                        <div>
                            {item == "ground" &&
                            <div className="container">
                                {this.createButton(this.state.rooms[2].room_name, 2)}
                                {this.createButton(this.state.rooms[5].room_name, 5)}
                            </div>
                            }
                            {item == "first" &&
                            <div className="container" style={{float:'left'}}>
                                {this.createButton(this.state.rooms[6].room_name, 6)}
                            </div>
                            }
                            {item == "second" &&
                            <div className="container" style={{float:'left'}}>
                                {this.createButton(this.state.rooms[1].room_name, 1)}
                                {this.createButton(this.state.rooms[3].room_name, 3)}
                            </div>
                            }
                            {item == "third" &&
                            <div className="container" style={{float:'left'}}>
                                {this.createButton(this.state.rooms[0].room_name, 0)}
                                {this.createButton(this.state.rooms[4].room_name, 4)}
                            </div>
                            }
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    render() {
        if(this.state.rooms){
            return (
                <div id="container">
                    <div className="row col-md">
                        <div id="accordion" style={{marginLeft: 350, marginTop: 100, width: 400}}>
                            {this.renderMenu("ground", this.state.rooms[2].floorname, 2)}
                            {this.renderMenu("first", this.state.rooms[6].floorname, 1)}
                            {this.renderMenu("second", this.state.rooms[3].floorname, 2)}
                            {this.renderMenu("third", this.state.rooms[4].floorname, 2)}
                        </div>
                        <div id="display" style={{margin: 20, marginTop: 100, width: 800}}>
                            {
                                this.state.display == null ?
                                    <div><center>Please click a room to see details.</center></div> :
                                    <div>{this.roomDetails(this.state.display)}</div>
                            }
                        </div>
                    </div>
                </div>
            )
        } else {
            return <div><LoadingSpinner/></div>
            }
        }
    }
    export default withRouter(Room)
