import React, { Component } from 'react';
import { toastActions, coreActions } from "../actions";
import "../css/artists.css";
import { connect } from "react-redux";
import { push } from "connected-react-router";
import { musicDummy } from '../images';

class Artists extends Component {
    componentDidMount() {
        this.props.setCurrentAction("Artists")
    }
    render() {
        return (
            <div className="artists-wrapper">
                <div className="artist-display-holder cursor-pointer">
                    <div className="artist-rounded-circle-holder" style={{ backgroundImage: `url(''), url(${musicDummy})` }}></div>
                    <div className="artist-name">A R Rahman</div>
                    <div className="artist-description">Artist</div>
                </div>
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
        push: (path) => {
            dispatch(push(path))
        },
        notify: (message) => {
            toastActions.showMessage(message)
        },
        featureNotify: () => {
            toastActions.featureNotify()
        },
        setCurrentAction: (action) => {
            dispatch(coreActions.setCurrentAction(action))
        },
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Artists);
