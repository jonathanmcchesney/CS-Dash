import React, { Component } from 'react';

class ErrorPage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            title: this.props.title,
            contents: this.props.contents,
            errorCode: this.props.errorCode
        }
    }

    componentDidMount() {
        document.title = this.state.title;
    }

    render() {
        return (
            <div>
                <h1><strong>{this.state.errorCode}</strong>User: <strong>{this.state.contents}</strong> does not have access to this page!</h1>
            </div>
        )
    }
}

export default ErrorPage;