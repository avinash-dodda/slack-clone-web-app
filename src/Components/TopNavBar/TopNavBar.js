import React from 'react';
import { InputGroup, FormControl, Navbar, Col, Row } from 'react-bootstrap';
import { BsSearch } from 'react-icons/bs';

class TopNavBar extends React.Component {
    render() {
        const { currentWorkspace } = this.props

        return (

            <Navbar
                variant="dark"
                className="topBar"
            >
                <Col
                    lg={4}
                    className="d-none d-lg-block align-self-center"
                >
                    <Row>
                        <Col lg={2}>

                        </Col>
                        <Col lg={10}>

                            <Navbar.Brand className="font-weight-bold"
                            style={{font: "Roboto"}}>
                                {currentWorkspace.workspaceName}
                            </Navbar.Brand>
                        </Col>
                    </Row>
                </Col>

                <Col lg={4} md={10} sm={10} xs={10} className="align-self-center">
                    <InputGroup >
                        <InputGroup.Prepend>
                            <InputGroup.Text id="search_icon">
                                <BsSearch />
                            </InputGroup.Text>
                        </InputGroup.Prepend>
                        <FormControl
                            placeholder="Search..."
                            aria-label="search_bar"
                            aria-describedby="search for messages"
                            autoComplete="off"
                        />
                    </InputGroup>
                </Col>

                <Col
                    lg={4} md={2} sm={2} xs={2}
                    className="align-self-center">
                </Col>


            </Navbar>


        )
    }
}

export default TopNavBar;