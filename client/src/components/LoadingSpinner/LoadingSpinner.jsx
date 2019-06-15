import React, { Component } from 'react';

import './LoadingSpinner.css'
import loading from "../../assets/img/loading.gif";

class LoadingSpinner extends Component {

    render() {
        return(
            <div className="loadingStyle">
                <img src={loading} alt="Loading..." style={{width: 444, height: 250}}/>
            </div>
        )
    }
}

export default LoadingSpinner;