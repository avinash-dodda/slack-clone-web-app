import React from 'react';
import firebase from '../../firebase'
import { Modal, Button, Form } from "react-bootstrap"
import { BsFillPlusSquareFill } from "react-icons/bs"

class CreateTeamModal extends React.Component {

    constructor(props) {
        super(props)

        this.teamsRef = firebase.firestore().collection('teams')
        this.teamUsersRef = firebase.firestore().collection('teamUsers')

        this.state = {
            teamName: '',
            teamDescription: '',
            validated: false,
            teamModalShow: false,
            buttonDisable: true

        }
        this.handleClick = this.handleClick.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
    }


    addTeam = () => {

        const { teamName, teamDescription } = this.state
        const { currentUser, setActiveTeam, setCurrentTeam } = this.props

        console.log(currentUser)

        var newTeamRef = this.teamsRef.doc(currentUser.uid).collection("userTeams").doc()


        newTeamRef.set({
            teamName: teamName,
            teamDescription: teamDescription,
            teamId: newTeamRef.id,
            createdBy: {
                name: currentUser.displayName,
                id: currentUser.uid
            },
            timestamp: Date.now()

        })
        
        this.teamUsersRef.doc(newTeamRef.id).collection('teamUsers').doc(currentUser.uid).set({
            uid: currentUser.uid,
            name: currentUser.displayName,
            nameLowerCase:currentUser.displayName.toLowerCase(),
            email: currentUser.email,
            avatar: currentUser.photoURL,
            teamAdmin: true
                
        }).then(() => {
            console.log('team saved');

            newTeamRef.get().then((doc) => {
                if (doc.exists) {
                    setActiveTeam(doc.data())
                    setCurrentTeam(doc.data())

                    console.log("Document data:", doc.data());
                } else {
                    // doc.data() will be undefined in this case
                    console.log("No such document!");
                }
            }).catch(function (error) {
                console.log("Error getting document:", error);
            });
            this.setState(() => {
                return {
                    teamName: '',
                    teamDescription: ''
                }
            })
        }).catch(err => {
            console.error(err);
        })

    }

    handleChange(event) {
        this.setState({
            [event.target.name]: event.target.value
        });

        if (event.target.name === "teamName" && event.target.value === "") {
            this.setState({
                buttonDisable: true
            })
        } else {
            this.setState({
                buttonDisable: false
            })
        }
    };


    handleSubmit(event) {
        event.preventDefault();
        event.stopPropagation();

        const form = event.currentTarget.form;
        if (form.checkValidity() === false) {

            this.setState({
                validated: true

            })
        } else {

            this.addTeam();
            this.setState({
                teamModalShow: false,

            })

        }
    }

    handleClick = (event) => {
        event.preventDefault();
        event.stopPropagation();

        if (event.currentTarget.id === "createTeam") {

            this.setState({
                teamModalShow: true,
                validated: false

            })
        }
    }

    closeModal = () => {

        this.setState({
            teamModalShow: false,
            buttonDisable: true

        })

    }

    render() {
        const { teamName, teamDescription, validated, buttonDisable } = this.state
        const { buttonStyle } = this.props

        return (
            <>

                <Button
                    id="createTeam"
                    onClick={this.handleClick}
                    style={buttonStyle}
                    block
                >
                    Create a new Team <BsFillPlusSquareFill />
                </Button>
                <Modal
                    show={this.state.teamModalShow}
                    onHide={this.closeModal}
                    size="lg"
                    aria-labelledby="createTeamModal"
                    centered
                >
                    <Form noValidate validated={validated} onSubmit={this.handleSubmit}>
                        <Modal.Header closeButton>
                            <Modal.Title id="createTeamModal-title">
                                Create a new Team
                    </Modal.Title>
                        </Modal.Header>

                        <Modal.Body>
                            <p>
                                Add a new space for your team communications.
                        </p>
                            <Form.Group controlId="teamName">
                                <Form.Label> <strong>Team name</strong></Form.Label>
                                <Form.Control
                                    required
                                    name="teamName"
                                    size="lg"
                                    type="text"
                                    placeholder='e.g. Marketing'
                                    autoComplete="off"
                                    value={teamName}
                                    onChange={this.handleChange}
                                />
                                <Form.Control.Feedback type="invalid">
                                    Please enter a valid team name.
                        </Form.Control.Feedback>
                            </Form.Group>


                            <Form.Group controlId="teamDescription">
                                <Form.Label> <strong>Team description</strong> (Optional)</Form.Label>
                                <Form.Control
                                    name="teamDescription"
                                    size="lg"
                                    type="text"
                                    placeholder='e.g. Plan marketing activities'
                                    autoComplete="off"
                                    value={teamDescription}
                                    onChange={this.handleChange}
                                />
                                <Form.Control.Feedback type="invalid">
                                    Please enter a valid description.
                        </Form.Control.Feedback>
                            </Form.Group>

                        </Modal.Body>

                        <Modal.Footer>
                            <Button
                                onClick={this.handleSubmit}
                                disabled={buttonDisable}
                            >Create</Button>
                        </Modal.Footer>
                    </Form>
                </Modal>
            </>
        )
    }
}

export default CreateTeamModal;