import React, { Component } from 'react';
import UpdateUser from "./UpdateUser";
import ErrorPage from "../Error/ErrorPage";

class Settings extends Component {

    constructor(props) {
        super(props);
        this.state = {
            title: this.props.title,
            contents: this.props.contents
        }
    }

    componentDidMount() {
        document.title = this.state.title;
    }

    render() {
        if (sessionStorage.getItem('status')!=='guest') {
            return (
                <div>
                    <UpdateUser/>
                </div>
            )
        } else {
            let username = sessionStorage.getItem('user')
            username = username.charAt(0).toUpperCase() + username.slice(1)
            return (
                <ErrorPage errorCode="ERROR 403: " contents = {username}/>
            )
        }
    }
}

export default Settings;