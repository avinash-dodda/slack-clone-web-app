import React from 'react';
import { Row, Col, Card} from "react-bootstrap"
import { BsFillPeopleFill,} from 'react-icons/bs';
import AddTeamMemberModal from "../Modals/AddTeamMemberModal"
import moment from "moment"

class CreatedNewTeam extends React.Component {

    constructor(props) {
        super(props)

        this.state = {

        }

    }


    render() {

        const { currentTeam, currentUser, currentWorkspace } = this.props

        const isCreator = currentTeam.createdBy.id === currentUser.uid

        return (
            <Row className="my-3 p-0" >
                <Col>

                    <Card className="shadow-sm">
                        <Card.Body>

                            <Card.Title className="trimText">
                                <BsFillPeopleFill /> {currentTeam.teamName}
                            </Card.Title>

                            {currentTeam.teamDescription === "" ? "" :
                                <Card.Subtitle className="py-1 trimText">
                                    Description: {currentTeam.teamDescription}
                                </Card.Subtitle>}

                            <Card.Text>
                                {isCreator ? "You" : currentTeam.createdBy.name} created this team space on {moment(currentTeam.timestamp).format('MMM Do')}. {isCreator ? "Add team members and say Hello!" : "Say Hello!"}
                            </Card.Text>


                            <AddTeamMemberModal
                                currentTeam={currentTeam}
                                currentUser={currentUser}
                                currentWorkspace={currentWorkspace} />

                        </Card.Body>
                    </Card>

                </Col>
            </ Row >
        )
    }

}

export default CreatedNewTeam
