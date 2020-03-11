import React, { Component } from 'react';
import { connect } from 'react-redux';
import "../assets/styles/home.css";

class Home extends Component {
    render() {
        return (
            <div className="home-wrapper">
                home
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