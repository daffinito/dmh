import React, { Component } from 'react'
import { Navbar, NavbarBrand } from 'reactstrap'

class NavbarContainer extends Component {
    constructor(props) {
        super()
    }

    render() {

        return (
            <Navbar>
                <NavbarBrand href="/" className="mx-auto">
                    <div className="dmh-logo dmh-logo-orange" />
                </NavbarBrand>
                {this.props.children}
            </Navbar>

        )
    }
}

export default NavbarContainer
