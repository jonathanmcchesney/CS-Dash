import React, { Component } from 'react';
import ReactWeather from 'react-open-weather';
import 'react-open-weather/lib/css/ReactWeather.css';
import './Weather.css';

class Weather extends Component {

    constructor(props) {
        super(props);
        this.state = {
            title: this.props.title,
            contents: this.props.contents,
            width: this.props.width === null ? '400px': this.props.width
        }
    }

    render() {
        return (
            <div>
                <link rel="stylesheet"
                      href="https://cdnjs.cloudflare.com/ajax/libs/weather-icons/2.0.9/css/weather-icons.min.css"
                      type="text/css"/>
                <div className="rows col-md-12 weather" style={{width:'600px', padding: "5px", margin: '10px'}}>
                    <ReactWeather
                        forecast="today"
                        apikey="7e3d6ed652ed4f33ae0105501182111"
                        type="city"
                        city="Belfast"/>
                </div>
            </div>
        )
    }
}

export default Weather;