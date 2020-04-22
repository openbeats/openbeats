import React, { Component } from 'react';
import "../assets/css/reset.css";
import jwtDecode from "jwt-decode";
import { store } from '../store';
import { push } from 'connected-react-router';
import { toastActions, authActions } from '../actions';
import Loader from 'react-loader-spinner';
import { connect } from 'react-redux';
import { master } from '../assets/images';


class Reset extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            token: null,
            password: "",
            rePassword: "",
            isResetDone: false
        }
    }


    async componentDidMount() {
        const token = this.props.match.params.token;
        if (!token) {
            toastActions.showMessage("You tried to access invalid link!..");
            store.dispatch(push("/"))
            return
        }
        const decoded = jwtDecode(token);
        if (!(Math.ceil(new Date().getTime() / 1000) < decoded.exp)) {
            toastActions.showMessage("You tried to access invalid link!");
            store.dispatch(push("/"))
            return
        }
        if (!await this.props.validateResetToken(decoded.token)) {
            toastActions.showMessage("You tried to access invalid link!..");
            store.dispatch(push("/"))
            return
        }
        this.setState({ isLoading: false, token: decoded.token })
    }

    componentWillUnmount() {
        this.setState({
            isLoading: true,
            token: null,
            password: "",
            rePassword: "",
            isResetDone: false
        })
    }


    render() {
        return (
            !this.state.isLoading ?
                !this.state.isResetDone ?
                    < div className="reset-wrapper" >
                        <div className="reset-logo-holder">
                            <img src={master} alt="" srcSet="" />
                            <h1 className="ml-2">OpenBeats</h1>
                        </div>
                        <div className="reset-title mt-4 f-s-19 ml-4 font-weight-bold">Reset Password</div>
                        <form className="native-login-input reset-form" onSubmit={async (e) => {
                            e.preventDefault();
                            this.setState({ isLoading: true })
                            if (this.state.password < 3 || this.state.password !== this.state.rePassword) {
                                toastActions.showMessage("password doesn't match!")
                                this.setState({ isLoading: false })
                                return;
                            }
                            if (await this.props.resetPassword(this.state.password, this.state.token))
                                this.setState({
                                    isLoading: false,
                                    isResetDone: true
                                })
                        }}>
                            <input required className="mb-2 mt-2" value={this.state.password} onChange={(e) => this.setState({ password: e.target.value })} placeholder="Enter Password" type="password" />
                            <input required className="mt-2 mb-4" value={this.state.rePassword} onChange={(e) => this.setState({ rePassword: e.target.value })} placeholder="Re-Enter Password" type="password" />
                            <button className="native-login-button mt-4 cursor-pointer" type="submit">Reset</button>
                        </form>
                    </div >
                    :
                    <div className="reset-wrapper">
                        <div className="reset-logo-holder">
                            <img src={master} alt="" srcSet="" />
                            <h1 className="ml-2">OpenBeats</h1>
                        </div>
                        <div className="mt-4">
                            Your Password has been reset successfully!
                    </div>
                        <div className="mt-6">
                            <a href="https://openbeats.live/auth" className="native-login-anchor cursor-pointer" >Continue Login!</a>
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
        resetPassword: (password, token) => {
            return authActions.resetPassword(password, token);
        },
        validateResetToken: (token) => {
            return authActions.validateResetToken(token);
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Reset);