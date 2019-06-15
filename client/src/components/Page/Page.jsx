import React, { Component } from 'react';

class Page extends Component {

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
        return (
            <div>
                {this.state.contents}
            </div>
        )
    }
}

export default Page;