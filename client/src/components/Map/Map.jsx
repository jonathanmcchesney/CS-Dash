import React, { Component } from 'react';

import './Map.css'
import groundMap from "../../assets/img/groundMap.png"
import firstMap from "../../assets/img/firstMap.png"
import secondMap from "../../assets/img/secondMap.png"
import thirdMap from "../../assets/img/thirdMap.png"
import helperUtils from "../..//utils/HelperUtils"
import userLocation from "../../controllers/userLocation.jsx"
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";

class Map extends Component {

    constructor(props) {
        super(props);
        this.state = {
            title: this.props.title,
            contents: this.props.contents,
            location: 3,
            showlocation: false,
            user: helperUtils.toUpperCase(sessionStorage.getItem('user')),
            status: sessionStorage.getItem('status'),
            floorName: 'Ground Floor',
            mapID: 0,
            hasLoaded: false,
            email: sessionStorage.getItem('email'),
            mapDisplay: groundMap
        }
    }

    componentDidMount() {
        document.title = this.state.title;
        document.contents = this.state.contents;
        document.mapDisplay = this.state.mapDisplay;
        if (this.state.email != null){
            let req = {
                email: this.state.email
            };
            userLocation.getLocation(req).then(res => {
                this.setState({
                    showlocation: res.showlocation,
                    hasLoaded: true
                });
            });
        } else {
            this.setState({
                hasLoaded: true
            });
        }
    }

    displayMap(mapID) {
        if (mapID === 0){
            this.setState({
                mapDisplay: groundMap,
                floorName: 'Ground Floor',
                mapID: 0
            });
        }
        else if (mapID === 1){
            this.setState({
                mapDisplay: firstMap,
                floorName: '1st Floor',
                mapID: 1
            });
        }
        else if (mapID === 2){
            this.setState({
                mapDisplay: secondMap,
                floorName: '2nd Floor',
                mapID: 2
            });
        }
        else if (mapID === 3){
            this.setState({
                mapDisplay: thirdMap,
                floorName: '3rd Floor',
                mapID: 3
            });
        }
    }

    displayLocation(location){
        if (location === this.state.mapID && this.state.showlocation){
            return (<h2 className="location">
                        <div className="pulse">
                            <div className="pulsating"></div>
                            <div className="dot"></div>
                        </div>{this.state.user}</h2>);
        }
    }

    displayLocationInList(location, map){
        if (location === map && this.state.showlocation){
            return (<span className="badge badge-danger badge-pill">You Are Here</span>);
        }
    }

    displayLocationMessage(){
        if (!this.state.showlocation){
                if (this.state.status == 'guest'){
                    return (
                        <div>
                            <h3 className="location-off-message">Location cannot be shared as a guest - Login via dropdown menu.</h3>
                        </div>);
                } else {
                    return (
                        <div>
                            <h3 className="location-off-message">Location not being shared - Enable via dropdown menu.</h3>
                        </div>);
                }
        } else {
            return (
                <div>
                    <h3 className="location-on-message">Location being shared - Disable via dropdown menu.</h3>
                </div>);
        }
    }

    render() {
        if (!this.state.hasLoaded){
            return (<LoadingSpinner/>)
        }
        return (
            <div className="container">
                <div className="row">
                    <div className="col-md">
                        <div style={{width: '350px', height: '500px'}}>
                            <h1 className="map header1">Maps</h1>
                            <br/>
                            <div className="map tab-pane active" id="rooms">
                                <div>
                                    <ul className="list-group">
                                        <p>
                                            <li className="list-group-item d-flex justify-content-between align-items-center" type="button" onClick={(e) => this.displayMap(0, e)}>
                                                Ground Floor
                                                {this.displayLocationInList(this.state.location,0)}
                                            </li>
                                            <li className="list-group-item d-flex justify-content-between align-items-center" type="button" onClick={(e) => this.displayMap(1, e)}>
                                                1st Floor
                                                {this.displayLocationInList(this.state.location,1)}
                                            </li>
                                            <li className="list-group-item d-flex justify-content-between align-items-center" type="button" onClick={(e) => this.displayMap(2, e)}>
                                                2nd Floor
                                                {this.displayLocationInList(this.state.location,2)}
                                            </li>
                                            <li className="list-group-item d-flex justify-content-between align-items-center" type="button" onClick={(e) => this.displayMap(3, e)}>
                                                3rd Floor
                                                {this.displayLocationInList(this.state.location,3)}
                                            </li>

                                            <br/>
                                        </p>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-8">
                        <div className="jumbotronMap jumbotron-fluid">
                            <div className="room vertical_center">
                                <div className="container">
                                    <div className="borderBottom" id="test">
                                        <div className="header-border-bottom">
                                            <h1 className="title"> {this.state.floorName}</h1>
                                        </div>
                                    </div>
                                    <br/>
                                    {this.displayLocationMessage()}
                                    <div className="mapImage">
                                        <img src={this.state.mapDisplay} alt="Error 404: Map Not Found" style={{width: 688, height: 250}}/>
                                        {this.displayLocation(this.state.location)}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        )
    }
}

export default Map;