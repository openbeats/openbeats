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
                    <form action="" onSubmit={(e) => { e.preventDefault(); this.props.fetchResults(this.state.suggestionText); }}>
                        <input type="text" value={this.props.state.searchText} onChange={(e) => { this.setState({ suggestionText: e.target.value }); this.props.getKeywordSuggestion(e) }} className="search-input" placeholder="Search Your Music Here!" />
                        <button className="search-icon" type="submit"><i className="fas fa-search"></i></button>
                    </form>
                    {this.props.state.keywordSuggestions.length > 0 &&
                        <div className="suggestion-keyword-holder">
                            {this.props.state.keywordSuggestions.map((item, key) => (
                                <div onClick={async (e) => {
                                    this.props.fetchResults(item[0]);
                                }} key={key} className="suggested-keyword" >{item[0]}</div>
                            ))}
                        </div>
                    }
                </div>
            </div>
        )
    }
}
