import React from 'react';
import firebase from '../../firebase'
import { Modal, Button, Alert } from "react-bootstrap"
import AsyncCreatableSelect from 'react-select/async-creatable';
import AsyncSelect from 'react-select/async';
import CreatableSelect from 'react-select/creatable';
import { BsPersonPlusFill } from "react-icons/bs"

class InviteToWorkspace extends React.Component {

    constructor(props) {
        super(props)

        this.teamsRef = firebase.firestore().collection('teams')
        this.workspacesRef = firebase.firestore().collection('workspaces')
        this.invitesRef = firebase.firestore().collection('invites')

        this.state = {
            invalidEmail: [],
            inputValue: '',
            value: [],
            validated: false,
            addMemberModalShow: false,
            buttonDisable: true,

        }

        this.handleSubmit = this.handleSubmit.bind(this)

    }




    invitePeople = () => {

        const { value } = this.state
        const { currentUser } = this.props

        


        // var newTeamRef = this.teamsRef.doc(currentUser.uid).collection("userTeams").doc()


        // newTeamRef.set({
        //     invitedEmailsList: invitedEmailsList,
        //     teamDescription: teamDescription,
        //     teamId: newTeamRef.id,
        //     createdBy: {
        //         name: currentUser.displayName,
        //         id: currentUser.uid
        //     },
        //     timestamp: Date.now()

        // }).then(() => {
        //     console.log('team saved');
        //     this.setState(() => {
        //         return {
        //             invitedEmailsList: '',
        //             teamDescription: ''
        //         }
        //     })
        // }).catch(err => {
        //     console.error(err);
        // })

    }

    validateEmail = (email) => {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }


    handleChange = (value, actionMeta) => {

        console.log("handle change", value)
        console.log(`action: ${actionMeta.action}`);

        if (value === null) {
            this.setState({
                buttonDisable: true,
                invalidEmail: [],
                value: [],
                validated: false
            })
        } else {

            this.setState({ value })

        }

    };

    handleInputChange = (inputValue) => {
        this.setState({ inputValue });
    };

    createOption = (label) => ({
        label,
        value: label,
    });

    handleKeyDown = (event) => {
        const { inputValue, value, invalidEmail } = this.state;
        console.log("enter", !inputValue)
        console.log("enter", !value)
        if (!inputValue && value.length===0) {
            this.setState({
                buttonDisable: true,
                validated: false,
            })
        } else if (!inputValue && value.length > 0) {
            this.setState({
                buttonDisable: false,
                validated: false,
            })
        } else {

            switch (event.key) {
                case 'Enter':
                case 'Tab':
                    console.group('Value Added');
                    console.log(value);
                    console.groupEnd();

                    const emailIsValid = this.validateEmail(inputValue)

                    if (emailIsValid === false) {
                        this.setState({
                            buttonDisable: true,
                            validated: true,
                            invalidEmail: [inputValue]

                        })
                    } else {
                        this.setState({
                            buttonDisable: false,
                            validated: false,
                            inputValue: '',
                            value: [...value, this.createOption(inputValue)],
                        });
                    }
                    event.preventDefault();
            }

        }
    };



    handleSubmit(event) {
        event.preventDefault();
        event.stopPropagation();

        this.invitePeople();
        this.setState({
            invalidEmail: [],
            inputValue: '',
            value: [],
            validated: false,
            addMemberModalShow: false,
            buttonDisable: true,

        })


    }

    handleClick = (event) => {
        event.preventDefault();
        event.stopPropagation();

        if (event.currentTarget.id === "addTeamMember") {

            this.setState({
                addMemberModalShow: true,
                validated: false

            })
        }
    }

    closeModal = () => {

        this.setState({
            invalidEmail: [],
            inputValue: '',
            value: [],
            validated: false,
            addMemberModalShow: false,
            buttonDisable: true,

        })

    }







    render() {
        const { validated, buttonDisable, invalidEmail, inputValue, value } = this.state
        const { currentWorkspace } = this.props

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
                    Invite people to {currentWorkspace.workspaceName} <BsPersonPlusFill />
                </Button>
                <Modal
                    show={this.state.addMemberModalShow}
                    onHide={this.closeModal}
                    size="lg"
                    aria-labelledby="invitePeopleModal"
                    centered
                >

                    <Modal.Header closeButton>
                        <Modal.Title id="invitePeopleModal-title">
                            Invite people to {currentWorkspace.workspaceName}
                        </Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                        <p>
                            Type email address and press enter. You can add multiple email addresses at once.
                            </p>

                        <CreatableSelect
                            isMulti
                            isClearable
                            cacheOptions
                            menuIsOpen={false}
                            placeholder="e.g: john@yourcompany.com"
                            components={components}
                            onKeyDown={this.handleKeyDown}
                            onChange={this.handleChange}
                            onInputChange={this.handleInputChange}
                            inputValue={inputValue}
                            value={value}
                        />
                        {validated ?

                            <Alert variant="danger" >
                                <strong>"{invalidEmail[0]}"</strong> is not a valid email address. Please remove.
                        </Alert>
                            : ""}


                    </Modal.Body>

                    <Modal.Footer>
                        <Button
                            variant="primary"
                            onClick={this.handleSubmit}
                            disabled={buttonDisable}
                        >Invite</Button>
                    </Modal.Footer>

                </Modal>
            </>
        )
    }
}

export default InviteToWorkspace;