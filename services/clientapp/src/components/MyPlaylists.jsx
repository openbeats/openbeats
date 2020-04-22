import React, { Component } from "react";
import "../assets/css/myplaylists.css";
import { push } from "connected-react-router";
import { connect } from "react-redux";
import { toastActions, coreActions, playlistManipulatorActions, nowPlayingActions } from "../actions";
import { musicDummy, playlistSvg, pQueueWhite } from "../assets/images";

class MyPlaylists extends Component {

    constructor(props) {
        super(props);
        this.state = {
            editId: null,
            editedName: null
        }
    }

    componentDidMount() {
        this.props.setCurrentAction("My Playlists")
        this.props.fetchUserPlaylistMetadata(this.props.userDetails.id);
    }

    render() {
        return (
            <div className="my-playlists-wrapper">
                {this.props.userPlaylistMetaData.map((item, key) => (
                    <div className="playlist-panel-wrapper" key={key}>
                        <div className="playlist-panel-image cursor-pointer" title="Play All songs!" onClick={() => this.props.push(`/playlist/user/${item._id}`)} style={{ backgroundImage: `url(${item.thumbnail ? item.thumbnail : musicDummy})` }}>
                            <div className="playlist-total-songs-display">
                                <img src={playlistSvg} alt="" srcSet="" />
                                <p>{item.totalSongs}</p>
                            </div>
                        </div>
                        <div className="playlist-panel-name">
                            {this.state.editId === item._id ?
                                <form onSubmit={async (e) => {
                                    e.preventDefault();
                                    if (await this.props.changeUserPlaylistName(this.state.editId, this.state.editedName)) {
                                        await this.setState({ editedName: null, editId: null })
                                        await this.props.fetchUserPlaylistMetadata(this.props.userDetails.id);
                                    }
                                }} className="playlist-panel-edit-name">
                                    <input placeholder="Playlist Name" type="text" value={this.state.editedName} onChange={(e) => this.setState({ editedName: e.target.value })} />
                                    <div className="playlist-panel-edit-options">
                                        <button className="cursor-pointer" type="submit"><i className="fas fa-check"></i></button>
                                        <button className="cursor-pointer" onClick={() => this.setState({ editId: null })}><i className="fas fa-times"></i></button>
                                    </div>
                                </form>
                                :
                                <div className="playlist-panel-name">
                                    {item.name}
                                    <i className="fas fa-pencil-alt cursor-pointer" onClick={() => this.setState({ editId: item._id, editedName: item.name })} title="Edit Playlist Name"></i>
                                </div>
                            }
                        </div>
                        <div className="playlist-panel-options">
                            <div className="p-options">
                                <div className="p-options-icon-holder">
                                    <i className="fas fa-play cursor-pointer" onClick={() => this.props.push(`/playlist/user/${item._id}?autoplay=true`)} title="Play"></i>
                                </div>
                                <div className="p-options-icon-holder">
                                    <i className="fas fa-random cursor-pointer" onClick={() => this.props.featureNotify()} title="Shuffle Play"></i>
                                </div>
                                <div className="p-options-icon-holder">
                                    <img className="cursor-pointer action-image-size" title="Add to Queue" onClick={() => this.props.addSongsToQueue(item._id)} src={pQueueWhite} alt="" srcSet="" />
                                </div>
                            </div>
                            <div className="p-options">
                                <div className="p-options-icon-holder">
                                    {/* <i className="fas fa-unlock cursor-pointer"></i> */}
                                    {/* <i className="fas fa-globe-americas cursor-pointer" title="Make Playlist Public"></i> */}
                                    <i className="fas fa-lock cursor-pointer" onClick={() => this.props.featureNotify()} title="Make Playlist Private"></i>
                                </div>
                                <div className="p-options-icon-holder">
                                    <i className="fas fa-trash-alt cursor-pointer" title="Delete Playlist" onClick={() => this.props.deleteUserPlaylist(item._id)}></i>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        userDetails: state.authReducer.userDetails,
        userPlaylistMetaData: state.playlistManipulatorReducer.userPlaylistMetaData,
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
        fetchUserPlaylistMetadata: (uId) => {
            playlistManipulatorActions.fetchUserPlaylistMetadata(uId);
        },
        deleteUserPlaylist: (pId) => {
            playlistManipulatorActions.deleteUserPlaylist(pId);
        },
        changeUserPlaylistName: (_id, playlistName) => {
            return playlistManipulatorActions.changeUserPlaylistName(_id, playlistName);
        },
        addSongsToQueue: async (pId) => {
            const data = await playlistManipulatorActions.fetchUserPlaylist(pId);
            if (data && data.status && data.data.songs.length) {
                nowPlayingActions.addSongsToQueue(data.data.songs);
            } else {
                toastActions.showMessage("Playlist you tried to add to the queue.. seems to be empty!")
            }
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MyPlaylists);

