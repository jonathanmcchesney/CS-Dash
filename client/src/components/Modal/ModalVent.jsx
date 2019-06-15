import React, { Component } from 'react';
import HVAC from "../../controllers/HVAC";

class ModalVent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            id: '',
            room: this.props.room,
            currentVent: '',
            newVent: ''
        }
    }

    updateOnClick(room_name, ventilation){
        let req = {
            room_name: room_name,
            ventilation: ventilation
        }
        HVAC.changeVentilation(req).then(result => {
            document.location.href='/hvac';
        })
    }

    updateVentilation(e) {
        this.setState({ newVent: e.target.value })
    }

    render() {
        let id = "vent" + this.props.room.replace(/\s/g,'');
        let target = "#" + id;
        let placeholder = "Change to: " + this.state.newVent;
        return (
            <div>
                <button className="btn btn-outline-danger btn-sm" data-toggle="modal" data-target={target}>
                    Change
                </button>
                <div className="modal" id={id} aria-labelledby="ventModal" aria-hidden="true">
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">
                                    Change ventilation of {this.props.room}.
                                </h5>
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                <p>{placeholder}</p>
                                <input type="text" className="form-control" placeholder="Enter ventilation" required="required" onChange={this.updateVentilation.bind(this)}/>
                                <input id="myRange" type="range" className="custom-range" min="0" max="100" onChange={this.updateVentilation.bind(this)}/>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-dismiss="modal">Cancel</button>
                                <button type="button" className="btn btn-primary" data-dismiss="modal" onClick={() => this.updateOnClick(this.props.room, this.state.newVent)}>Save changes</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}


export default ModalVent;