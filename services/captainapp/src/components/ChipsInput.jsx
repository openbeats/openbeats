import React, { Component } from "react";
import "../assets/styles/chipsinput.css";
import axios from "axios";
import { intersectionBy, differenceBy } from "lodash";
import { toast } from "react-toastify";

class ChipsInput extends Component {
	constructor(props) {
		super(props);
		this.state = {
			chipSuggestion: [],
			suggestionString: "",
			suggestionRequestUrl: this.props.suggestionFetchUrl,
			suggestionCurrentIndex: 0,
			suggestionNameField: this.props.suggestionNameField,
		};
		this.suggestionBlockRef = null;
		this.inputRef = null;
	}

	chipSuggestionFetchHandler = async () => {
		if (this.state.suggestionString) {
			document.removeEventListener("click", this.clearSuggestionInputListener);
			document.removeEventListener("keyup", this.clearSuggestionInputListener);
			const chipSuggestionUrl =
				this.state.suggestionRequestUrl + this.state.suggestionString;
			const chipsFromServer = (await axios.get(chipSuggestionUrl)).data;
			if (chipsFromServer.status) {
				if (chipsFromServer.data.length) {
					let setChips = [];
					setChips = intersectionBy(
						chipsFromServer.data,
						this.props.chipCollection,
						"_id"
					);
					setChips = differenceBy(chipsFromServer.data, setChips, "_id");
					this.setState({ chipSuggestion: [...setChips] });
				} else {
					this.setState({ chipSuggestion: ["undefined"] });
				}
				document.addEventListener("click", this.clearSuggestionInputListener);
				document.addEventListener("keyup", this.clearSuggestionInputListener);
			} else {
				toast.error(chipsFromServer.data.toString());
			}
		} else {
			this.setState({ chipSuggestion: [] });
		}
	};

	deleteChip = (index) => {
		this.props.chipCollection[index]["_id"] === this.props.albumBy &&
			this.setAlbumBy(this.props.chipCollection[index]["_id"]);
		let newChips = this.props.chipCollection.filter((i, k) => k !== index);
		this.props.setChipsCallback(newChips);
	};

	setAlbumBy = (id) => {
		this.props.albumBy !== id
			? this.props.setAlbumBy(id)
			: this.props.setAlbumBy(null);
	};

	addChip = (index) => {
		let addedNewChip = this.props.chipCollection;
		addedNewChip.push(this.state.chipSuggestion[index]);
		this.setState({
			chipSuggestion: [],
			suggestionString: "",
			suggestionCurrentIndex: 0,
		});
		this.inputRef && this.inputRef.focus();
		this.props.setChipsCallback(addedNewChip);
	};

	clearSuggestionInputListener = (event) => {
		if (
			event.keyCode === 27 ||
			!this.suggestionBlockRef.contains(event.target)
		) {
			this.setState({
				chipSuggestion: [],
				suggestionString: "",
				suggestionCurrentIndex: 0,
			});
			document.removeEventListener("click", this.clearSuggestionInputListener);
			document.removeEventListener("keyup", this.clearSuggestionInputListener);
		} else if (event.keyCode === 40) {
			this.setState({
				suggestionCurrentIndex:
					this.state.suggestionCurrentIndex + 1 <
					this.state.chipSuggestion.length
						? this.state.suggestionCurrentIndex + 1
						: 0,
			});
		} else if (event.keyCode === 38) {
			this.setState({
				suggestionCurrentIndex:
					this.state.suggestionCurrentIndex - 1 >= 0
						? this.state.suggestionCurrentIndex - 1
						: this.state.chipSuggestion.length - 1,
			});
		} else if (event.keyCode === 13) {
			if (
				this.state.chipSuggestion.length &&
				this.state.chipSuggestion[0] !== "undefined"
			)
				this.addChip(this.state.suggestionCurrentIndex);
		}
	};

	createNewChipHandler = async () => {
		this.setState({ suggestionString: "", chipSuggestion: [] });
		document.removeEventListener("click", this.clearSuggestionInputListener);
		document.removeEventListener("keyup", this.clearSuggestionInputListener);
		const newChipData = await this.props.createNewChipCallback(
			this.state.suggestionString
		);
		if (newChipData.status) {
			await this.setState({ chipSuggestion: [newChipData.data] });
			await this.addChip(0);
		}
	};

	render() {
		return (
			<div
				className="tag-input-holder mt-1"
				ref={(d) => (this.suggestionBlockRef = d)}>
				<div className="tags-chips-container">
					{this.props.chipCollection.map((item, key) =>
						this.props.chipTitle === "Artist" ? (
							<div className="chip-container pr-5" key={key}>
								<span>{item[this.state.suggestionNameField]}</span>
								<div
									className="chip-container-crown-button cursor-pointer"
									onClick={() => this.setAlbumBy(item._id)}>
									<i
										className={`fas fa-crown ${
											this.props.albumBy === item._id && `crown-select`
										}`}></i>
								</div>
								<div
									className="chip-container-cancel-button cursor-pointer"
									onClick={() => this.deleteChip(key)}>
									<i className="fas fa-times text-white"></i>
								</div>
							</div>
						) : (
							<div className="chip-container" key={key}>
								<span>{item[this.state.suggestionNameField]}</span>
								<div
									className="chip-container-cancel-button cursor-pointer"
									onClick={() => this.deleteChip(key)}>
									<i className="fas fa-times text-white"></i>
								</div>
							</div>
						)
					)}
				</div>
				<div className="tag-input-container">
					<input
						ref={(d) => (this.inputRef = d)}
						type="text"
						placeholder={this.props.placeholder || ""}
						onChange={async (e) => {
							await this.setState({ suggestionString: e.target.value });
							this.chipSuggestionFetchHandler();
						}}
						value={this.state.suggestionString}
					/>
					<div className="tag-suggestion-string-holder">
						{this.state.chipSuggestion[0] &&
							this.state.chipSuggestion[0] !== "undefined" &&
							this.state.chipSuggestion.map((item, key) => {
								return (
									<div
										className={`suggestion-string-node ${
											this.state.suggestionCurrentIndex === key
												? "bg-danger text-white"
												: ""
										}`}
										key={key}
										onClick={(e) => this.addChip(key)}>
										{item[this.state.suggestionNameField]}
									</div>
								);
							})}
						{this.state.chipSuggestion[0] &&
							this.state.chipSuggestion[0] === "undefined" && (
								<div
									className={`text-center suggestion-string-node bg-warning text-white`}>
									Cannot find the {this.props.chipTitle || ""} you are looking
									for? <br />{" "}
									<button
										onClick={this.createNewChipHandler}
										className="font-weight-bold  mt-1 btn btn-sm btn-success rounded">
										Create New {this.props.chipTitle || ""}
									</button>
								</div>
							)}
					</div>
				</div>
			</div>
		);
	}
}

export default ChipsInput;
