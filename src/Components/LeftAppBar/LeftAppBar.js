import React from 'react';
import { BsFillPeopleFill, BsFillChatDotsFill, BsPeopleCircle } from 'react-icons/bs';
import { ButtonToolbar, ButtonGroup, Button, Fade, Collapse, Col, Row, Card } from 'react-bootstrap';
import ProfileRail from '../LeftRail/ProfileRail'
import ChatRail from '../LeftRail/ChatRail'
import TeamRail from '../LeftRail/TeamRail'

class LeftAppBar extends React.Component {
    constructor() {
        super()

        this.state = {
            profileCollapse: false,
            chatCollapse: false,
            teamCollapse: true
        }

        this.handleClick = this.handleClick.bind(this)
    }

    handleClick = (event) => {
        event.preventDefault();
        event.stopPropagation();


        if (event.currentTarget.id === "profileButton") {

            this.setState({
                profileCollapse: true,
                chatCollapse: false,
                teamCollapse: false
            })
        } else if (event.currentTarget.id === "chatButton") {

            this.setState({
                profileCollapse: false,
                chatCollapse: true,
                teamCollapse: false
            })
        } else if (event.currentTarget.id === "teamButton") {

            this.setState({
                profileCollapse: false,
                chatCollapse: false,
                teamCollapse: true
            })
        }



    }

    render() {

        const windowWidth = window.screen.width

        const appBarButton = {
            fontSize: windowWidth > 1024 ? "2rem" : "1rem",
            border: "0px",
            borderRadius: "0",
        }

        const variant = "outline-secondary"


        const { profileCollapse, chatCollapse, teamCollapse } = this.state;
        const { currentUser, currentWorkspace } = this.props;

        return (
            <Row className="leftAppBar shadow w-100" >
                <Col className="p-0 w-100"
                    lg={2} md={2} sm={2} xs={2}>

                    <ButtonToolbar aria-label="Top left button groups"
                        style={{ textAlign: "center" }}>
                        <ButtonGroup
                            vertical
                            style={{ textAlign: "center", width: "100%" }}
                        >

                            <Button
                                variant={variant}
                                style={appBarButton}
                                id="chatButton"
                                aria-controls="chatCollapse"
                                onClick={this.handleClick}
                                block
                            >
                                <BsFillChatDotsFill />
                                <Card.Text style={{
                                    fontSize: "0.75rem",
                                    padding: "0"
                                }}>Chat</Card.Text>
                            </Button>

                            <Button
                                variant={variant}
                                style={appBarButton}
                                id="teamButton"
                                aria-controls="teamCollapse"
                                onClick={this.handleClick}
                                block>
                                <BsFillPeopleFill />
                                <Card.Text style={{
                                    fontSize: "0.75rem",
                                    padding: "0"
                                }}>Team</Card.Text>
                            </Button>

                            <Button
                                variant={variant}
                                style={appBarButton}
                                id="profileButton"
                                aria-controls="profileCollapse"
                                onClick={this.handleClick}
                                block
                            >
                                <BsPeopleCircle />
                                <Card.Text style={{
                                    fontSize: "0.75rem",
                                    padding: "0"
                                }}>Profile</Card.Text>
                            </Button>

                        </ButtonGroup>

                    </ButtonToolbar>
                </Col>

                <Col className="p-0 h-100"
                    lg={10} md={10} sm={10} xs={10}>
                    <div>
                        <Fade in={profileCollapse} unmountOnExit={true}>
                            <ProfileRail
                                currentUser={currentUser}
                                currentWorkspace={currentWorkspace} />
                        </Fade>
                    </div>

                    <div>
                        <Fade in={chatCollapse} unmountOnExit={true}>
                            <ChatRail />
                        </Fade>
                    </div>

                    <div>
                        <Fade in={teamCollapse} unmountOnExit={true}>
                            <TeamRail currentUser={currentUser} />
                        </Fade>
                    </div>
                </Col>
            </Row >

        )
    }
}

export default LeftAppBar;

