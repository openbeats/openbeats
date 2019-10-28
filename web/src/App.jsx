import React, { Component } from 'react'
import "./css/main.css";
import { musicNote, playlist, download, } from './images'
// play, playlistadd, downloadOrange
export default class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      searchText: "",
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
          console.log(res);
          let tmp = res.replace("google.sbox.p50 && google.sbox.p50(", "");
          tmp = tmp.replace(")", "");
          console.log(tmp);
          let temp = JSON.parse(tmp)[1]
          console.log(temp);
          
        })
        .catch(e => console.error(e))
    }


  }

  fetchResults() {



  }


  render() {
    return (
      <div>
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
          </div>
          <div className="dummy-music-holder">
            <img className="music-icon" src={musicNote} alt="" />
            <p className="music-icon-para">Your Music Appears Here!</p>
          </div>
          {/* <div className="search-result-container">
            <div className="result-node">
              <div className="result-node-thumb">
                <img src={"https://img.freepik.com/free-vector/broken-frosted-glass-realistic-icon_1284-12125.jpg?size=338&ext=jpg"} alt="" />
              </div>
              <div className="result-node-desc">
                <div className="result-node-title">
                  Enna vilai alage Kadhalar dhi
                </div>
                <div className="result-node-attributes">
                  <div className="result-node-duration">
                    6.23
                  </div>
                  <div className="result-node-actions">
                    <img className="action-image-size cursor-pointer" src={play} alt="" />
                    <img className="action-image-size cursor-pointer" src={downloadOrange} alt="" />
                    <img className="action-image-size cursor-pointer" src={playlistadd} alt="" />
                  </div>
                </div>
              </div>
            </div>
          </div> */}


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
      </div>
    )
  }
}
