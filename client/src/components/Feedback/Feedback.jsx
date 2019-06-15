import React, {Component} from 'react';
import SlackFeedback from 'react-slack-feedback';

class Feedback extends Component {
    render() {
        return (
            <SlackFeedback
                onSubmit={sendToSlack}
                user={this.props.user}
                emoji=":bug:"
                channel="#feedback"/>
        );
    }
}
function sendToSlack(payload) {
    fetch('/api/slack', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    })
        .then(res => res.json())
        .then(res => {
            if (res.status >= 200 && res.status < 300) {
                this.sent();
            } else {
                this.error(res);
            }
        });
}
// function uploadImage(file) {
//     var form = new FormData();
//     form.append('image', file);
//
//     fetch('/api/upload', {
//         method: 'POST',
//         body: form
//     })
//         .then(res => {
//             console.log(res.status, res.statusText);
//             if (res.status < 200 || res.status >= 300) {
//                 this.uploadError(res.statusText);
//             }
//
//             return res.json();
//         })
//         .then(url => this.imageUploaded(url));
// }
export default Feedback;