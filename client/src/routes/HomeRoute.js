import React, { Component } from 'react';
import HomeContainer from '../containers/HomeContainer'


// route root or /q/:id
class HomeRoute extends Component {
    constructor(props) {
        super()
    }

    render() {
        const { cookies } = this.props

        return (
            <div>
                <HomeContainer cookies={cookies} qid={this.props.match.params.id} />
            </div>
        )
    }
}

export default HomeRoute;
