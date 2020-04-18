import React, { Component } from 'react';
import Loader from 'react-loader-spinner';
import { push } from 'connected-react-router';
import { toastActions, coreActions, playlistManipulatorActions, nowPlayingActions } from '../actions';
import { connect } from 'react-redux';
import { AlbumHolder } from '.';


class MyCollections extends Component {

    constructor(props) {
        super(props);
        this.initialState = {
            isLoading: true,
            myCollections: [],
        }
        this.state = { ...this.initialState }
    }

    componentDidMount() {
        this.props.setCurrentAction("My Collections");
        this.props.updateAlbumsInTheCollectionMetaData();
        this.fetchMyCollections();

    }

    fetchMyCollections = async () => {
        const data = await this.props.fetchAllAlbumsInTheCollection();
        if (data && data.status) {
            this.setState({ isLoading: false, myCollections: data.data });
        } else {
            this.props.showMessage("Inavlid Request!");
            this.props.push("/");
        }
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

    addOrRemoveAlbumFromCollectionHandler = async (isAdd = true, albumId) => {
        const result = await this.props.addOrRemoveAlbumFromUserCollection(albumId, isAdd);
        if (result) {
            this.fetchMyCollections();
        }
    }

    componentWillUnmount() {
        this.setState(this.initialState)
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
                    {this.state.myCollections.length > 0 && this.state.myCollections.map((item, key) => (
                        <AlbumHolder
                            key={key}
                            albumName={item.name}
                            albumThumbnail={item.thumbnail}
                            albumTotalSongs={item.totalSongs}
                            albumId={item._id}
                            albumCreationDate={new Date(item.createdAt).toDateString()}
                            albumCreatedBy={"OpenBeats"}
                            type={'album'}
                            addOrRemoveAlbumFromCollectionHandler={this.addOrRemoveAlbumFromCollectionHandler}
                            isAuthenticated={this.props.isAuthenticated}
                            isAlbumIsInCollection={this.props.likedPlaylists.indexOf(item._id) === -1 ? false : true}
                        />
                    ))}
                </div> :
                <div className="height-100 font-weight-bold d-flex align-items-center justify-content-center text-align-center">No Collections Found! <br /><br /> Explore and Add Albums to your Collections!</div>
    }

}

const mapStateToProps = state => {
    return {
        isAuthenticated: state.authReducer.isAuthenticated,
        likedPlaylists: state.authReducer.likedPlaylists
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
        showMessage: (message) => {
            toastActions.showMessage(message);
        },
        setCurrentAction: (action) => {
            dispatch(coreActions.setCurrentAction(action))
        },
        fetchAllAlbumsInTheCollection: async () => {
            return await playlistManipulatorActions.fetchAllAlbumsInTheCollection();
        },
        addSongsToQueue: async (pId) => {
            const data = await playlistManipulatorActions.fetchAlbumPlaylist(pId);
            if (data && data.status && data.data.songs.length) {
                nowPlayingActions.addSongsToQueue(data.data.songs);
            } else {
                toastActions.showMessage("Playlist you tried to add to the queue.. seems to be empty!")
            }
        },
        addOrRemoveAlbumFromUserCollection: async (albumId, isAdd = true) => {
            return await playlistManipulatorActions.addOrRemoveAlbumFromUserCollection(albumId, isAdd);
        },
        updateAlbumsInTheCollectionMetaData: () => {
            playlistManipulatorActions.updateAlbumsInTheCollectionMetaData();
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(MyCollections);

