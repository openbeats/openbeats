import React, { Component } from 'react'
import { MDBInput, MDBBtn, MDBCard, MDBCardBody } from 'mdbreact';
import { logo } from '../assets/images';
import { withRouter } from 'react-router';
import { toast } from 'react-toastify';

class Auth extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userName: '',
            password: ''
        }
    }

    async authHandler() {
        if (this.state.userName.trim() === "admin" && this.state.password.trim() === "admin") {
            toast.success("Login succes redirecting to your dashboard!")
            await this.props.setAuthDetails({
                status: true,
                userName: 'ThayalanGR',
                mail: 'grthayalan18@gmail.com'
            })
            this.props.history.push("/")
        } else {
            toast.error("Username or password is incorrect - this incidence will be reported to administrator!")
        }
    }

    componentWillUnmount() {
        this.setState({
            userName: '',
            password: ''
        })
    }


    render() {
        return (
            <div className="auth-wrapper vw-100 vh-100 d-flex align-items-center justify-content-center">
                <MDBCard className="w-25 shadow-none">
                    <MDBCardBody>
                        <form onSubmit={e => {
                            e.preventDefault();
                            this.authHandler();
                        }}>
                            <p className="h4 text-center py-1 d-flex align-items-center justify-content-center"><img className="rounded-circle" alt="logo" style={{ height: "100px" }} src={logo} /></p>
                            <div className="grey-text">
                                <MDBInput
                                    label="user name"
                                    icon="user"
                                    group
                                    onChange={e => this.setState({ userName: e.target.value })}
                                    value={this.state.userName}
                                    type="text"
                                    validate
                                    error="wrong"
                                    success="right"
                                    required
                                />
                                <MDBInput
                                    label="Password"
                                    icon="lock"
                                    required
                                    value={this.state.password}
                                    onChange={e => this.setState({ password: e.target.value })}
                                    group
                                    type="password"
                                    validate
                                />
                            </div>
                            <div className="text-center py-2 mt-3">
                                <MDBBtn color="red" style={{ borderRadius: '20px' }} className=" w-100 text-white btn-md font-weight-bold " type="submit">
                                    Login
                                </MDBBtn>
                            </div>
                        </form>
                    </MDBCardBody>
                </MDBCard>
            </div >
        )
    }
}

export default withRouter(Auth);