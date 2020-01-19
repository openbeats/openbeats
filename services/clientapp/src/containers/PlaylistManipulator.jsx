import React, { Component } from 'react';
import "../css/playlistmanipulator.css";
import { connect } from "react-redux";
import { toastActions, coreActions, playlistManipulatorActions } from "../actions";

class PlaylistManipulator extends Component {

    constructor(props) {
        super(props);
        this.state = {
            showCreateNewPlaylistTextInputField: false
        };

        this.escKeyListener = this.escKeyListener.bind(this);
    }

    componentDidMount() {
        document.addEventListener("keyup", this.escKeyListener)

    }

    escKeyListener(e) {
        if (e.keyCode === 27) {
            this.props.clearAddPlaylistDialog()
        }
    }

    componentWillUnmount() {
        document.removeEventListener("keyup", this.escKeyListener)
    }

    render() {
        return (
            <div className="pm-wrapper">
                <div className="pm-mani-holder">
                    <div className="pm-main-header">
                        Add to Playlist
                    </div>
                    <div onClick={() => this.props.clearAddPlaylistDialog()} className="pm-close-button-holder cursor-pointer">
                        <i className="fas fa-times"></i>
                    </div>
                    <div className="pm-create-new-playlist-holder cursor-pointer">
                        <i className="fas fa-plus"></i> Create New Playlist
                    </div>
                    <div className="pm-core-playlist-holder">
                        <div className="pm-core-playlist-item-holer">
                            <label className="pm-core-playlist-container">One
                                    <input type="checkbox" />
                                <span className="pm-core-playlist-checkmark"></span>
                            </label>
                        </div>
                    </div>

                </div>
            </div>
        )
    }
}


const mapStateToProps = (state) => {
    return {
        showAddPlaylistDialog: state.playlistManipulatorReducer.showAddPlaylistDialog,
        currentSong: state.playlistManipulatorReducer.currentSong
    }

}

const mapDispatchToProps = (dispatch) => {
    return {
        featureNotify: () => {
            toastActions.featureNotify();
        },
        notify: (message) => {
            toastActions.showMessage(message);
        },
        setCurrentAction: (action) => {
            dispatch(coreActions.setCurrentAction(action));
        },
        clearAddPlaylistDialog: () => {
            playlistManipulatorActions.clearAddPlaylistDialog();
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(PlaylistManipulator);
