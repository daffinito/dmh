import React, { Component } from 'react';
import TheGreatWall from '../containers/TheGreatWall'


// route /verification
class WallRoute extends Component {
    constructor(props) {
        super()
    }

    render() {
        const { cookies } = this.props

        return (
            <div>
                <TheGreatWall cookies={cookies} />
            </div>
        )
    }
}

export default WallRoute;
