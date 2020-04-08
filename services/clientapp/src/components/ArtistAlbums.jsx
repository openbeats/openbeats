import React, { Component } from 'react';
import { toastActions, coreActions } from "../actions";
import "../css/artistalbums.css";
import { connect } from "react-redux";
import { push } from "connected-react-router";
import { musicDummy } from '../images';

class ArtistAlbums extends Component {
    componentDidMount() {
        this.props.setCurrentAction("Artist Albums")
    }
    render() {
        return (
            <div className="artist-albums-wrapper">
                <div className="artist-albums-header-image-holder" style={{ backgroundImage: `url(), url(${musicDummy})` }}>
                    <div className="artist-albums-artist-name">A R Rahman</div>
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

export default connect(mapStateToProps, mapDispatchToProps)(ArtistAlbums);
