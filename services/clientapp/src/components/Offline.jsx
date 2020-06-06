import React, { Component, Fragment } from 'react';
import "../assets/css/offline.css";
import { logoicon } from '../assets/images';
import { push } from 'connected-react-router';
import { toastActions } from '../actions';
import { connect } from 'react-redux';

class Offline extends Component {

    render() {
        return (
            <div className={`offline-wrapper ${(this.props.isOnline && !this.props.isSafari) ? '' : 'show-offline-wrapper'}`}>
                <img src={logoicon} alt="" srcSet="" />
                {this.props.isSafari
                    ? (
                        <Fragment>
                            <div className="offline-title">
                                We do not support Safari yet  :(
                            </div>
                            <div className="offline-description">
                                Try OpenBeats using <strong>Google Chrome</strong> to get lifetime access to unlimited songs for free. Hurry now !!!
                            </div>
                        </Fragment>
                    ) : (
                        <Fragment>
                            <div className="offline-title">
                                Seems like you are offline!
                            </div>
                            <div className="offline-description">
                                OpenBeats will automatically resume once you are online!
                            </div>
                            <div className="offline-fallback-block">if not <a href="/">click here</a> to reload</div>
                        </Fragment>
                    )
                }

            </div>
        );
    }

}

const mapStateToProps = (state) => {
    return {
        isOnline: state.offlineReducer.isOnline,
        isSafari: state.offlineReducer.isSafari
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
