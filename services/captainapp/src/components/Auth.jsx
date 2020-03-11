import React, { Component } from 'react'
import { MDBInput, MDBBtn, MDBCard, MDBCardBody } from 'mdbreact';
import { logo } from '../assets/images';
import { connect } from "react-redux";
import { authActions } from '../actions';

class Auth extends Component {

    constructor(props) {
        super(props);
        this.initialState = {
            email: '',
            password: ''
        };
        this.state = { ...this.initialState };
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
                            this.props.loginHandler(this.state.email, this.state.password);
                        }}>
                            <p className="h4 text-center py-1 d-flex align-items-center justify-content-center"><img className="rounded-circle" alt="logo" style={{ height: "100px" }} src={logo} /></p>
                            <div className="grey-text">
                                <MDBInput
                                    label="Your email"
                                    icon="envelope"
                                    group
                                    onChange={e => this.setState({ email: e.target.value })}
                                    value={this.state.email}
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

const mapStateToProps = (state) => {
    return {
        isAuthenticated: state.auth.isAuthenticated,
        isAuthLoading: state.auth.isAuthLoading
    };
}

const mapDispatchToProps = (dispatch) => {
    return {
        loginHandler: (email, password) => {
            authActions.loginHandler(email, password)
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Auth);