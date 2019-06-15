import React, { Component } from 'react';
import User from "../../controllers/Users";
import "./Modal.css";
import Logo from "../../assets/img/logo.png";

class Modal extends Component {

    constructor(props) {
        super(props);
        this.state = {
            title: this.props.title,
            contents: this.props.contents,
            password: '',
            email: '',
            msg: '',
            msgClass: '',
            isHidden: true
        }
    }

    componentDidMount() {
        document.title = this.state.title;
    }

    setEmail(e){
        this.setState({email: e.target.value})
    }

    setPassword(e){
        this.setState({password: e.target.value})
    }

    isDisabled(){
        if(this.state.email == '' || this.state.password == ''){
            return true
        } else {
            return false
        }
    }

    doesUserExist() {
        let req = {
            email: this.state.email
        }
        User.doesUserExist(req).then(result => {
            if (result.message == 'user does not exist'){
                this.registerUser()
            }
            else{
                this.setState({msg:result.message,isHidden:false,msgClass:'alert alert-danger alert-dismissible fade show'})
            }

        }).catch(error => {
            this.setState({msg:error,isHidden:false,msgClass:'alert alert-danger alert-dismissible fade show'})
        })
    }


    registerUser() {
        let req = {
            password: this.state.password,
            email: this.state.email
        }

        User.create(req).then(result => {
            if (result.message == "user created successfully!")
                this.setState({msg:result.message,isHidden:false,msgClass:'alert alert-success alert-dismissible fade show'})
            else
                this.setState({msg:result.message,isHidden:false,msgClass:'alert alert-danger alert-dismissible fade show'})


        }).catch(error => {
            this.setState({msg:error.message,isHidden:false,msgClass:'alert alert-danger alert-dismissible fade show'})
        })
    }


    render() {
        return (
            <div>
                <div className="modal fade" id="exampleModalCenter" tabIndex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="exampleModalLongTitle">
                                    <img src={Logo} alt="Logo" hspace="10" className="logoStyle"/>
                                     Sign up with your QUB email
                                    <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                        <p aria-hidden="true" style = {{paddingTop: 10, paddingRight: 15}}>&times;</p>
                                    </button>
                                </h5>
                            </div>
                            <div className="modal-body">
                                <div className="row col-md-12">
                                    <div className="col-md-12" style={{paddingLeft: 50}}>
                                        <div className="content">
                                            <div className="modal-body">
                                                <div className="form-group">
                                                    <i className="fa fa-user-alt"></i>
                                                    <input type="text" className="form-control" placeholder="Email" required="required" onChange={this.setEmail.bind(this)} />
                                                </div>
                                                <div className="form-group">
                                                    <i className="fa fa-lock"></i>
                                                    <input type="password" className="form-control" placeholder="Password" required="required" onChange={this.setPassword.bind(this)} />
                                                </div>
                                                <div className="form-check">
                                                    <input type="checkbox" className="form-check-input" id="exampleCheck1"></input>
                                                        <label className="form-check-label" htmlFor="exampleCheck1">Remember me</label>
                                                </div>
                                                {/*<div className="form-group">*/}
                                                    {/*<i className="fa fa-lock"></i>*/}
                                                    {/*<input type="confirm password" className="form-control" placeholder="Confirm Password" required="required" />*/}
                                                {/*</div>*/}
                                            </div>
                                            <div className={this.state.msgClass} role="alert">
                                                {this.state.msg}
                                                <button type="button" className="close" data-dismiss="alert" aria-label="Close">
                                                    <span hidden={this.state.isHidden} aria-hidden="true">&times;</span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-danger" data-dismiss="modal">Close</button>
                                <button type="button" className="btn btn-primary" disabled={this.isDisabled()} onClick={this.doesUserExist.bind(this)}>Register</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Modal;