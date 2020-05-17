import React, { Component } from "react";
import "../assets/styles/albumsdash.css";
import { ChipsInput, SongSearcher, SongsBucket } from ".";
import { connect } from "react-redux";
import { addSearchTagActions, hangingPlayerActions, toggleResourceDialog } from "../actions";
import { store } from "../store";
import { push } from "connected-react-router";
import { variables } from "../config";
import { findIndex } from "lodash";
import { toast } from "react-toastify";
import queryString from "query-string";
import axios from "axios";

class AlbumsDash extends Component {
	constructor(props) {
		super(props);
		this.state = {
			albumBy: null,
			albumName: "",
			artistChips: [],
			searchChips: [],
			languageChips: [],
			emotionChips: [],
			songsCollection: [],
			artistChipsCollection: [],
			searchChipsCollection: [],
			languageChipsCollection: [],
			emotionChipsCollection: [],
			isUpdate: false,
			updateAlbumId: null,
		};
	}

	async componentDidMount() {
		const parsed = queryString.parse(window.location.search);
		if (parsed.editalbum !== undefined) {
			const albumData = (await axios.get(`${variables.baseUrl}/playlist/album/${parsed.editalbum}?edit=true`)).data;
			if (albumData.status) {
				let prepareData = {
					isUpdate: true,
					updateAlbumId: parsed.editalbum,
					songsCollection: albumData.data.songs,
					albumName: albumData.data.name,
					artistChipsCollection: albumData.data.featuringArtists,
					searchChipsCollection: albumData.data.searchTags,
					artistChips: albumData.data.featuringArtists.map(item => item._id),
					searchChips: albumData.data.searchTags.map(item => item._id),
				};
				if (albumData.data.albumBy !== null) {
					prepareData.artistChipsCollection = [...prepareData.artistChipsCollection, albumData.data.albumBy];
					prepareData.artistChips = [...prepareData.artistChips, albumData.data.albumBy._id];
					prepareData.albumBy = albumData.data.albumBy._id;
				}
				this.setState({ ...prepareData });
			} else {
				toast.error("Something Went Wrong!");
				this.props.pushPath("/albums");
			}
		}
	}

	saveAlbum = async () => {
		if (
			this.state.albumName.length > 0 &&
			this.state.songsCollection.length > 0 &&
			this.state.artistChips.length > 0 &&
			this.state.searchChips.length > 0
		) {
			const preparedData = {
				name: this.state.albumName,
				searchTags: this.state.searchChips,
				searchVals: this.state.searchChipsCollection.map(item => item.searchVal),
				featuringArtists: this.state.artistChips.length === 1 ? [] : this.state.artistChips.filter(artistId => artistId !== this.state.albumBy),
				albumBy: this.state.artistChips.length === 1 ? this.state.artistChips[0] : this.state.albumBy,
				songs: this.state.songsCollection,
			};
			console.log(JSON.stringify(preparedData));

			if (!this.state.isUpdate) {
				const resultData = (await axios.post(`${variables.baseUrl}/playlist/album/create`, preparedData)).data;
				if (resultData.status) {
					toast.success("Album Created Successfully");
					this.props.pushPath("/albums");
				} else {
					toast.error(resultData.data.toString());
				}
			} else {
				const resultData = (await axios.put(`${variables.baseUrl}/playlist/album/${this.state.updateAlbumId}`, preparedData)).data;
				if (resultData.status) {
					toast.success("Album Saved Successfully");
					this.props.pushPath("/albums");
				} else {
					toast.error(resultData.data.toString());
				}
			}
		} else {
			this.state.albumName.length === 0 && toast.error("Album Name is Missing!");
			this.state.songsCollection.length === 0 && toast.error("Songs Bucket is Empty!");
			this.state.artistChips.length === 0 && toast.error("Artist Tags is Empty!");
			this.state.searchChips.length === 0 && toast.error("Search Tags is Empty!");
		}
	};

	setArtistChips = chips => {
		const chipsId = chips.map(item => item._id);
		this.setState({ artistChipsCollection: chips, artistChips: chipsId });
	};

	setAlbumBy = artistId => {
		this.setState({ albumBy: artistId });
	};

