import React from 'react';
import { Row, Col, Navbar, NavbarBrand } from "react-bootstrap"

class MessagesHeader extends React.Component {

    constructor(props) {
        super(props)

        this.state = {

        }

    }

    render() {
        const { currentTeam } = this.props
        return (
            <Row className="m-0 p-0">
                <Col className="m-0 p-0">
                    {currentTeam === null ?
                        "" :
                        <Navbar bg="light border-bottom">
                            <NavbarBrand className="trimText">
                                {currentTeam.teamName}
                            </NavbarBrand>
                        </Navbar>
                    }
                </Col>

            </Row>
        )

    }
}

export default MessagesHeader