import React, { Component } from 'react';
import "../css/search.css";

export default class Search extends Component {

    constructor(props) {
        super(props);
        this.state = {
            suggestionText: "",
            currentTextIndex: 0,
            actualText: ""
        }
    }

    render() {
        return (
            <div className="main-search-wrapper">
                <div className="main-search">
                    <form
                        action=""
                        onSubmit={async (e) => {
                            e.preventDefault();
                            let a = await this.state.suggestionText;
                            await this.props.fetchResults(a);
                        }}>
                        <input
                            autoFocus
                            type="text"
                            onKeyUp={async (e) => {
                                if (e.keyCode === 40) {
                                    let current = (this.state.currentTextIndex + 1) % (this.props.state.keywordSuggestions.length + 1);
                                    if (current !== 0)
                                        await this.setState({ currentTextIndex: current, suggestionText: this.props.state.keywordSuggestions[current - 1][0] })
                                    else
                                        await this.setState({ currentTextIndex: current, suggestionText: this.state.actualText })
                                } else if (e.keyCode === 38) {
                                    let current = Math.abs(this.state.currentTextIndex - 1) % (this.props.state.keywordSuggestions.length + 1);
                                    if (current !== 0)
                                        await this.setState({ currentTextIndex: current, suggestionText: this.props.state.keywordSuggestions[current - 1][0] })
                                    else
                                        await this.setState({ currentTextIndex: current, suggestionText: this.state.actualText })
                                }
                            }}
                            value={this.state.suggestionText}
                            onChange={async (e) => {
                                let a = e.target.value
                                await this.setState({ suggestionText: a, actualText: a, currentTextIndex: 0 });
                                await this.props.getKeywordSuggestion(a)
                            }} className="search-input"
                            placeholder="Search Your Music Here!"
                        />
                        <button className="search-icon" type="submit"><i className="fas fa-search"></i></button>
                    </form>
                    {this.props.state.keywordSuggestions.length > 0 &&
                        <div className="suggestion-keyword-holder">
                            {this.props.state.keywordSuggestions.map((item, key) => (
                                <div
                                    onClick={async (e) => {
                                        await this.setState({ suggestionText: item[0] })
                                        await this.props.fetchResults(this.state.suggestionText);
                                    }}
                                    key={key}
                                    className={`suggested-keyword ${this.state.currentTextIndex === key + 1 ? 'highlight-current' : ''}`}
                                >{item[0]}</div>
                            ))}
                        </div>
                    }
                </div>
            </div>
        )
    }
}
