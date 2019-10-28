import React, { Component, Fragment } from 'react'
import "./css/main.css";
import { musicNote, playlist, download, play, playlistadd, downloadOrange } from './images'

import { variables } from "./config"
export default class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      searchText: "",
      keywordSuggestions: [],
      searchResults: [],
      isSearchProcessing: false,
      listener: null
    }
  }

  componentDidMount() {

  }


  async getKeywordSuggestion(e) {
    this.setState({ searchText: e.target.value })
    const url = `https://clients1.google.com/complete/search?client=youtube&hl=en&gl=in&sugexp=brcmjc%2Cbrueb%3D1%2Cbruesk%3D1%2Cuimd%3D1%2Cbrmlmo%3Dyt%252Fen%253Aus%253Ayt_en_us_loc%252Cyt%252Fja%253A%253Ayt_cjk_loc%252Cyt%252Fko%253A%253Ayt_cjk_loc%252Cyt%252Fzh-TW%253A%253Ayt_cjk_loc%252Cyt%252Fzh-CN%253A%253Ayt_cjk_loc%252Cyt%252Fdefault%253A%253Ayt_i18n_loc%2Ccfro%3D1%2Cbrueb%3D1&gs_rn=64&gs_ri=youtube&tok=rSSsBe5Xjbc6evDhnFq1Ew&ds=yt&cp=2&gs_id=8&q=${e.target.value}&callback=google.sbox.p50&gs_gbg=jGJ7J1BaQuU5YRqac`;
    if (e.target.value.length > 0) {
      await fetch(url)
        .then(res => res.text())
        .then(res => {
          let tmp = res.replace("google.sbox.p50 && google.sbox.p50(", "");
          tmp = tmp.replace(")", "");
          let temp = JSON.parse(tmp)[1]
          let listener = document.addEventListener("click", function () {
            if (listener != null) {
              document.removeEventListener(this.state.listenter)
            }
            this.setState({ keywordSuggestions: [], listener: null })
          }.bind(this));
          this.setState({ keywordSuggestions: temp, listener: listener })
        })
        .catch(e => console.error(e))
    }
  }

  async fetchResults() {
    this.setState({ keywordSuggestions: [] })
    const url = `${variables.baseUrl}/ytcat?q=${this.state.searchText}`
    console.log(url);

    await fetch(url)
      .then(res => res.json())
      .then(res => {
        console.log(res);
        if (res.status) {
          this.setState({
            searchResults: res.data
          })
        }
      })
      .catch(err => console.error(err));
  }


  render() {
    return (
      <Fragment >
        <header>
          <div className="logo"></div>
          <div className="player-wrapper">
            <audio id="music-player">
              <source src={"http://www.noiseaddicts.com/samples_1w72b820/2543.mp3"} type="audio/mpeg" />
            </audio>
            <img className="music-thumb" src={"https://img.freepik.com/free-vector/broken-frosted-glass-realistic-icon_1284-12125.jpg?size=338&ext=jpg"} alt="" />
            <div className="music-title">
              Ennavale Adi Ennavale..
            </div>
            <input className="progress-bar" min="0" max="1" step="0.05" type="range" name="" id="" />

            <div className="music-playpause-holder">
              <i className="fas fa-play play-icon cursor-pointer"></i>
              {/* <i className="fas fa-pause play-icon cursor-pointer"></i> */}
              <span className="volume-icon cursor-pointer">
                <i className="fas fa-volume-up text-white"></i>
                <span className="volume-progress">--------</span>
              </span>
              <span className="music-duration">
                <span >2.40</span>
                <span className="font-weight-bold text-white">&nbsp;  |  &nbsp;</span>
                <span >4.00</span>
              </span>
            </div>
            <div className="music-download cursor-pointer">
              <img src={download} alt="" />
            </div>
            <div className="music-playlist cursor-pointer">
              <img src={playlist} alt="" />
            </div>
          </div>
        </header>
        <main>
          <div className="main-search">
            <form action="" onSubmit={(e) => { e.preventDefault(); this.fetchResults(); }}>
              <input type="text" value={this.state.searchText} onChange={(e) => { this.getKeywordSuggestion(e) }} className="search-input" placeholder="Search Your Music Here!" />
              <button className="search-icon" type="submit"><i className="fas fa-search"></i></button>
            </form>
            {this.state.keywordSuggestions.length > 0 &&
              <div className="suggestion-keyword-holder">
                {this.state.keywordSuggestions.map((item, key) => (
                  <div onClick={async (e) => {
                    await this.setState({ searchText: item[0], keywordSuggestions: [] });
                    this.fetchResults();
                  }} key={key} className="suggested-keyword" >{item[0]}</div>
                ))}
              </div>
            }
          </div>
          {this.state.searchResults.length > 0 ?
            <div className="search-result-container">

              {this.state.searchResults.map((item, key) => (

                <div className="result-node" key={key}>
                  <div className="result-node-thumb">
                    <img src={item.thumbnail} alt="" />
                  </div>
                  <div className="result-node-desc">
                    <div className="result-node-title">
                      {item.title}
                    </div>
                    <div className="result-node-attributes">
                      <div className="result-node-duration">
                        {item.duration}
                      </div>
                      <div className="result-node-actions">
                        <img value={item.videoId} className="action-image-size cursor-pointer" src={play} alt="" />
                        <img value={item.videoId} className="action-image-size cursor-pointer" src={downloadOrange} alt="" />
                        <img value={item.videoId} className="action-image-size cursor-pointer" src={playlistadd} alt="" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            :
            <div className="dummy-music-holder">
              <img className={`music-icon ${this.state.isSearchProcessing ? 'preload-custom-1' : ''}`} src={musicNote} alt="" />
              <p className="music-icon-para">Your Music Appears Here!</p>
            </div>
          }
        </main>
        <footer>
          <div className="copyrights">
            © 2019 OpenBeats.in | All Rights Reserved.
          </div>
          <div className="footer-right">
            <a className="about-us" href="http://localhost:2000/">About Us</a>
            <a href="http://localhost:2000/"><i className="fab fa-android android-color"></i></a>
          </div>

        </footer>
      </Fragment>
    )
  }
}
