import React, { Component } from 'react';
import { connect } from 'react-redux';
import "../assets/styles/home.css";
import { homeIllustrationImage } from '../assets/images';

class Home extends Component {
    render() {
        return (
            <div className="home-wrapper">
                <img className="home-illustration" src={homeIllustrationImage} alt="" srcSet="" />
            </div>
        )
    }
}


const mapStateToProps = (state) => {
    return {

    }
}

const mapDispatchToProps = (dispatch) => {
    return {

    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);