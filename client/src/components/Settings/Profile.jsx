import React, { Component } from 'react';
import Avatar from "react-avatar";
import helperUtils from '../..//utils/HelperUtils';
import User from "../../controllers/Users";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";
let randomColor = require('randomcolor');

class Profile extends Component {

    constructor(props) {
        super(props);
        this.state = {
            title: this.props.title,
            contents: this.props.contents,
            email: sessionStorage.getItem('email'),
            user: this.props.user ? this.props.user : 'guest',
            bgColour: this.props.bgColour ? this.props.bgColour : '#50adca',
            fgColour: this.props.fgColour ? this.props.fgColour : '#FFFFFF',
            rounded: this.props.rounded == 0 ? "rounded" : "",
            msg: '',
            msgClass: '',
            hasLoaded: null
        }
    }

    componentWillMount() {
        if(this.props.user === 'guest')
            document.location.href='/login';
    }

    componentDidMount() {
        document.title = this.state.title;
        this.setState({hasLoaded: true})
    }

    returnToDash() {
        document.location.href='/'
    }

    changeBgColour() {
        this.setState({bgColour:randomColor()})

    }

    changeFgColour() {
        this.setState({fgColour:randomColor()})

    }

    changeBorderType() {
        this.setState({rounded: this.state.rounded == "rounded" ? "" : "rounded"})
    }

    defaultImage() {
        this.setState({
            fgColour: '#FFFFFF',
            bgColour:'#50adca',
            rounded:""
        })

    }

    updateProfile(){
        let req = {
            email: this.state.email,
            bgColour: this.state.bgColour,
            fgColour: this.state.fgColour,
            rounded: this.state.rounded == "rounded" ? 0 : 1
        }
        User.updateProfile(req).then(result => {
            if (result.message == 'profile updated successfully!'){
                this.setState({msg:'Profile updated successfully!',isHidden:false,msgClass:'alert alert-success alert-dismissible fade show'})
                sessionStorage.setItem('profileBgColour', result.bgColour);
                sessionStorage.setItem('profileFgColour', result.fgColour);
                sessionStorage.setItem('profileRounded', result.rounded);
                document.location.href='/'
            }
            else{
                this.setState({msg:result.message,isHidden:false,msgClass:'alert alert-danger alert-dismissible fade show'})
            }

        }).catch(error => {
            this.setState({msg:error,isHidden:false,msgClass:'alert alert-danger alert-dismissible fade show'})
        })
    }

    render() {
        if(this.props.user !== 'guest' && this.state.hasLoaded) {
            return (
            <div>
                <div className="card text-center">
                    <div className="card-header">
                        <h5 className="card-title" style={{paddingTop: "0.75rem"}}><strong> Profile Settings: </strong></h5>
                    </div>
                    <div className="card-body">
                        <h5 className="card-title">User: <strong>{helperUtils.toUpperCase(this.state.user)}</strong></h5>
                        <h5 className="card-title">Status: <strong>{helperUtils.toUpperCase(sessionStorage.getItem('status'))}</strong></h5>
                        <h5 className="card-title">Email: <strong>{this.state.email}</strong></h5>

                        <Avatar name={this.state.user} color={this.state.bgColour} fgColor={this.state.fgColour} round={true} className={this.state.rounded} size="125"  />
                        <br/>
                        <br/>
                        <br/>
                        <input className="btn btn-danger" type="button" style={{margin: "5px"}} onClick={this.changeFgColour.bind(this)} value="Randomise Text Colour" />
                        <input className="btn btn-danger" type="button" style={{margin: "5px"}} onClick={this.changeBgColour.bind(this)} value="Randomise Background Colour" />
                        <input className="btn btn-danger" type="button" style={{margin: "5px"}} onClick={this.changeBorderType.bind(this)} value="Toggle Border Style" />
                        <br/>
                        <input className="btn btn-danger btn-outline-info" type="button" style={{marginTop: "5px"}} onClick={this.defaultImage.bind(this)} value="Default" />
                        <br/>
                    </div>
                    <div className="card-footer text-muted">
                        <input className="col-lg-2 btn btn-outline-danger" onClick={this.returnToDash.bind(this)}  type="button" style={{marginRight: "10px"}} value="Cancel" />
                        <input className="col-lg-2 btn btn-success" type="button" onClick={this.updateProfile.bind(this)} style={{marginLeft: "10px"}} value="Save" />
                    </div>
                </div>
            </div>
            )
        } else {
            return (<LoadingSpinner/>);
        }
    }
}

export default Profile;