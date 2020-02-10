import React, { Component } from 'react';
import "../css/reset.css";
import jwtDecode from "jwt-decode";
import { store } from '../store';
import { push } from 'connected-react-router';
import { toastActions, authActions } from '../actions';
import Loader from 'react-loader-spinner';
import { connect } from 'react-redux';
import { master } from '../images';


class Reset extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            token: null,
            password: "",
            rePassword: ""
        }
    }


    componentDidMount() {
        const token = this.props.match.params.token;
        if (!token) {
            toastActions.showMessage("You tried to access invalid link!..");
            store.dispatch(push("/"))
            return
        }
        const decoded = jwtDecode(token);
        if (Math.ceil(new Date().getTime() / 1000) < decoded.exp) {
            this.setState({ isLoading: false, token: token })
        } else {
            toastActions.showMessage("You tried to access invalid link!");
            store.dispatch(push("/"))
            return
        }

    }

    componentWillUnmount() {
        this.setState({
            isLoading: true,
            token: null,
            password: "",
            rePassword: ""
        })
    }


    render() {
        return (
            !this.state.isLoading ?
                <div className="reset-wrapper">
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
                        await this.props.resetPassword(this.state.password, this.state.token);
                        this.setState({ isLoading: false })
                    }}>
                        <input className="mb-2 mt-2" value={this.state.password} onChange={(e) => this.setState({ password: e.target.value })} placeholder="Enter Password" type="password" />
                        <input className="mt-2 mb-4" value={this.state.rePassword} onChange={(e) => this.setState({ rePassword: e.target.value })} placeholder="Re-Enter Password" type="password" />
                        <button className="native-login-button mt-4 cursor-pointer" type="submit">Reset</button>
                    </form>
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
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Reset);