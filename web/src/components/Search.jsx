import React, { Component } from 'react';
import "../css/search.css";

export default class Search extends Component {

    constructor(props) {
        super(props);
        this.state = {
            suggestionText: ""
        }
    }

    render() {
        return (
            <div className="main-search-wrapper">
                <div className="main-search">
                    <form action="" onSubmit={async (e) => { e.preventDefault(); await this.props.fetchResults(this.state.suggestionText); }}>
                        <input autoFocus type="text" value={this.state.suggestionText} onChange={async (e) => { this.setState({ suggestionText: e.target.value }); await this.props.getKeywordSuggestion(e) }} className="search-input" placeholder="Search Your Music Here!" />
                        <button className="search-icon" type="submit"><i className="fas fa-search"></i></button>
                    </form>
                    {this.props.state.keywordSuggestions.length > 0 &&
                        <div className="suggestion-keyword-holder">
                            {this.props.state.keywordSuggestions.map((item, key) => (
                                <div onClick={async (e) => {
                                    await this.setState({ suggestionText: item[0] })
                                    await this.props.fetchResults(this.state.suggestionText);
                                }} key={key} className="suggested-keyword" >{item[0]}</div>
                            ))}
                        </div>
                    }
                </div>
            </div>
        )
    }
}
