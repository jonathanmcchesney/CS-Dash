import React, { Component } from 'react';
import LoginDropDown from '../DropDownButton/DropDownButton';
import logo from '../../assets/img/logo.png';
import title from '../../assets/img/newTitle.png';
import Feedback from '../Feedback/Feedback';
import Notify from '../Notify/Notify'
import Avatar from 'react-avatar';

import './NavBar.css';
import helperUtils from '../..//utils/HelperUtils';
import Notifications from '../..//controllers/Notifications'

class NavBar extends Component {

    constructor(props) {
    super(props);
    this.state = {
        title: this.props.title,
        contents: this.props.contents,
        successAlert: '',
        warningAlert: '',
        dangerAlert: '',
        notificationType: '',
        notificationMessage: ''
    }
}


    renderProfileModal() {
        document.location.href='/profile';
    }

    componentDidMount() {
        Notifications.getNotifications().then(result => {
            this.setState({
                successAlert: result.successAlert,
                warningAlert: result.warningAlert,
                dangerAlert: result.dangerAlert
            });
            if(this.state.successAlert != null && this.state.successAlert !== '' ){
                this.setState({
                    notificationType: 'success',
                    notificationMessage: this.state.successAlert
                });
            } else if(this.state.warningAlert != null && this.state.warningAlert !== '' ){
                this.setState({
                    notificationType: 'warning',
                    notificationMessage: this.state.warningAlert
                });
            } else if(this.state.dangerAlert != null && this.state.dangerAlert !== '' ){
                this.setState({
                    notificationType: 'error',
                    notificationMessage: this.state.dangerAlert
                });
            } else {
                this.setState({
                    notificationType: '',
                    notificationMessage: ''
                });
            }
        })
    }

    renderNotification(){
        if (this.state.notificationType == 'success'){
            return (
                <div className="notificationLineSuccess">
                    <div className="notificationLineText">{this.state.notificationMessage}</div>
                </div>);
        } else if (this.state.notificationType == 'warning'){
            return (
                <div className="notificationLineWarning">
                    <div className="notificationLineText">{this.state.notificationMessage}</div>
                </div>);
        } else if (this.state.notificationType == 'error'){
            return (
                <div className="notificationLineError">
                    <div className="notificationLineText">{this.state.notificationMessage}</div>
                </div>);
        }
    }

    render()
    {
        let user = this.props.user ? this.props.user : 'guest'
        let status = this.props.status ? this.props.status : 'guest'
        let bgColour = this.props.bgColour ? this.props.bgColour : '#50adca'
        let fgColour = this.props.fgColour ? this.props.fgColour : '#FFFFFF'
        let rounded = this.props.rounded == 0 ? "rounded" : ""
        let nameJSX = (<button type="button" className="btn btn-dark btn-outline-light user-status user-name">{helperUtils.toUpperCase(user)}</button>);
        let statusStyles = "btn btn-dark btn-outline-light user-status"
        statusStyles += (user !== 'guest') ? " divider" : "";
        let pic =  <Avatar name={user} onClick={this.renderProfileModal.bind(this)} color={bgColour} fgColor={fgColour} round={true} className={rounded} size="35"  />

        return (
            <nav className="navbar navbar-dark bg-danger fixed-top">
                <a className="navbar-brand" href="/" >
                    <img src={logo} alt="Logo" hspace="10" style={{width: 60, height: 40}}/>
                    <img src={title} alt="Logo" style={{width: 200, height: 40}}/>
                </a>
                {sessionStorage.getItem('notifications') == '1' ? this.renderNotification() : null}
                <div className="form-inline">
                    {user !== 'guest' ?  pic    : null}
                    {user !== 'guest' ?  nameJSX  : null}
                    <button type="button" className={statusStyles}>{helperUtils.toUpperCase(status)}</button>
                    <LoginDropDown user={user}></LoginDropDown>
                    <Feedback user={user}/>
                </div>
            </nav>
        );
    }
}

export default NavBar;