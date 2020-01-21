import React, { Component } from "react";
import "../css/yourplaylist.css";
import { push } from "connected-react-router";
import { connect } from "react-redux";
import { toastActions, coreActions } from "../actions";

class YourPlaylist extends Component {
    componentDidMount() {
        this.props.setCurrentAction("Your Playlists")

    }
    render() {
        return (
            <div>
                Your Playlist
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {

    };
};

const mapDispatchToProps = dispatch => {
    return {
        push: path => {
            dispatch(push(path));
        },
        featureNotify: () => {
            toastActions.featureNotify();
        },
        setCurrentAction: (action) => {
            dispatch(coreActions.setCurrentAction(action))
        },

    };
};

export default connect(mapStateToProps, mapDispatchToProps)(YourPlaylist);

