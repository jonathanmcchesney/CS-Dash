import React, { Component } from 'react';
import './Login.css'
import User from '../../controllers/Users'
import Modal from '../Modal/Modal';

class Login extends Component {

    constructor(props) {
        super(props);
        this.state = {
            title: this.props.title,
            contents: this.props.contents,
            isDisabled: true,
            email: '',
            password: '',
            response: '',
            msg: '',
            classMsg: '',
            user: 'guest',
            status: 'guest',
            showModal: false,
            isHidden: true,
            bgcolour: '',
            fgColour: '',
            rounded: null
        }
        sessionStorage.setItem('user', this.state.user);
        sessionStorage.setItem('email', this.state.email);
        sessionStorage.setItem('status', this.state.status);
        sessionStorage.setItem('profileBgColour', this.state.bgcolour);
        sessionStorage.setItem('profileFgColour', this.state.fgcolour);
        sessionStorage.setItem('profileRounded', this.state.rounded);
        this.routeChange = this.routeChange.bind(this);
    }

    componentDidMount() {
        document.title = this.state.title;
        document.contents = this.state.contents;
        document.passEntered = this.state.passEntered;
        document.email = this.state.email;
        document.password = this.state.password;
    }

    loginOnClick(){
        let req = {
            email: this.state.email,
            password: this.state.password
        }
        User.login(req).then(result => {
            if (result.message == 'access granted'){
                this.setState({msg:'Login successful',isHidden:false,msgClass:'alert alert-success alert-dismissible fade show'})
                sessionStorage.setItem('user', result.user);
                sessionStorage.setItem('status', result.status);
                sessionStorage.setItem('email', result.email);
                sessionStorage.setItem('profileBgColour', result.bgcolour);
                sessionStorage.setItem('profileFgColour', result.fgcolour);
                sessionStorage.setItem('profileRounded', result.rounded);
                document.location.href='/'
            }
            else{
                this.setState({msg:result.message,isHidden:false,msgClass:'alert alert-danger alert-dismissible fade show'})
                sessionStorage.setItem('user', this.state.user);
                sessionStorage.setItem('status', this.state.status);
                sessionStorage.setItem('email', this.state.email);
                sessionStorage.setItem('profileBgColour', this.state.bgcolour);
                sessionStorage.setItem('profileFgColour', this.state.fgColour);
                sessionStorage.setItem('profileRounded', this.state.rounded);
            }

        }).catch(error => {
            this.setState({msg:error,isHidden:false,msgClass:'alert alert-danger alert-dismissible fade show'})
            sessionStorage.setItem('user', this.state.user);
            sessionStorage.setItem('status', this.state.status);
            sessionStorage.setItem('email', this.state.email);
            sessionStorage.setItem('profileBgColour', this.state.bgcolour);
            sessionStorage.setItem('profileFgColour', this.state.fgColour);
            sessionStorage.setItem('profileRounded', this.state.rounded);
        })
    }

    updateEmail(e) {
        this.setState({ email: e.target.value })
    }

    updatePass(e) {
        this.setState({ password: e.target.value })
    }

    isDisabled() {
        if (this.state.email == '' || this.state.password == ''){
            return true
        } else {
            return false
        }
    }

    routeChange(){
        let path = '/';
        this.props.history.push(path);
    }

    render() {
        return (
            <div>
                <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.5.0/css/all.css"
                       integrity="sha384-B4dIYHKNBt8Bc12p+WXckhzcICo0wtJAoU8YZTY5qE0Id1GSseTk6S+L3BlXeVIU"
                       crossOrigin="anonymous"/>
                <div className="row col-md-12">
                    <div className="login col-md-4 offset-md-4">
                        <div className="content">
                            <div className="header">
                                <h4 className="title">CS-Dash Login</h4>
                            </div>
                            <br/><br/>
                            <div className="modal-body">
                                    <div className="form-group">
                                        <i className="fa fa-user-alt"></i>
                                        <input type="text" className="form-control" placeholder="Email" required="required" spellcheck="false" onChange={this.updateEmail.bind(this)}/>
                                    </div>
                                    <div className="form-group">
                                        <i className="fa fa-lock"></i>
                                        <input type="password" className="form-control" placeholder="Password" required="required" onChange={this.updatePass.bind(this)}/>
                                    </div>
                                    <div className="form-group">
                                        <input type="submit" className="btn btn-primary btn-block btn-lg" disabled={this.isDisabled()} value="Sign in" onClick={this.loginOnClick.bind(this)}/>
                                    </div>
                            </div>
                            <div className="col-md-5">
                                <a href="#" data-toggle="modal" data-target="#exampleModalCenter">Register / Sign up</a>
                            </div>

                        </div>
                        <br/>
                        <div className={this.state.msgClass} role="alert">
                            {this.state.msg}
                            <button type="button" className="close" data-dismiss="alert" aria-label="Close">
                                <span hidden={this.state.isHidden} aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <Modal showModal={this.state.showModal}/>
                    </div>
                </div>
            </div>
        );

    }

}

export default Login;