	setSearchChips = chips => {
		const chipsId = chips.map(item => item._id);
		this.setState({ searchChipsCollection: chips, searchChips: chipsId });
	};

	setLanguageChips = chips => {
		const chipsId = chips.map(item => item._id);
		this.setState({ languageChipsCollection: chips, languageChips: chipsId });
	}

	setEmotionChips = chips => {
		const chipsId = chips.map(item => item._id);
		this.setState({ emotionChipsCollection: chips, emotionChips: chipsId });
	}

	createNewArtist = async artistStringName => {
		const data = await this.props.toggleResourceDialog(artistStringName, "Artist");
		return data;
	};

	createNewSearchTag = async searchString => {
		const data = await this.props.addSearchTagHandler(searchString);
		return data;
	};

	createNewLanguage = async language => {
		const data = await this.props.toggleResourceDialog(language, "Language");
		return data;
	}

	createNewEmotion = async emotion => {
		const data = await this.props.toggleResourceDialog(emotion, "Emotion");
		return data;
	}

	albumsDashCancelHandler = () => {
		this.props.pushPath("/albums");
	};

	removeSongFromBucketCallBack = index => {
		let editSongsCollection = this.state.songsCollection;
		editSongsCollection.splice(index, 1);
		this.setState({ songsCollection: editSongsCollection });
	};

	emptyTheBucketCallBack = () => {
		this.setState({ songsCollection: [] });
	};

	addSongsToTheBucketCallBack = async song => {
		if (findIndex(this.state.songsCollection, song) === -1) {
			await this.setState({ songsCollection: [...this.state.songsCollection, song] });
			toast.info(<p>Song has been added to bucket.<br />Total count <strong>{this.state.songsCollection.length}</strong></p>);
		} else {
			toast.error("Song is Already in the bucket!");
		}
	};

	arrangeSongsCallBack = songs => {
		this.setState({ songsCollection: songs });
	};

	componentWillUnmount() {
		this.setState({ albumName: "", artistChips: [], searchChips: [], albumBy: null });
	}

	songTrialTrigger = async song => {
		await this.props.setHangingPlayerSongData(song);
		await this.props.initHangingPlayer();
		await this.props.toggleHangingPlayer(true);
	};

