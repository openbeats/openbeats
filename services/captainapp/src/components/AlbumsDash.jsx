import React, { Component } from 'react';
import "../assets/styles/albumsdash.css";
// import axios from "axios";

export default class AlbumsDash extends Component {
    constructor(props) {
        super(props);
        this.state = {
            artistChips: [],
            searchChips: [],
            artistSuggestion: [],
            searchSuggestion: [],
            artistTagSearchString: '',
            searchTagSearchString: ''
        }
        this.artistSuggestionBlockRef = null;
    }

    artistOnChange = async () => {
        document.removeEventListener("click", this.clearArtisStringAndListener);
        document.removeEventListener("keyup", this.clearArtisStringAndListener);
        this.setState({ artistSuggestion: ["Anirudh", "A R Rahman", "Lorem", "Paris"] });
        document.addEventListener("click", this.clearArtisStringAndListener);
        document.addEventListener("keyup", this.clearArtisStringAndListener);

    }

    searchOnChange = () => {

    }

    deleteArtistChip = (index) => {
        let newChips = this.state.artistChips.filter((i, k) => k !== index)
        this.setState({ artistChips: newChips })
    }

    addArtisChip = (index) => {
        let addedNewChip = this.state.artistChips;
        addedNewChip.push(this.state.artistSuggestion[index]);
        this.setState({ artistChips: addedNewChip, artistSuggestion: [], artistTagSearchString: '' })
    }

    clearArtisStringAndListener = (event) => {
        if (event.keyCode === 27 || !this.artistSuggestionBlockRef.contains(event.target)) {
            this.setState({ artistSuggestion: [], artistTagSearchString: "" })
            document.removeEventListener("click", this.clearArtisStringAndListener);
            document.removeEventListener("keyup", this.clearArtisStringAndListener);
        }
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
                        <div className="create-album-link bg-danger font-weight-bold cursor-pointer" >cancel</div>
                    </div>
                </div>
                <div className="albumdash-container">
                    <div className="albumdash-container-left-pan">
                        <div className="albumdash-album-content-holder p-4">
                            <div className="albumdash-name-holder">
                                <div className="font-weight-bold">
                                    Album Name
                                </div>
                                <div className="mb-1">
                                    (max 30 Characters)
                                </div>
                                <input className="rounded w-100" placeholder="This is Yuvan Shankar Raja" type="text" name="" id="" />
                            </div>
                            <div className="albumdash-artist-tags-holder mt-2">
                                <div className="artist-tags-title font-weight-bold">Artist Tags</div>
                                <div className="artist-tags-title-desc">(Please add only one artist, if you want this album to comes under specific Artist)</div>
                                <div className="tag-input-holder mt-1"
                                    ref={d => this.artistSuggestionBlockRef = d}
                                >
                                    <div className="tags-chips-container">
                                        {this.state.artistChips.map((item, key) => {
                                            return <div className="chip-container" key={key}>
                                                <span>{item}</span>
                                                <div className="chip-container-cancel-button cursor-pointer" onClick={() => this.deleteArtistChip(key)}><i className="fas fa-times text-white"></i></div>
                                            </div>
                                        })}
                                    </div>
                                    <div className="tag-input-container"
                                    >
                                        <input type="text" placeholder="Search Artist Here..."
                                            onChange={async (e) => {
                                                await this.setState({ artistTagSearchString: e.target.value })
                                                this.artistOnChange();
                                            }} value={this.state.artistTagSearchString} name="" id="" />
                                        <div className="tag-suggestion-string-holder" >
                                            {this.state.artistSuggestion.map((item, key) => {
                                                return <div className="suggestion-string-node" key={key} onClick={e => this.addArtisChip(key)}>{item}</div>
                                            })}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="albumdash-container-right-pan">
                        <div className="albumdash-search-holder"></div>
                        <div className="albumdash-song-bucket-holder"></div>
                    </div>
                </div>
            </div>
        )
    }
}
