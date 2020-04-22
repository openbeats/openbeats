import React, { Component } from 'react';
import "../assets/css/reset.css";
import { push } from 'connected-react-router';
import { authActions } from '../actions';
import Loader from 'react-loader-spinner';
import { connect } from 'react-redux';
import { master } from '../assets/images';


class Forgot extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            isMailSent: false,
            email: ""
        }
    }


    componentDidMount() {

        this.setState({
            isLoading: false
        })

    }

    componentWillUnmount() {
        this.setState({
            isLoading: true,
            isMailSent: false,
            email: ""
        })
    }


    render() {
        return (
            !this.state.isLoading ?
                !this.state.isMailSent ?
                    <div className="reset-wrapper">
                        <div className="reset-logo-holder">
                            <img src={master} alt="" srcSet="" />
                            <h1 className="ml-2">OpenBeats</h1>
                        </div>
                        <div className="reset-title mt-4 f-s-19 ml-4 font-weight-bold">Reset Password</div>
                        <form className="native-login-input reset-form" onSubmit={async (e) => {
                            e.preventDefault();
                            this.setState({ isLoading: true })
                            if (this.state.email) {
                                const status = await this.props.resetEmailHandler(this.state.email);
                                if (status) {
                                    this.setState({ isLoading: false, isMailSent: true })
                                } else {
                                    this.setState({ isLoading: false, isMailSent: false })
                                }
                            }
                        }}>
                            <input required className="mb-2 mt-2" value={this.state.email} onChange={(e) => this.setState({ email: e.target.value })} placeholder="Enter Your email id" type="email" />
                            <button className="native-login-button mt-4 cursor-pointer" type="submit">Submit</button>
                        </form>
                    </div>
                    :
                    <div className="reset-wrapper">
                        <div className="reset-logo-holder">
                            <img src={master} alt="" srcSet="" />
                            <h1 className="ml-2">OpenBeats</h1>
                        </div>
                        <div className="mt-4">
                            Please Check your email inbox to reset your password!
                        </div>
                        <div className="mt-4">
                            <div onClick={() => this.props.push("/auth")} className="responsive-custom-link display-block mt-4 cursor-pointer" >Login</div>
                        </div>
                    </div>
                :
                <div className="reset-wrapper">
                    <Loader
                        type="ThreeDots"
                        color="#F32C2C"
                        height={80}
                        width={80}
                    />
                </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {

    }

}

const mapDispatchToProps = (dispatch) => {
    return {
        push: (route) => {
            dispatch(push(route));
        },
        resetEmailHandler: (email) => {
            return authActions.resetEmailHandler(email);
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Forgot);