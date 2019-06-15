import React, { Component } from 'react';
import User from "../../controllers/Users";
import './UpdateUser.css'
import Modal from "../Modal/Modal";

class UpdateUser extends Component {

    constructor(props) {
        super(props);
        this.state = {
            title: this.props.title,
            contents: this.props.contents,
            oldPassword: '',
            newPassword: '',
            email: '',
            adminChangeEmail: '',
            status: '',
            msg: '',
            msgClass: '',
            isHidden: true,
            showModal: false
        }
    }

    componentDidMount() {
        document.title = this.state.title;
        let status = sessionStorage.getItem('status')
        let email = sessionStorage.getItem('email')

        this.setState({email: email, status: status})
    }

    verifyUser() {
        let req = {
            email: this.state.email,
            password: this.state.oldPassword,
            status: this.state.status
        }
        User.verifyUser(req).then(result => {
            if (result.message == 'user verified'){
                if (sessionStorage.getItem('email') == result.email) {
                    if (this.state.oldPassword != this.state.newPassword)
                        this.updatePassword()
                    else
                        this.setState({msg:'New password must be a different value!',isHidden:false,msgClass:'alert alert-danger alert-dismissible fade show'})
                } else {
                    let userMsg = "Email: " + this.state.email + "'s status is incorrect!"
                    this.setState({msg:userMsg,isHidden:false,msgClass:'alert alert-danger alert-dismissible fade show'})
                }
            }
            else {
                this.setState({msg:result.message,isHidden:false,msgClass:'alert alert-danger alert-dismissible fade show'})
            }
        }).catch(error => {
            this.setState({msg:error,isHidden:false,msgClass:'alert alert-danger alert-dismissible fade show'})
        })
    }

    updatePassword(){
        let email;
        if(this.state.status=='admin')
            email = this.state.adminChangeEmail
        else
            email = this.state.email

        let req = {
            email: email,
            password: this.state.newPassword
        }
        User.updatePassword(req).then(result => {
            if (result.message == 'Password updated successfully!'){
                let message = 'Password update successful for user: ' + email
                this.setState({msg:message,isHidden:false,msgClass:'alert alert-success alert-dismissible fade show'})
            }
            else {
                this.setState({msg:result.message,isHidden:false,msgClass:'alert alert-danger alert-dismissible fade show'})
            }

        }).catch(error => {
            this.setState({msg:error,isHidden:false,msgClass:'alert alert-danger alert-dismissible fade show'})
        })
    }

    updateOldPass(e) {
        this.setState({ oldPassword: e.target.value })
    }

    updateNewPass(e) {
        this.setState({ newPassword: e.target.value })
    }

    isDisabled() {
        if (this.state.email == '' || this.state.oldPassword == '' || this.state.newPassword == '' || (this.state.adminChangeEmail == '' && this.state.status == 'admin')){
            return true
        } else {
            return false
        }
    }

    isMakeAdminDisabled() {
        if (this.state.email == '' || this.state.oldPassword == '' || (this.state.adminChangeEmail == '' && this.state.status == 'admin')){
            return true
        } else {
            return false
        }
    }

    updateAdminChangeEmail(e) {
        this.setState({ adminChangeEmail: e.target.value })
    }

    updateStatus() {
        let req = {
            email: this.state.adminChangeEmail,
            status: 'admin'
        }
        User.updateAdmin(req).then(result => {
            if (result.message == 'status change successful!'){
                let message = 'User: ' + this.state.adminChangeEmail  + " is now an Admin!"
                this.setState({msg:message,isHidden:false,msgClass:'alert alert-success alert-dismissible fade show'})
            }
            else {
                this.setState({msg:result.message,isHidden:false,msgClass:'alert alert-danger alert-dismissible fade show'})
            }

        }).catch(error => {
            this.setState({msg:error,isHidden:false,msgClass:'alert alert-danger alert-dismissible fade show'})
        })
    }

    renderFields() {
        return (
            <div className="updatePassword col-md-4 offset-md-4 text-center">
                {
                    this.state.status == 'admin' ?
                        <h1>Update User</h1> :
                        <h1>Update Password</h1>
                }
                <div className="content">
                    <div className="modal-body">
                        {
                            this.state.status == "admin" ?
                                <div>
                                    <div className="form-group">
                                        <i className="fa fa-key"></i>
                                        <input type="password" className="form-control"
                                               placeholder="(Admin) Enter your password" required="required"
                                               onChange={this.updateOldPass.bind(this)}/>
                                    </div>
                                    <div className="form-group">
                                        <i className="fa fa-user-alt"></i>
                                        <input type="text" className="form-control"
                                               placeholder="Enter a user's email" required="required"
                                               onChange={this.updateAdminChangeEmail.bind(this)}/>
                                    </div>
                                </div>

                                :
                                <div className="form-group">
                                    <i className="fa fa-unlock"></i>
                                    <input type="password" className="form-control"
                                           placeholder="Current Password" required="required"
                                           onChange={this.updateOldPass.bind(this)}/>
                                </div>
                        }
                        <div className="form-group">
                            <i className="fa fa-lock"></i>
                            <input type="password" className="form-control" placeholder="New Password"
                                   required="required" onChange={this.updateNewPass.bind(this)}/>
                        </div>
                        <div className="form-group">
                            <input type="submit" className="btn btn-success btn-block btn-lg"
                                   disabled={this.isDisabled()} value="Update Password"
                                   onClick={this.verifyUser.bind(this)}/>
                        </div>
                        {
                            this.state.status == "admin" ?
                                <div className="form-group">
                                    <input type="submit" className="btn btn-outline-success btn-block btn-lg"
                                           disabled={this.isMakeAdminDisabled()} value="Make Admin"
                                           onClick={this.updateStatus.bind(this)}/>
                                </div> : null
                        }
                    </div>
                </div>
                <Modal showModal={this.state.showModal}/>
                <br/>
                <div className={this.state.msgClass} role="alert">
                    {this.state.msg}
                    <button type="button" className="close" data-dismiss="alert" aria-label="Close">
                        <span hidden={this.state.isHidden} aria-hidden="true">&times;</span>
                    </button>
                </div>
            </div>
        )
    }

    render() {
            return (
                <div>
                    <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.5.0/css/all.css"
                          integrity="sha384-B4dIYHKNBt8Bc12p+WXckhzcICo0wtJAoU8YZTY5qE0Id1GSseTk6S+L3BlXeVIU"
                          crossOrigin="anonymous"/>
                    <div className="row col-md-12 update-password-container">
                        {this.renderFields()}
                    </div>
                </div>
            )

    }
}

export default UpdateUser;