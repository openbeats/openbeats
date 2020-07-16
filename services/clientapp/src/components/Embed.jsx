import React, { Component } from 'react'
import '../assets/css/embed.css';
import axios from 'axios';
import config from '../config';

export default class Embed extends Component {
    constructor(props) {
        super(props);
        this.videoPlayerRef = null;
        this.sourceRef = null;
    }

    async componentDidMount() {
        const songId = this.props.match.params.id;
        if (songId) {
            const { data } = await axios.get(`${config.variables.baseUrl}/opencc/${songId}`)
            if (data.status) {
                this.sourceRef.src = data.link;
                this.videoPlayerRef.load();
            } else {
                window.location.href = window.location.origin;
            }
        } else {
            window.location.href = window.location.origin;
        }
    }


    render() {
        return (
            <div className="embed-video-player-wrapper">
                <video ref={d => this.videoPlayerRef = d} controls >
                    <source ref={d => this.sourceRef = d} src="" type="" />
                </video>
            </div >
        )
    }
}
