import React from 'react';
import firebase from '../../firebase'
import { Modal, Button, Alert } from "react-bootstrap"
import AsyncCreatableSelect from 'react-select/async-creatable';
import AsyncSelect from 'react-select/async';
import { BsPersonPlusFill } from "react-icons/bs"

class AddTeamMemberModal extends React.Component {

    constructor(props) {
        super(props)

        this.teamsRef = firebase.firestore().collection('teams')
        this.usersRef = firebase.firestore().collection('users')
        this.messagesRef = firebase.firestore().collection('messages')
        this.teamsUsersRef = firebase.firestore().collection('teamUsers')
        this.workspacesRef = firebase.firestore().collection('workspaces')

        this.state = {
            invitedUsersList: [],
            addMemberModalShow: false,
            buttonDisable: true,
        }
        this.handleClick = this.handleClick.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
    }




    addTeamMember = () => {

        const { invitedUsersList } = this.state
        const { currentTeam, currentUser, currentWorkspace } = this.props

        console.log(invitedUsersList)

        invitedUsersList.forEach(invitedUser => {

            this.usersRef.doc(invitedUser.uid).get().then(userDoc => {
                if (!userDoc.exists) {
                    throw "User does not exist."

                } else if (currentWorkspace.workspaceId !== userDoc.data().workspaceId) {
                    throw "User is not part of this workspace."

                } else {
                    this.teamsRef
                        .doc(invitedUser.uid)
                        .collection("userTeams")
                        .doc(currentTeam.teamId)
                        .set(currentTeam)

                    this.teamsUsersRef
                        .doc(currentTeam.teamId)
                        .collection("teamUsers")
                        .doc(invitedUser.uid)
                        .set({
                            uid: invitedUser.uid,
                            name: invitedUser.value,
                            nameLowerCase: invitedUser.value.toLowerCase(),
                            email: invitedUser.email,
                            avatar: invitedUser.avatar,
                            teamAdmin: false
                        })

                }

            }).catch(err => {
                console.log('User failed to add:', err);
            });

        })

        this.addMessage(currentUser, currentTeam, invitedUsersList)

    }

    addMessage = (currentUser, currentTeam, invitedUsersList) => {

        if (invitedUsersList.length > 0) {

            this.messagesRef
                .doc(currentTeam.teamId)
                .collection("teamMessages")
                .add({
                    content: "Added " + invitedUsersList[0].value + (invitedUsersList.length > 1 ? " and others" : "") + " to the team.",
                    timestamp: Date.now(),
                    user: {
                        name: currentUser.displayName,
                        id: currentUser.uid
                    }
                }).then(() => {
                    console.log('message saved');
                }).catch(err => {
                    console.log('Messaged failed:', err);
                })

        }

    }



    handleChange = (value, actionMeta) => {

        console.log(value)
        console.log(`action: ${actionMeta.action}`);

        if (value === null) {
            this.setState({
                buttonDisable: true,
                invitedUsersList: []
            })
        } else {
            this.setState({
                buttonDisable: false,
                invitedUsersList: value
            })

        }

    };




    handleSubmit(event) {
        event.preventDefault();
        event.stopPropagation();

        this.addTeamMember();
        this.setState({
            addMemberModalShow: false,

        })


    }

    handleClick = (event) => {
        event.preventDefault();
        event.stopPropagation();

        if (event.currentTarget.id === "addTeamMember") {

            this.setState({
                addMemberModalShow: true,
            })


        }
    }

    closeModal = () => {

        this.setState({
            addMemberModalShow: false,
            buttonDisable: true
        })

    }



    promiseOptions = inputValue => {

        return new Promise(resolve => {

            const { currentWorkspace, currentTeam } = this.props

            let currentTeamUsers = []

            this.teamsUsersRef
                .doc(currentTeam.teamId)
                .collection("teamUsers")
                .where("nameLowerCase", ">=", inputValue.toLowerCase())
                .get()
                .then(querySnapshot => {

                    querySnapshot.forEach((teamUserDoc) => {
                        currentTeamUsers.push(teamUserDoc.id)
                    });

                }).catch(error => {
                    console.log("Error getting team users: ", error);
                });


            this.workspacesRef
                .doc(currentWorkspace.workspaceId)
                .collection("workspaceUsers")
                .where("nameLowerCase", ">=", inputValue.toLowerCase())
                .get()
                .then(querySnapshot => {
                    let searchResults = []
                    querySnapshot.forEach(doc => {
                        searchResults.push({
                            value: doc.data().name,
                            label: doc.data().name,
                            uid: doc.id,
                            email: doc.data().email,
                            avatar: doc.data().avatar,
                            isDisabled: currentTeamUsers.find(id => doc.id === id) ? true : false
                        })
                        console.log("query", searchResults)
                    })
                    return resolve(searchResults)
                })
                .catch(error => {
                    console.log("Error getting documents: ", error);
                });

        });
    }







    render() {
        const { buttonDisable } = this.state


        const components = {
            DropdownIndicator: null
        };


        return (
            <>

                <Button
                    id="addTeamMember"
                    onClick={this.handleClick}
                    variant="primary"
                >
                    Add team members <BsPersonPlusFill />
                </Button>
                <Modal
                    show={this.state.addMemberModalShow}
                    onHide={this.closeModal}
                    size="lg"
                    aria-labelledby="addTeamMemberModal"
                    centered
                >

                    <Modal.Header closeButton>
                        <Modal.Title id="addTeamMemberModal-title">
                            Add team member
                            </Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                        <p>
                            Type name to add a team member.
                            </p>

                        <AsyncSelect
                            isMulti
                            isClearable
                            cacheOptions
                            // defaultOptions
                            placeholder="e.g: john smith"
                            components={components}
                            loadOptions={this.promiseOptions}
                            onChange={this.handleChange}

                        />

                    </Modal.Body>

                    <Modal.Footer>
                        <Button
                            variant="primary"
                            onClick={this.handleSubmit}
                            disabled={buttonDisable}
                        >Add</Button>
                    </Modal.Footer>

                </Modal>
            </>
        )
    }
}

export default AddTeamMemberModal;