import React, { Component } from 'react';
import '../assets/styles/chipsinput.css';

export default class ChipsInput extends Component {
    constructor(props) {
        super(props);
        this.state = {
            chips: [],
            chipSuggestion: [],
            suggestionString: '',
            suggestionRequestUrl: null,
            suggestionCurrentIndex: 0
        }
        this.suggestionBlockRef = null;
    }

    chipSuggestionFetchHandler = async () => {
        document.removeEventListener("click", this.clearSuggestionInputListener);
        document.removeEventListener("keyup", this.clearSuggestionInputListener);

        // this.setState({ chipSuggestion: ["Anirudh", "A R Rahman", "Lorem", "Paris"] });
        this.setState({ chipSuggestion: ["undefined"] })

        document.addEventListener("click", this.clearSuggestionInputListener);
        document.addEventListener("keyup", this.clearSuggestionInputListener);
    }

    deleteChip = (index) => {
        let newChips = this.state.chips.filter((i, k) => k !== index);
        this.setState({ chips: newChips });
        this.props.setArtistChips(newChips);
    }

    addChip = (index) => {
        let addedNewChip = this.state.chips;
        addedNewChip.push(this.state.chipSuggestion[index]);
        this.setState({ chips: addedNewChip, chipSuggestion: [], suggestionString: '', suggestionCurrentIndex: 0 });
        this.props.setArtistChips(addedNewChip);
    }

    clearSuggestionInputListener = (event) => {
        if (event.keyCode === 27 || !this.suggestionBlockRef.contains(event.target)) {
            this.setState({ chipSuggestion: [], suggestionString: "", suggestionCurrentIndex: 0 })
            document.removeEventListener("click", this.clearSuggestionInputListener);
            document.removeEventListener("keyup", this.clearSuggestionInputListener);
        } else if (event.keyCode === 40) {
            this.setState({ suggestionCurrentIndex: (this.state.suggestionCurrentIndex + 1) < this.state.chipSuggestion.length ? (this.state.suggestionCurrentIndex + 1) : 0 })
        } else if (event.keyCode === 38) {
            this.setState({ suggestionCurrentIndex: (this.state.suggestionCurrentIndex - 1) >= 0 ? this.state.suggestionCurrentIndex - 1 : this.state.chipSuggestion.length - 1 })
        } else if (event.keyCode === 13) {
            this.addChip(this.state.suggestionCurrentIndex);
        }
    }

    createNewChipHandler = () => {
        this.props.createNewChipCallback(this.state.suggestionString);
        this.setState({ suggestionString: '', chipSuggestion: [] });
        document.removeEventListener("click", this.clearSuggestionInputListener);
        document.removeEventListener("keyup", this.clearSuggestionInputListener);
    }

    render() {
        return (
            <div className="tag-input-holder mt-1"
                ref={d => this.suggestionBlockRef = d}
            >
                <div className="tags-chips-container">
                    {this.state.chips.map((item, key) => (<div className="chip-container" key={key}>
                        <span>{item}</span>
                        <div className="chip-container-cancel-button cursor-pointer" onClick={() => this.deleteChip(key)}><i className="fas fa-times text-white"></i></div>
                    </div>
                    ))}
                </div>
                <div className="tag-input-container">
                    <input type="text" placeholder="Search Artist Here..."
                        onChange={async (e) => {
                            await this.setState({ suggestionString: e.target.value })
                            this.chipSuggestionFetchHandler();
                        }} value={this.state.suggestionString} name="" id="" />
                    <div className="tag-suggestion-string-holder" >
                        {this.state.chipSuggestion[0] && this.state.chipSuggestion[0] !== "undefined" && this.state.chipSuggestion.map((item, key) => {
                            return <div className={`suggestion-string-node ${this.state.suggestionCurrentIndex === key ? 'bg-danger text-white' : ''}`} key={key} onClick={e => this.addChip(key)}>{item}</div>
                        })}
                        {
                            this.state.chipSuggestion[0] && this.state.chipSuggestion[0] === "undefined" && <div className={`text-center suggestion-string-node bg-warning text-white`} onClick={e => { }}>
                                Cannot find the Artist you are looking for? <br /> <button onClick={this.createNewChipHandler} className="font-weight-bold  mt-1 btn btn-sm btn-success rounded">Create New Artist</button>
                            </div>
                        }
                    </div>
                </div>
            </div>
        )
    }

}
