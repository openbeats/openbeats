import React, { Component } from "react";
import "../assets/styles/songsearcher.css";
import axios from "axios";

export default class SongSearcher extends Component {
	constructor(props) {
		super(props);
		this.state = {
			suggestionStringArray: [],
			suggestionString: "",
			searchStringSuggestionFetchUrl:
				this.props.searchStringSuggestionFetchUrl || null,
			songSuggestionFetchUrl: this.props.songSuggestionFetchUrl || null,
			songsCollection: [],
			suggestionCurrentIndex: 0,
		};
		this.suggestionBlockRef = null;
		this.inputSearchRef = null;
	}

	fetchSearchStringSuggestion = async () => {
		if (
			this.state.searchStringSuggestionFetchUrl &&
			this.state.suggestionString.length
		) {
			document.removeEventListener("click", this.clearSuggestionInputListener);
			document.removeEventListener("keyup", this.clearSuggestionInputListener);
			let suggestionData = (
				await axios.get(
					this.state.searchStringSuggestionFetchUrl +
						this.state.suggestionString,
				)
			).data;
			this.setState({
				suggestionStringArray: [
					this.state.suggestionString,
					...suggestionData.data.slice(0, 5),
				],
				suggestionCurrentIndex: 0,
			});
			document.addEventListener("click", this.clearSuggestionInputListener);
			document.addEventListener("keyup", this.clearSuggestionInputListener);
		}
	};

	fetchSongSuggestion = async () => {
		document.removeEventListener("click", this.clearSuggestionInputListener);
		document.removeEventListener("keyup", this.clearSuggestionInputListener);

		await this.setState({
			suggestionString: this.state.suggestionStringArray[
				this.state.suggestionCurrentIndex
			][0],
		});
		console.log(this.state.suggestionString);
		if (this.state.songSuggestionFetchUrl) {
			let suggestionData = (
				await axios.get(
					this.state.songSuggestionFetchUrl + this.state.suggestionString,
				)
			).data;
			this.setState({
				songsCollection: suggestionData.data,
				suggestionStringArray: [],
			});
		}
	};

	playSongTrial = (index) => {
		this.props.songTrialTrigger(this.state.songsCollection[index]);
	};

	addSongToBucket = (index) => {
		this.props.addSongsToTheBucketCallBack(this.state.songsCollection[index]);
	};

	clearSuggestionInputListener = (event) => {
		if (
			event.keyCode === 27 ||
			!this.suggestionBlockRef.contains(event.target)
		) {
			this.setState({
				suggestionStringArray: [],
				suggestionString: "",
				suggestionCurrentIndex: 0,
			});
			document.removeEventListener("click", this.clearSuggestionInputListener);
			document.removeEventListener("keyup", this.clearSuggestionInputListener);
		} else if (event.keyCode === 40) {
			this.setState({
				suggestionCurrentIndex:
					this.state.suggestionCurrentIndex + 1 <
					this.state.suggestionStringArray.length
						? this.state.suggestionCurrentIndex + 1
						: 0,
			});
		} else if (event.keyCode === 38) {
			this.setState({
				suggestionCurrentIndex:
					this.state.suggestionCurrentIndex - 1 >= 0
						? this.state.suggestionCurrentIndex - 1
						: this.state.suggestionStringArray.length - 1,
			});
		} else if (
			event.keyCode === 13 &&
			this.state.suggestionStringArray.length
		) {
			this.fetchSongSuggestion();
		}
	};

	componentWillUnmount() {
		this.setState({
			suggestionFetchUrl: "",
			suggestionString: "",
			songsCollection: [],
		});
	}

	render() {
		return (
			<div className="song-searcher-wrapper">
				<div className="song-searcher-header">
					<div
						className="song-searcher-header-input"
						ref={(d) => (this.suggestionBlockRef = d)}>
						<input
							type="text"
							ref={(d) => (this.inputSearchRef = d)}
							onChange={async (e) => {
								await this.setState({ suggestionString: e.target.value });
								this.fetchSearchStringSuggestion();
							}}
							value={this.state.suggestionString}
							placeholder="Search Songs here..."
						/>
						<i className="fas fa-search song-searcher-search-icon-holder"></i>
						<div className="song-searcher-search-suggestion-holder">
							{this.state.suggestionStringArray.map((item, key) => {
								return (
									key !== 0 && (
										<div
											className={`song-searcher-search-suggestion-node cursor-pointer ${
												this.state.suggestionCurrentIndex === key
													? "bg-dark text-white"
													: ""
											}`}
											onClick={async () => {
												await this.setState({ suggestionCurrentIndex: key });
												this.fetchSongSuggestion();
											}}
											key={key}>
											{item[0]}
										</div>
									)
								);
							})}
						</div>
					</div>
				</div>
				<div className="song-searcher-body">
					{this.state.songsCollection.length === 0 && (
						<div
							className="song-searcher-empty-result-message font-weight-bold"
							onClick={() => {
								this.inputSearchRef.focus();
							}}>
							Search Songs Here!
						</div>
					)}
					{this.state.songsCollection.length !== 0 && (
						<div className="song-searcher-search-result-holder">
							{this.state.songsCollection.map((item, key) => (
								<div className="song-searcher-search-result-node" key={key}>
									<div className="song-searcher-song-thumbnail-holder">
										<div
											className="song-searcher-song-thumbnail"
											style={{
												backgroundImage: `url(${item.thumbnail})`,
											}}></div>
									</div>
									<div className="song-searcher-actions ml-3">
										<i
											className="fas fa-play-circle shadow cursor-pointer ml-1"
											onClick={() => this.playSongTrial(key)}></i>
										<i
											className="fas fa-plus-circle shadow cursor-pointer ml-4"
											onClick={() => this.addSongToBucket(key)}></i>
									</div>
									<div className="font-weight-bold ml-4">{item.title}</div>
								</div>
							))}
						</div>
					)}
				</div>
			</div>
		);
	}
}