	render() {
		return (
			<div className="albumsdash-wrapper">
				<div className="albumsdash-header">
					<div className="albumsdash-indicator d-flex align-items-center font-weight-bold base-color h5-responsive">
						<i className="fas fa-angle-right mr-1 right-angel"></i>Albums Dash Yard
					</div>
					<div className="d-flex">
						<div className="create-album-link font-weight-bold mr-3 cursor-pointer" onClick={this.saveAlbum}>
							save
						</div>
						<div className="create-album-link bg-danger font-weight-bold cursor-pointer" onClick={this.albumsDashCancelHandler}>
							cancel
						</div>
					</div>
				</div>
				<div className="albumdash-container">
					<div className="albumdash-container-left-pan">
						<div className="albumdash-album-content-holder p-4">
							<div className="albumdash-name-holder">
								<div className="font-weight-bold">
									Album Name<span className="text-danger">*</span>
								</div>
								<div className="mb-1">(max 30 Characters)</div>
								<input
									className="rounded w-100"
									value={this.state.albumName}
									onChange={e => this.setState({ albumName: e.target.value })}
									placeholder="This is Yuvan Shankar Raja"
									type="text"
								/>
							</div>
							<div className="albumdash-artist-tags-holder mt-2">
								<div className="artist-tags-title font-weight-bold">
									Artist Tags<span className="text-danger">*</span>
								</div>
								<div className="artist-tags-title-desc">(Tap on the crown badge, if you want this album to comes under specific artist's releases,
								by default if only one artist tag is selected, album will be in that artist's releases)</div>
								<ChipsInput
									chipTitle={"Artist"}
									albumBy={this.state.albumBy}
									setAlbumBy={this.setAlbumBy}
									setChipsCallback={this.setArtistChips}
									suggestionFetchUrl={`${variables.baseUrl}/playlist/artist/suggest?query=`}
									suggestionNameField={"name"}
									createNewChipCallback={this.createNewArtist}
									placeholder={"Search Artist Here..."}
									chipCollection={this.state.artistChipsCollection}
								/>
							</div>
							<div className="albumdash-artist-tags-holder mt-2">
								<div className="artist-tags-title font-weight-bold">
									Languages
								</div>
								<div className="artist-tags-title-desc">(Please add Languages related to this album)</div>
								<ChipsInput
									chipTitle={"Language"}
									setChipsCallback={this.setLanguageChips}
									suggestionFetchUrl={`${variables.baseUrl}/playlist/language/fetch?startsWith=`}
									suggestionNameField={"name"}
									createNewChipCallback={this.createNewLanguage}
									placeholder={"Search Languages Here..."}
									chipCollection={this.state.languageChipsCollection}
								/>
							</div>
							<div className="albumdash-artist-tags-holder mt-2">
								<div className="artist-tags-title font-weight-bold">
									Emotions
								</div>
								<div className="artist-tags-title-desc">(Please add Emotions related to this album)</div>
								<ChipsInput
									chipTitle={"Search Tag"}
									setChipsCallback={this.setEmotionChips}
									suggestionFetchUrl={`${variables.baseUrl}/playlist/emotion/fetch?startsWith=`}
									suggestionNameField={"name"}
									createNewChipCallback={this.createNewEmotion}
									placeholder={"Search Emotions Here..."}
									chipCollection={this.state.emotionChipsCollection}
								/>
							</div>
							<div className="albumdash-artist-tags-holder mt-2">
								<div className="artist-tags-title font-weight-bold">
									Search Tags<span className="text-danger">*</span>
								</div>
								<div className="artist-tags-title-desc">(Please add Search Tags related to this album)</div>
								<ChipsInput
									chipTitle={"Search Tag"}
									setChipsCallback={this.setSearchChips}
									suggestionFetchUrl={`${variables.baseUrl}/playlist/searchtag/fetch?startsWith=`}
									suggestionNameField={"searchVal"}
									createNewChipCallback={this.createNewSearchTag}
									placeholder={"Search Search Tags Here..."}
									chipCollection={this.state.searchChipsCollection}
								/>
							</div>
							<div className="albumdash-artist-tags-holder mt-2 display-flex">
								<div>
									<div className="artist-tags-title font-weight-bold">
										Custom Album
								</div>
									<div className="artist-tags-title-desc">(Toggle if this album is Custom made)</div>
								</div>
								<label className="switch">
									<input type="checkbox" />
									<span className="slider round"></span>
								</label>
							</div>
						</div>
					</div>
					<div className="albumdash-container-right-pan">
						<div className="albumdash-search-holder">
							<SongSearcher
								searchStringSuggestionFetchUrl={`${variables.baseUrl}/suggester?k=`}
								songSuggestionFetchUrl={`${variables.baseUrl}/ytcat?q=`}
								addSongsToTheBucketCallBack={this.addSongsToTheBucketCallBack}
								songTrialTrigger={this.songTrialTrigger}
							/>
						</div>
						<div className="albumdash-song-bucket-holder">
							<SongsBucket
								songsBucket={this.state.songsCollection}
								removeSongFromBucketCallBack={this.removeSongFromBucketCallBack}
								emptyTheBucketCallBack={this.emptyTheBucketCallBack}
								arrangeSongsCallBack={this.arrangeSongsCallBack}
								songTrialTrigger={this.songTrialTrigger}
							/>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

const mapStateToProps = state => {
	return {};
};

const mapDispatchToProps = dispatch => {
	return {
		pushPath: path => {
			store.dispatch(push(path));
		},
		toggleResourceDialog: (resourceName, resourceType) => {
			const payload = {
				isOpened: true,
				isEdit: false,
				resourceType,
				resourceId: null,
				resourceName,
				resourceImageUrl: "",
			};
			return toggleResourceDialog(payload);
		},
		addSearchTagHandler: searchVal => {
			return addSearchTagActions.addSearchTagHandler(searchVal);
		},
		setHangingPlayerSongData: async songData => {
			return await hangingPlayerActions.setHangingPlayerSongData(songData);
		},
		toggleHangingPlayer: bool => {
			return hangingPlayerActions.toggleHangingplayer(bool);
		},
		initHangingPlayer: async () => {
			return await hangingPlayerActions.initHangingPlayer();
		},
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(AlbumsDash);
