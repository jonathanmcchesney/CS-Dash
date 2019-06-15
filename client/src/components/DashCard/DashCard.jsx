import React, { Component } from 'react';
import './DashCard.css';

class DashTile extends Component {

    constructor(props) {
        super(props);
        this.state = {
            link:this.props.link?this.props.link:"/",
            text:this.props.text?this.props.text:"You're welcome"
        };
    }

    render() {
        return (
            <div className="card card-layout">
                <div className="card-body">
                    <h3 className="card-title">Card</h3>
                    <p className="card-text">Here is some Super Useful dashboard information.</p>
                    <a href={this.state.link} className="btn btn-danger">{this.state.text}</a>
                </div>
            </div>
        )
    }
}

export default DashTile;