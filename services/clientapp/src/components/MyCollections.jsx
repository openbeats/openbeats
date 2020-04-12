import React, { Component } from 'react';
import Loader from 'react-loader-spinner';
import { push } from 'connected-react-router';
import { toastActions, coreActions, playlistManipulatorActions, nowPlayingActions } from '../actions';
import { connect } from 'react-redux';
import { AlbumHolder } from '.';


class MyCollections extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            myCollections: [],
        }
    }

    async componentDidMount() {
        this.props.setCurrentAction("My Collections")
    }

    albumViewCallBack = async (id) => {
        this.props.push("/playlist/albums/" + id);
    }
    albumPlayCallBack = async (id) => {
        this.props.push("/playlist/albums/" + id + "?autoplay=true");
    }
    albumAddToCurrentQueueCallBack = async (id) => {
        this.props.addSongsToQueue(id);
    }

    addOrRemoveAlbumFromCollectionHandler = (isAdd = true, albumId) => {
        // add remove operation
    }


    render() {
        return this.state.isLoading ?
            <div className="search-preloader">
                <Loader
                    type="ThreeDots"
                    color="#F32C2C"
                    height={80}
                    width={80}
                />
            </div> : this.state.myCollections.length > 0 ?
                <div className="my-playlists-wrapper">
                    {this.state.myCollections.map((item, key) => (
                        <AlbumHolder
                            key={key}
                            albumName={item.name}
                            albumThumbnail={item.thumbnail}
                            albumTotalSongs={item.totalSongs}
                            albumId={item._id}
                            albumCreationDate={new Date(item.createdAt).toDateString()}
                            albumCreatedBy={"OpenBeats"}
                            albumAddToCurrentQueueCallBack={this.albumAddToCurrentQueueCallBack}
                            albumViewCallBack={this.albumViewCallBack}
                            albumPlayCallBack={this.albumPlayCallBack}
                            addOrRemoveAlbumFromCollectionHandler={this.addOrRemoveAlbumFromCollectionHandler}
                            isAuthenticated={this.props.isAuthenticated}
                        />
                    ))}
                </div> :
                <div className="height-100 font-weight-bold d-flex align-items-center justify-content-center text-align-center">No Collections Found! <br /><br /> Explore and Add Albums to your Collections!</div>
    }

}
const mapStateToProps = state => {
    return {
        isAuthenticated: state.authReducer.isAuthenticated
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
        fetchMyCollection: () => {
        },
        addSongsToQueue: async (pId) => {
            const data = await playlistManipulatorActions.fetchAlbumPlaylist(pId);
            if (data && data.status && data.data.songs.length) {
                nowPlayingActions.addSongsToQueue(data.data.songs);
            } else {
                toastActions.showMessage("Playlist you tried to add to the queue.. seems to be empty!")
            }
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(MyCollections);

