import React, { Component } from 'react'
import "../css/playlistdisplay.css";
import { toastActions, coreActions } from "../actions";
import { connect } from "react-redux";
import { push } from "connected-react-router";

class PlaylistDisplay extends Component {

    componentDidMount() {
        this.props.setCurrentAction("Playlist");
    }


    render() {
        return (
            <div className="playlist-display-wrapper">

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
        }

    }
}

export default connect(mapStateToProps, mapDispatchToProps)(PlaylistDisplay);