import React, { Component } from 'react';
import "../assets/styles/albumsdash.css";
import { ChipsInput, SongSearcher, SongsBucket } from '.';
import { connect } from 'react-redux';
import { addArtistActions, addSearchTagActions } from '../actions';
import { store } from '../store';
import { push } from 'connected-react-router';
import { variables } from '../config';
import { findIndex } from 'lodash';
import { toast } from 'react-toastify';

class AlbumsDash extends Component {
    constructor(props) {
        super(props);
        this.state = {
            albumName: '',
            artistChips: [],
            searchChips: [],
            songsCollection: [],
            isUpdate: false,
            updateAlbumId: null
        }
    }

    setArtistChips = (chips) => {
        const chipsId = chips.map(item => item._id);
        this.setState({ artistChips: chipsId });
    }

    setSearchChips = (chips) => {
        const chipsId = chips.map(item => item._id);
        this.setState({ searchChips: chipsId });
    }

    createNewArtist = async (artistStringName) => {
        const data = await this.props.toggleAddArtistDialog(artistStringName);
        return data;
    }

    createNewSearchTag = async (searchString) => {
        const data = await this.props.addSearchTagHandler(searchString);
        return data;
    }

    albumsDashCancelHandler = () => {
        this.props.pushPath("/albums");
    }

    removeSongFromBucketCallBack = (index) => {
        let editSongsCollection = this.state.songsCollection;
        editSongsCollection.splice(index, 1);
        this.setState({ songsCollection: editSongsCollection });
    }

    emptyTheBucketCallBack = () => {
        this.setState({ songsCollection: [] })
    }

    addSongsToTheBucketCallBack = (song) => {
        if (findIndex(this.state.songsCollection, song) === -1)
            this.setState({ songsCollection: [...this.state.songsCollection, song] });
        else
            toast.error("Song is Already in the bucket!");
    }
    arrangeSongsCallBack = (songs) => {
        this.setState({ songsCollection: songs });
    }

    componentWillUnmount() {
        this.setState({ albumName: '', artistChips: [], searchChips: [] })
    }


    render() {
        return (
            <div className="albumsdash-wrapper">
                <div className="albumsdash-header">
                    <div className="albumsdash-indicator d-flex align-items-center font-weight-bold base-color h5-responsive">
                        <i className="fas fa-angle-right mr-1 right-angel"></i>Albums Dash Yard
                    </div>
                    <div className="d-flex">
                        <div className="create-album-link font-weight-bold mr-3 cursor-pointer" >save</div>
                        <div className="create-album-link bg-danger font-weight-bold cursor-pointer" onClick={this.albumsDashCancelHandler} >cancel</div>
                    </div>
                </div>
                <div className="albumdash-container">
                    <div className="albumdash-container-left-pan">
                        <div className="albumdash-album-content-holder p-4">
                            <div className="albumdash-name-holder">
                                <div className="font-weight-bold">
                                    Album Name<span className="text-danger">*</span>
                                </div>
                                <div className="mb-1">
                                    (max 30 Characters)
                                </div>
                                <input className="rounded w-100" placeholder="This is Yuvan Shankar Raja" type="text" />
                            </div>
                            <div className="albumdash-artist-tags-holder mt-2">
                                <div className="artist-tags-title font-weight-bold">Artist Tags<span className="text-danger">*</span></div>
                                <div className="artist-tags-title-desc">(Please add only one artist, if you want this album to comes under specific Artist)</div>
                                <ChipsInput
                                    chipTitle={'Artist'}
                                    setChipsCallback={this.setArtistChips}
                                    suggestionFetchUrl={`${variables.baseUrl}/playlist/artist/fetch?startsWith=`}
                                    suggestionNameField={'name'}
                                    createNewChipCallback={this.createNewArtist}
                                    placeholder={"Search Artist Here..."}
                                />
                            </div>
                            <div className="albumdash-artist-tags-holder mt-2">
                                <div className="artist-tags-title font-weight-bold">Search Tags<span className="text-danger">*</span></div>
                                <div className="artist-tags-title-desc">(Please add Search Tags related to this album)</div>
                                <ChipsInput
                                    chipTitle={'Search Tag'}
                                    setChipsCallback={this.setSearchChips}
                                    suggestionFetchUrl={`${variables.baseUrl}/playlist/searchtag/fetch?startsWith=`}
                                    suggestionNameField={'searchVal'}
                                    createNewChipCallback={this.createNewSearchTag}
                                    placeholder={"Search Search Tags Here..."}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="albumdash-container-right-pan">
                        <div className="albumdash-search-holder">
                            <SongSearcher
                                searchStringSuggestionFetchUrl={"https://api.openbeats.live/suggester?k="}
                                songSuggestionFetchUrl={"https://api.openbeats.live/ytcat?q="}
                                addSongsToTheBucketCallBack={this.addSongsToTheBucketCallBack}
                            />
                        </div>
                        <div className="albumdash-song-bucket-holder">
                            <SongsBucket
                                songsBucket={this.state.songsCollection}
                                removeSongFromBucketCallBack={this.removeSongFromBucketCallBack}
                                emptyTheBucketCallBack={this.emptyTheBucketCallBack}
                                arrangeSongsCallBack={this.arrangeSongsCallBack}
                            />
                        </div>
                    </div>
                </div>
            </div>
        )
    }

}

const mapStateToProps = (state) => {
    return {}
}


const mapDispatchToProps = (dispatch) => {
    return {
        pushPath: (path) => {
            store.dispatch(push(path));
        },
        toggleAddArtistDialog: (artistName) => {
            return addArtistActions.toggleAddArtistDialog(true, artistName);
        },
        addSearchTagHandler: (searchVal) => {
            return addSearchTagActions.addSearchTagHandler(searchVal);
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(AlbumsDash);