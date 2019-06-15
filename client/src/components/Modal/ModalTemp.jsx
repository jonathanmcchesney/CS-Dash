import React, { Component } from 'react';
import HVAC from "../../controllers/HVAC";

class ModalTemp extends Component {

    constructor(props) {
        super(props);
        this.state = {
            id: '',
            room: this.props.room,
            currentTemp: '',
            newTemp: this.props.currentTemp
        }
    }

    updateOnClick(room_name, temperature){
        let req = {
            room_name: room_name,
            temperature: temperature
        }
        HVAC.changeTemperature(req).then(result => {
            document.location.href='/hvac';
        })
    }

    updateTemperature(e) {
        this.setState({ newTemp: e.target.value })
    }

    render() {
        let id = "temp" + this.props.room.replace(/\s/g,'');
        let target = "#" + id;
        let placeholder = "Change to: " + this.state.newTemp + "℃";
        return (
            <div>
                <button className="btn btn-outline-danger btn-sm" data-toggle="modal" data-target={target} onClick={() => this.setState({newTemp: this.props.currentTemp})}>
                    Change
                </button>
                <div className="modal" id={id} aria-labelledby="tempModal" aria-hidden="true">
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">
                                    Change temperature of {this.props.room}.
                                </h5>
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                <h4 style={{textAlign: 'center'}}>{placeholder}</h4>
                                <input style={{marginTop: 10, marginBottom: 10}}type="text" className="form-control" placeholder="Enter temperature or use slider below" required="required" onChange={this.updateTemperature.bind(this)}/>
                                <input id="myRange" type="range" className="custom-range" min="0" max="50" defaultValue={this.props.currentTemp} onChange={this.updateTemperature.bind(this)}/>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-dismiss="modal">Cancel</button>
                                <button type="button" className="btn btn-primary" data-dismiss="modal" onClick={() => this.updateOnClick(this.props.room, this.state.newTemp)}>Save changes</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}


export default ModalTemp;