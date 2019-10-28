import React, { Component } from 'react'
import "./css/main.css";
import { musicNote } from './images'

export default class App extends Component {
  render() {
    return (
      <div>
        <header>
          <div className="logo"></div>
          <div className="player-wrapper">
          </div>
        </header>
        <main>
          <div className="main-search">
            <input type="text" className="search-input" placeholder="Search Your Music Here!" />
            <button className="search-icon"><i className="fas fa-search"></i></button>
          </div>
          <div className="dummy-music-holder">
            <img className="music-icon" src={musicNote} alt="" />
            <p className="music-icon-para">Your Music Appears Here!</p>
          </div>
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
