import React, {Component} from 'react';
import userLocation from "../../controllers/userLocation"

class LoginDropDown extends Component {

    resetSession() {
        sessionStorage.setItem('user', 'guest');
        sessionStorage.setItem('status', 'guest');
    }


    constructor(props) {
        super(props);
        this.state = {
            showlocation: false,
            showNotifications: sessionStorage.getItem('notifications') ? sessionStorage.getItem('notifications') : '1',
            email: sessionStorage.getItem('email'),
            hasLoaded: false
        }
    }

    componentDidMount() {
        let req = {
            email: this.state.email
        };
        userLocation.getLocation(req).then(res => {
            this.setState({
                showlocation: res.showlocation,
                hasLoaded: true
            });
        });
    }

    notificationChange() {
        let current = this.state.showNotifications == '1' ? '0' : '1'
        this.setState({showNotifications: current})
        sessionStorage.setItem('notifications', current);
        document.location.href = document.location.href;
    }

    showLocationChange() {
        let req = {};
        if (this.state.showlocation) {
            req = {
                email: this.state.email,
                showlocation: 0
            };
        } else {
            req = {
                email: this.state.email,
                showlocation: 1
            };
        }
        userLocation.updateLocation(req).then(result => {
            if (result.showlocation === 1) {
                this.setState({
                    showlocation: true
                });
            } else {
                this.setState({
                    showlocation: false
                });
            }
        });
        if (document.location.href.includes('map')){
            document.location.href = document.location.href;
        }
    }

    renderLocationCheckBox(){
        if (this.props.user !== 'guest'){
            return (<label className = "checkboxlabel">
                <input className = "checkbox"
                       type="checkbox"
                       defaultChecked={this.state.showlocation}
                       onChange={(e) => this.showLocationChange()}
                />
                Show location
            </label>)
        }
    }

    renderNotificationCheckBox(){
        let text = this.props.user !== 'guest' ?
            <div>Show alerts&nbsp;&nbsp;&nbsp;&nbsp;</div>: <div>&nbsp;&nbsp;Show alerts</div>
        return (<label className = "checkboxlabel">
            <input className = "checkbox"
                   type="checkbox"
                   defaultChecked={this.state.showNotifications == '1' ? true : false}
                   onClick={(e) => this.notificationChange()}
            />
            {text}
        </label>)
    }


    render() {
        if (!this.state.hasLoaded){
            return null;
        }
        return (
            <div className="btn-group">
                <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.5.0/css/all.css"
                      integrity="sha384-B4dIYHKNBt8Bc12p+WXckhzcICo0wtJAoU8YZTY5qE0Id1GSseTk6S+L3BlXeVIU"
                      crossOrigin="anonymous"/>
                <button type="button" className="btn btn-success dropdown-toggle" href="#" id="dropdownMenuLink" data-toggle="dropdown"
                        aria-haspopup="true" aria-expanded="false"><span className="fas fa-cogs"/></button>
                <div className="dropdown-menu dropdown-menu-right" aria-labelledby="dropdownMenuLink">
                    {
                        sessionStorage.getItem('status')!=='guest' ?
                            <a className="dropdown-item" href="/profile"><span className="fas fa-user-circle"/> Profile</a> : null
                    }
                    {
                        sessionStorage.getItem('status')==='admin' ?
                            <a className="dropdown-item" href="/notifications"><span className="fas fa-bell"/> Notify</a> : null
                    }
                    {
                        sessionStorage.getItem('status')!=='guest' ?
                            <a className="dropdown-item" href="/settings"><span className="fas fa-cog"/> Update Password</a> : null
                    }
                    {
                        sessionStorage.getItem('status')==='admin' ?
                            <a className="dropdown-item" href="/hvac"><span className="fas fa-chart-bar"/> HVAC Control</a> : null
                    }
                    {this.renderLocationCheckBox()}
                    {this.renderNotificationCheckBox()}
                    <a className="dropdown-item" href="/faq"> <span className="fas fa-question-circle"/> FAQs</a>
                    <a className="dropdown-item" href="https://gitlab.eeecs.qub.ac.uk/40126401/csc4008frontend"><span className="fas fa-info-circle"/>  Help</a>
                    <div className="dropdown-divider"></div>
                    {this.props.user === 'guest' ? (<a className="dropdown-item" onClick={this.resetSession.bind(this)} href="/login"><p className="fas fa-user"/> Sign In</a>) :
                        (<a className="dropdown-item" onClick={this.resetSession.bind(this)} href="/login"><span className="fas fa-user"/> Sign Out</a>)}
                </div>
            </div>
        );
    }
}

export default LoginDropDown;