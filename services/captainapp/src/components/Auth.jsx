import React, { Component } from 'react'
import { MDBInput, MDBBtn, MDBCard, MDBCardBody } from 'mdbreact';
import { logo } from '../assets/images';
import { withRouter } from 'react-router';
import { toast } from 'react-toastify';
import { variables } from '../config';
import axios from "axios";

class Auth extends Component {

    constructor(props) {
        super(props);
        this.initialState = {
            email: '',
            password: ''
        };
        this.state = { ...this.initialState };
    }

    async authHandler() {
        const authUrl = `${variables.baseUrl}/auth/login?admin=true`;
        let { data } = await axios.post(authUrl, {
            email: this.state.userEmail,
            password: this.state.password
        })
        data = data.data;
        if (data && data.admin && data.admin.status) {
            toast.success("Login succes redirecting to your dashboard!")
            const authData = {
                isAuthenticated: true,
                userEmail: data.email,
                userName: data.name,
                token: data.token,
                avatar: data.avatar,
                userId: data.id
            };
            await this.props.setAuthDetails(authData);
            this.props.history.push("/");
        } else {
            toast.error("userEmail or password is incorrect - or you don't have admin privilages!");
        }
    }

    componentWillUnmount() {
        this.setState({ ...this.initialState });
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
                                    label="Your email"
                                    icon="envelope"
                                    group
                                    onChange={e => this.setState({ userEmail: e.target.value })}
                                    value={this.state.userEmail}
                                    type="email"
                                    validate
                                    error="wrong"
                                    success="right"
                                    required
                                />
                                <MDBInput
                                    label="Your password"
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