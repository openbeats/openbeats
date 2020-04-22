import React, { Component } from 'react';
import "../assets/css/playlistmanipulator.css";
import { connect } from "react-redux";
import { toastActions, coreActions, playlistManipulatorActions, searchActions } from "../actions";

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
        this.props.fetchUserPlaylistMetadata(this.props.userDetails.id)
    }

    escKeyListener(e) {
        if (e.keyCode === 27) {
            if (this.state.showCreateNewPlaylistTextInputField) {
                this.setState({ showCreateNewPlaylistTextInputField: false })
            } else
                this.props.clearAddPlaylistDialog()
        }
    }

    componentWillUnmount() {
        document.removeEventListener("keyup", this.escKeyListener)
        this.props.updateTyping(false)
    }

    render() {
        return (
            <div className="pm-wrapper">
                <div className="pm-mani-holder">
                    <div className="pm-main-header">
                        Add to Playlist
                    </div>
                    <div onClick={() => {
                        this.props.clearAddPlaylistDialog()
                        this.props.updateTyping(false)
                    }} className="pm-close-button-holder cursor-pointer">
                        <i className="fas fa-times"></i>
                    </div>
                    {this.state.showCreateNewPlaylistTextInputField ?
                        <form className="pm-create-new-playlist-holder playlist-text-input-container" id="inp-form" onSubmit={(e) => {
                            e.preventDefault()
                            const inpFrm = document.getElementById("inp-form");
                            let pName = inpFrm.elements[0].value;
                            if (pName.length > 0) {
                                let success = this.props.createNewPlaylist(this.props.userDetails.id, pName);
                                if (success) {
                                    this.setState({ showCreateNewPlaylistTextInputField: false })
                                    this.props.updateTyping(false)
                                }
                            } else {
                                this.props.notify("Playlist Name is Empty!")
                            }
                        }}>
                            <input type="text" name="pname" autoFocus placeholder="Playlist Name" />
                            <button type="submit" className="upst-submit-btn cursor-pointer">
                                <i className="fas fa-check" type="submit"></i>
                            </button>
                            <div className="upst-div"></div>
                            <i className="fas fa-times upst-close-btn cursor-pointer" onClick={() => {
                                this.props.updateTyping(false)
                                this.setState({ showCreateNewPlaylistTextInputField: false })
                            }}></i>
                        </form>
                        : <div className="pm-create-new-playlist-holder cursor-pointer" onClick={e => {
                            this.props.updateTyping(true)
                            this.setState({ showCreateNewPlaylistTextInputField: true })
                        }}>
                            <i className="fas fa-plus"></i> Create New Playlist
                    </div>
                    }
                    <div className="pm-core-playlist-holder">
                        {this.props.userPlaylistMetaData.length > 0 && this.props.userPlaylistMetaData.map((item, key) => (
                            <div className="pm-core-playlist-item-holer" key={key}>
                                <label className="pm-core-playlist-container">{item.name}
                                    <input type="checkbox" onChange={(e) => {
                                        if (e.target.checked)
                                            this.props.addSongToPlaylist(item._id, this.props.currentSong)
                                        // else
                                        //     this.props.removeSongFromPlaylist(item._id, this.props.currentSong)
                                    }} />
                                    <span className="pm-core-playlist-checkmark"></span>
                                </label>
                            </div>
                        ))
                        }
                    </div>

                </div>
            </div>
        )
    }
}


const mapStateToProps = (state) => {
    return {
        showAddPlaylistDialog: state.playlistManipulatorReducer.showAddPlaylistDialog,
        currentSong: state.playlistManipulatorReducer.currentSong,
        userPlaylistMetaData: state.playlistManipulatorReducer.userPlaylistMetaData,
        userDetails: state.authReducer.userDetails
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
        },
        fetchUserPlaylistMetadata: (userId) => {
            playlistManipulatorActions.fetchUserPlaylistMetadata(userId);
        },
        addSongToPlaylist: (pId, song) => {
            playlistManipulatorActions.addSongToPlaylist(pId, song);
        },
        removeSongFromPlaylist: (pId, song) => {
            playlistManipulatorActions.removeSongFromPlaylist(pId, song);
        },
        createNewPlaylist: (userId, name) => {
            return playlistManipulatorActions.createNewPlaylist(userId, name);
        },
        updateTyping: (isTyping) => {
            dispatch(searchActions.updateTyping(isTyping));
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(PlaylistManipulator);
