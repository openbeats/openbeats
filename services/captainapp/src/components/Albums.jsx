import React, { Component } from 'react'
import { Link } from 'react-router-dom'

export default class Albums extends Component {
    render() {
        return (
            <div>
                Albums
                <Link to="/albums/dashyard">Dash Yard</Link>
            </div>
        )
    }
}
