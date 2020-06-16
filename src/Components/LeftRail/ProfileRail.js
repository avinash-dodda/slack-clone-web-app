import React from 'react';
import firebase from '../../firebase'
import { Button, Card, Row, Col } from 'react-bootstrap'
import Avatar from "react-avatar"
import InviteToWorkspace from '../Modals/InviteToWorkspace'

class ProfileRail extends React.Component {

    constructor(props) {
        super(props)
  
        this.workspacesRef = firebase.firestore().collection('workspaces')

        this.state = {
            workspaceAdmin: false

        }

        this.handleSignout = this.handleSignout.bind(this)
    }

    componentDidMount(){
        const { currentUser, currentWorkspace } = this.props

        this.workspacesRef
            .doc(currentWorkspace.workspaceId)
            .collection("workspaceUsers")
            .doc(currentUser.uid)
            .get()
            .then((doc) => {
                if (doc.exists && doc.data().workspaceAdmin) {
                    
                    this.setState({
                        workspaceAdmin: true 
                    })

                } else {
                    // doc.data() will be undefined in this case
                    console.log("No such document!");
                }

            }).catch((error) => {
                console.error("Error getting workspace user: ", error);
            });

    }


    handleSignout = () => {
        firebase
            .auth()
            .signOut()
            .then(() => console.log('signed out'))

    }

    render() {

        const { currentUser, currentWorkspace } = this.props
        
        const{workspaceAdmin} = this.state

        return (
            <Row className="leftRail w-100 "
                id="chatCollapse" >
                <Col className="p-0 h-100 w-100">

                    <Card style={{ width: '18rem' }}>

                        <Card.Body>
                            <Avatar name={currentUser.displayName} size="150" round={true} />
                            <Card.Title>{currentUser.displayName}</Card.Title>
                            <Card.Text>
                                Status message
                            </Card.Text>

                        </Card.Body>
                    </Card>

                    {workspaceAdmin ?
                        <InviteToWorkspace
                            currentUser={currentUser}
                            currentWorkspace={currentWorkspace} />
                        : ""}

                    <Button onClick={this.handleSignout}>Sign Out</Button>
                </Col>
            </Row>
        )
    }
}

export default ProfileRail;