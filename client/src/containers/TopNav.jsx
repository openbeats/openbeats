import React, { Component } from 'react';
import "../css/topnav.css";
import {
    musicDummy,
    angleright,
    mainsearch,
} from "../images";
import { push } from "connected-react-router";
import { connect } from "react-redux";
import { toastActions, searchActions } from '../actions';


class TopNav extends Component {

    componentDidMount() {
        this.initListeners();
    }


    initListeners() {
        const searchBarRef = document.getElementsByClassName("search-input")[0];
        searchBarRef.addEventListener("focusin", function (e) {
            this.props.updateTyping(true)
        }.bind(this))
        searchBarRef.addEventListener("focusout", function (e) {
            this.props.updateTyping(false)
        }.bind(this))

        document.addEventListener("keydown", function (e) {
            if (e.keyCode === 27) {
                this.props.emptyKeywordSuggestion()
            }
        }.bind(this))
    }


    render() {
        return (
            <section className="main-header">
                <div className="container-action-notifier">
                    <img src={angleright} alt="" srcSet="" />
                    <span>{this.props.currentActionTitle}</span>
                </div>
                <div className="master-search-bar">
                    <form
                        action=""
                        onSubmit={async (e) => {
                            e.preventDefault();
                            await this.props.fetchResults();
                        }}
                    >
                        <input
                            type="text"
                            onKeyUp={async (e) => {
                                await this.props.onKeyUpHandler(e)
                            }}
                            value={this.props.suggestionText}
                            onChange={async (e) => {
                                await this.props.getKeywordSuggestion(e.target.value)
                            }}
                            className="search-input"
                            placeholder="Search Artists, Albums, Films, Songs...."
                        />
                        <button className="search-icon" type="submit"><img src={mainsearch} alt="" srcSet="" /></button>
                    </form>
                    <div className="suggestion-keyword-holder">
                        {this.props.keywordSuggestions.map((item, key) => (
                            <div
                                onClick={async (e) => {
                                    await this.props.updateSuggestionText(item[0])
                                    await this.props.fetchResults();
                                }}
                                key={key}
                                className={`suggested-keyword ${this.props.currentTextIndex === key + 1 ? 'highlight-current' : ''}`}
                            >
                                {item[0]}
                            </div>
                        ))}
                    </div>
                </div>
                <div className="main-user-profile-holder">
                    <img
                        className="cursor-pointer"
                        onClick={() => {
                            this.props.featureNotify()
                        }} src={musicDummy}
                        alt=""
                        srcSet="" />
                </div>
            </section >
        )
    }
}

const mapStateToProps = (state) => {
    return {
        currentActionTitle: state.coreReducer.currentActionTitle,
        suggestionText: state.searchReducer.suggestionText,
        keywordSuggestions: state.searchReducer.keywordSuggestions,
        currentTextIndex: state.searchReducer.currentTextIndex,
        actualText: state.searchReducer.actualText,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        push: (path) => {
            dispatch(push(path))
        },
        featureNotify: () => {
            toastActions.featureNotify();
        },
        updateSuggestionText: (text) => {
            dispatch(searchActions.updateSuggestionText(text));
        },
        onKeyUpHandler: (e) => {
            dispatch(searchActions.onKeyUpHandler(e));
        },
        updateTyping: (isTyping) => {
            dispatch(searchActions.updateTyping(isTyping));
        },
        emptyKeywordSuggestion: () => {
            dispatch(searchActions.emptyKeywordSuggestion());
        },
        fetchResults: () => {
            searchActions.fetchResults();
            dispatch(push("/search"))
        },
        getKeywordSuggestion: (key) => {
            searchActions.getKeywordSuggestion(key);
        },
    }
}



export default connect(mapStateToProps, mapDispatchToProps)(TopNav);