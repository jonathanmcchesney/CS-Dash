import React, { Component } from 'react';
import Notifications from "../../controllers/Notifications";
import ErrorPage from "../Error/ErrorPage";
import "./Notify.css";

class Notify extends Component {

    constructor(props) {
        super(props);
        this.state = {
            title: this.props.title,
            contents: this.props.contents,
            notifications: {
                successAlert: '',
                warningAlert: '',
                dangerAlert: ''
            },
            msg: '',
            msgClass: '',
            isHidden: true,
            successAlertEnabled: false,
            warningAlertEnabled: false,
            errorAlertEnabled: false,
            successButtonMessage: "Submit",
            warningButtonMessage: "Submit",
            errorButtonMessage: "Submit"
        }
    }

    componentDidMount() {
        document.title = this.state.title;
    }

    displayMessage(){
        if(!this.state.isHidden){
            return(<div className="submitted">{this.state.msg}</div>)
        }
    }

    setSuccessAlert(e){
        this.setState({notifications:{successAlert: e.target.value},
            successAlertEnabled: false,
            successButtonMessage: "Submit",
            isHidden: true
        })
    }

    successAlertSelect(e){
        if(this.state.notifications.successAlert !== ''){
            this.setState({
                successAlertEnabled: true,
                warningAlertEnabled: false,
                errorAlertEnabled: false,
                successButtonMessage: "Submitted",
                warningButtonMessage: "Submit",
                errorButtonMessage: "Submit"
            });
        }
    }

    setWarningAlert(e){
        this.setState({notifications:{warningAlert: e.target.value},
            warningAlertEnabled: false,
            warningButtonMessage: "Submit",
            isHidden: true
        })
    }

    warningAlertSelect(e){
        if(this.state.notifications.warningAlert !== '') {
            this.setState({
                successAlertEnabled: false,
                warningAlertEnabled: true,
                errorAlertEnabled: false,
                successButtonMessage: "Submit",
                warningButtonMessage: "Submitted",
                errorButtonMessage: "Submit"
            });
        }
    }

    setErrorAlert(e){
        this.setState({notifications:{dangerAlert: e.target.value},
            errorAlertEnabled: false,
            errorButtonMessage: "Submit",
            isHidden: true
        })
    }

    errorAlertSelect(e){
        if(this.state.notifications.dangerAlert !== ''){
            this.setState({
                successAlertEnabled: false,
                warningAlertEnabled: false,
                errorAlertEnabled: true,
                successButtonMessage: "Submit",
                warningButtonMessage: "Submit",
                errorButtonMessage: "Submitted"
            });
        }
    }

    displaySubmit(){
        if(!(!this.state.successAlertEnabled && !this.state.warningAlertEnabled && !this.state.errorAlertEnabled)){
            {this.updateNotifications()}
        }
    }

    updateNotifications() {
        let req = {};
        if(this.state.successAlertEnabled){
            req = {
                successAlert: this.state.notifications.successAlert,
                warningAlert: "",
                dangerAlert: ""
            }
        } else if(this.state.warningAlertEnabled){
            req = {
                successAlert: "",
                warningAlert: this.state.notifications.warningAlert,
                dangerAlert: ""
            }
        } else if(this.state.errorAlertEnabled){
            req = {
                successAlert: "",
                warningAlert: "",
                dangerAlert: this.state.notifications.dangerAlert
            }
        } else {
            req = {
                successAlert: "",
                warningAlert: "",
                dangerAlert: ""
            }
        }
            Notifications.updateNotifications(req).then(result => {
            if (result.message == 'Admin data retrieved successfully!'){
                let message = 'Notifications updated by ' + <strong> {sessionStorage.getItem('status')} </strong> + ' user: ' + <strong> {sessionStorage.getItem('user')} </strong>
                this.setState({msg:message,isHidden:false,msgClass:'alert alert-success alert-dismissible fade show'})
                setTimeout(function() {
                    document.location.href='/notifications';
                }.bind(this), 1000)

            }
            else {
                this.setState({msg:result.message,isHidden:false,msgClass:'alert alert-danger alert-dismissible fade show'})
                setTimeout(function() {
                    document.location.href='/notifications';
                }.bind(this), 1000)
            }

        }).catch(error => {
            this.setState({msg:error,isHidden:false,msgClass:'alert alert-danger alert-dismissible fade show'})
                setTimeout(function() {
                    document.location.href='/notifications';
                }.bind(this), 1000)
        })
    }

    clearNotifications (){
        this.setState({
            successAlertEnabled: false,
            warningAlertEnabled: false,
            errorAlertEnabled: false
        });
        {this.updateNotifications()}
    }

    render() {
        if (sessionStorage.getItem('status')=="admin") {
            return (
            <div className="notify-container">
                {this.state.contents}
                <br/>
                <br/>
                <input type="text" className="form-control successAlert" placeholder="Success Notification" onChange={this.setSuccessAlert.bind(this)} />
                <button className="buttonActive" onClick={this.successAlertSelect.bind(this)}>{this.state.successButtonMessage}</button>
                <br/>
                <br/>
                <input type="text" className="form-control warningAlert" placeholder="Warning Notification" onChange={this.setWarningAlert.bind(this)} />
                <button className="buttonActive" onClick={this.warningAlertSelect.bind(this)}>{this.state.warningButtonMessage}</button>
                <br/>
                <br/>
                <input type="text" className="form-control errorAlert" placeholder="Error Notification" onChange={this.setErrorAlert.bind(this)} />
                <button className="buttonActive" onClick={this.errorAlertSelect.bind(this)}>{this.state.errorButtonMessage}</button>
                <br/>
                <br/>
                <button className="buttonClear" onClick={this.clearNotifications.bind(this)}>Clear Notifications</button>
                <br/>
                <br/>
                {this.displaySubmit()}
                <br/>
                {this.displayMessage()}
            </div>
            )
        }
        let username = sessionStorage.getItem('user')
        username = username.charAt(0).toUpperCase() + username.slice(1)
        return (
            <ErrorPage errorCode="ERROR 403: " contents = {username}/>
        )
    }
}

export default Notify;