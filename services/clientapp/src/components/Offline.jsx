import React, { Component } from 'react';
import "../assets/css/offline.css";
import { logoicon } from '../assets/images';
import { push } from 'connected-react-router';
import { toastActions } from '../actions';
import { connect } from 'react-redux';

class Offline extends Component {

    render() {
        return (
            <div className={`offline-wrapper ${this.props.isOnline ? '' : 'show-offline-wrapper'}`}>
                <img src={logoicon} alt="" srcSet="" />
                <div className="offline-title">
                    Seems like you are offline!
               </div>
                <div className="offline-description">
                    OpenBeats will automatically resume once you are online!
                </div>
                <div className="offline-fallback-block">if not <a href="/">click here</a> to reload</div>
            </div>
        );
    }

}

const mapStateToProps = (state) => {
    return {
        isOnline: state.offlineReducer.isOnline
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        push: (path) => {
            dispatch(push(path))
        },
        notify: (message) => {
            toastActions.showMessage(message)
        },
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(Offline);
