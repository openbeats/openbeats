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
        }
        this.suggestionBlockRef = null;
    }

    chipInputOnChange = async () => {
        document.removeEventListener("click", this.clearSuggestionInputListener);
        document.removeEventListener("keyup", this.clearSuggestionInputListener);
        this.setState({ chipSuggestion: ["Anirudh", "A R Rahman", "Lorem", "Paris"] });
        document.addEventListener("click", this.clearSuggestionInputListener);
        document.addEventListener("keyup", this.clearSuggestionInputListener);
    }

    deleteChip = (index) => {
        let newChips = this.state.chips.filter((i, k) => k !== index)
        this.setState({ chips: newChips })
    }

    addChip = (index) => {
        let addedNewChip = this.state.chips;
        addedNewChip.push(this.state.chipSuggestion[index]);
        this.setState({ chips: addedNewChip, chipSuggestion: [], suggestionString: '' })
    }

    clearSuggestionInputListener = (event) => {
        if (event.keyCode === 27 || !this.suggestionBlockRef.contains(event.target)) {
            this.setState({ chipSuggestion: [], suggestionString: "" })
            document.removeEventListener("click", this.clearSuggestionInputListener);
            document.removeEventListener("keyup", this.clearSuggestionInputListener);
        } else if (event.keyCode === 40) {
            console.log("down arow")

        } else if (event.keyCode === 38) {
            console.log("up arow")
        }
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
                            this.chipInputOnChange();
                        }} value={this.state.suggestionString} name="" id="" />
                    <div className="tag-suggestion-string-holder" >
                        {this.state.chipSuggestion.map((item, key) => {
                            return <div className="suggestion-string-node" key={key} onClick={e => this.addChip(key)}>{item}</div>
                        })}
                    </div>
                </div>
            </div>
        )
    }
}
