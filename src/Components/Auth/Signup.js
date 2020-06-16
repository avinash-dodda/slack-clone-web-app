import React from 'react';
import firebase from '../../firebase'
import { Container, Row, Col, Form, Button, Spinner, Toast } from 'react-bootstrap'
import { Link } from 'react-router-dom'

class Signup extends React.Component {
    constructor() {
        super()
        this.workspacesRef = firebase.firestore().collection('workspaces')
        this.usersRef = firebase.firestore().collection('users')
        this.state = {
            firstName: '',
            lastName: '',
            workspaceName: '',
            email: '',
            password: '',
            passwordConfirmation: '',
            validated: false,
            loading: false,
            errors: ""
        }
        this.handleChange = this.handleChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
    }


    isPasswordValid = () => {
        if (this.state.password !== this.state.passwordConfirmation) {
            return false
        } else {
            return true
        }
    }

    handleChange(event) {
        this.setState({
            [event.target.name]: event.target.value
        });
    };



    handleSubmit(event) {
        event.preventDefault();
        event.stopPropagation();

        const form = event.currentTarget.form;
        if (form.checkValidity() === false) {

            this.setState({
                validated: true

            })
        } else if (this.isPasswordValid()) {

            this.setState({
                loading: true
            })

            const { firstName, lastName } = this.state


            firebase
                .auth()
                .createUserWithEmailAndPassword(this.state.email, this.state.password)
                .then(createdUser => {
                    console.log(createdUser)
                    createdUser.user.updateProfile({
                        displayName: firstName + " " + lastName,
                        // photoURL: 
                    })

                        .then(() => {
                            this.saveUser(createdUser).then(() => {
                                console.log('user saved');
                                this.setState(() => {
                                    return {
                                        loading: false,
                                    }
                                })
                            })
                        })
                        .catch(err => {
                            console.error(err);
                            this.setState(() => {
                                return {
                                    loading: false,
                                    errors: err.message
                                }
                            })
                        })
                })

                .catch(err => {
                    console.error(err);
                    this.setState(() => {
                        return {
                            loading: false,
                            errors: err.message
                        }
                    })
                })

        }

    };



    saveUser = createdUser => {

        const { workspaceName } = this.state

        var newWorkspaceRef = this.workspacesRef.doc()
        newWorkspaceRef.set({
            workspaceName: workspaceName,
            workspaceId: newWorkspaceRef.id,
            createdBy: {
                name: createdUser.user.displayName,
                id: createdUser.user.uid
            },
            timestamp: Date.now()
        })

        newWorkspaceRef.collection("workspaceUsers").doc(createdUser.user.uid).set({
            uid: createdUser.user.uid,
            name: createdUser.user.displayName,
            nameLowerCase: createdUser.user.displayName.toLowerCase(),
            email: createdUser.user.email,
            avatar: createdUser.user.photoURL,
            workspaceAdmin: true
        })


        return this.usersRef.doc(createdUser.user.uid).set({
            uid: createdUser.user.uid,
            workspaceId: newWorkspaceRef.id,
            name: createdUser.user.displayName,
            email: createdUser.user.email,
            avatar: createdUser.user.photoURL,
            timestamp: Date.now()
        })
    }

    clearErrors = () => {
        this.setState({
            errors: ""

        })


    }


    render() {

        const { firstName, lastName, workspaceName, email, password, passwordConfirmation, validated, loading, errors } = this.state;

        return (
            <Container fluid style={{ height: "100vh" }} >
                <Row noGutters={true} className="h-100">
                    <Col lg={6} md={12} sm={12} xs={12} className="align-self-center px-md-5">
                        <h1>
                            Get started with Teamin.
                        </h1>
                        <p>
                            Setting up your Teamin account is always FREE. No credit card required.
                        </p>
                        <Form noValidate validated={validated} onSubmit={this.handleSubmit} style={{ marginTop: "30px" }}>
                            <Form.Row>
                                <Form.Group as={Col} controlId="firstName">

                                    <Form.Control
                                        required
                                        name="firstName"
                                        size="lg"
                                        type="text"
                                        placeholder='First name'
                                        minLength="1"
                                        pattern="^[a-zA-Z]+"
                                        value={firstName}
                                        onChange={this.handleChange}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        First name can only contain letters.
                            </Form.Control.Feedback>
                                </Form.Group>

                                <Form.Group as={Col} controlId="lastName">

                                    <Form.Control
                                        required
                                        name="lastName"
                                        size="lg"
                                        type="text"
                                        placeholder='Last name'
                                        minLength="1"
                                        pattern="^[a-zA-Z]+"
                                        value={lastName}
                                        onChange={this.handleChange}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        Last name can only contain letters.
                            </Form.Control.Feedback>
                                </Form.Group>
                            </Form.Row>

                            <Form.Group controlId="workspaceName">

                                <Form.Control
                                    required
                                    name="workspaceName"
                                    size="lg"
                                    type="text"
                                    placeholder='Workspace name'
                                    minLength="1"
                                    pattern="^[a-zA-Z0-9-]+"
                                    value={workspaceName}
                                    onChange={this.handleChange}
                                />
                                <Form.Control.Feedback type="invalid">
                                    Workspace name can only contain letters, numbers and dashes.
                            </Form.Control.Feedback>
                            </Form.Group>


                            <Form.Group controlId="email">
                                {/* <Form.Label>Your work email</Form.Label>    */}
                                <Form.Control
                                    required
                                    name="email"
                                    size="lg"
                                    type="email"
                                    placeholder='Your work email'
                                    value={email}
                                    onChange={this.handleChange}
                                />
                                <Form.Control.Feedback type="invalid">
                                    Please enter a valid email.
                        </Form.Control.Feedback>
                            </Form.Group>


                            <Form.Group controlId="password">
                                {/* <Form.Label>Password</Form.Label>    */}
                                <Form.Control
                                    required
                                    name="password"
                                    size="lg"
                                    type="password"
                                    minLength="8"
                                    placeholder='Password (minimum 8 characters)'
                                    value={password}
                                    onChange={this.handleChange}
                                />
                                <Form.Control.Feedback type="invalid">
                                    Password must be at least 8 characters.
                        </Form.Control.Feedback>
                            </Form.Group>


                            <Form.Group controlId="passwordConfirmation">
                                {/* <Form.Label>Confirm Password</Form.Label>    */}
                                <Form.Control
                                    required
                                    name="passwordConfirmation"
                                    size="lg"
                                    type="password"
                                    minLength="8"
                                    placeholder='Confirm password'
                                    value={passwordConfirmation}
                                    onChange={this.handleChange}
                                    isInvalid={!this.isPasswordValid()}
                                />
                                <Form.Control.Feedback type="invalid">
                                    Passwords must match.
                        </Form.Control.Feedback>
                            </Form.Group>


                            <Button
                                variant="primary"
                                size='lg'
                                type='submit'
                                block
                                onClick={this.handleSubmit}
                                disabled={loading}
                                style={{ marginTop: "30px" }}>
                                {loading ?
                                    <Spinner
                                        as="span"
                                        animation="border"
                                        size="lg"
                                        role="status"
                                        aria-hidden="true"
                                    /> : <strong>Create my Teamin account</strong>}

                            </Button>

                        </Form>
                        <div style={{ marginTop: "24px" }}></div>

                        <p className="text-center">Already using Teamin? <Link to="/signin">Sign in</Link></p>

                        <div style={{ marginTop: "24px" }}></div>

                        <Toast onClose={this.clearErrors} show={errors.length !== 0} delay={5000} autohide>
                            <Toast.Body><p style={{ color: "red" }}>{errors}</p></Toast.Body>
                        </Toast>


                    </Col>

                    <Col lg={6} className="d-none d-lg-block align-self-center">
                        Image Placeholder
                    </Col>

                </Row>
            </Container >
        )
    }

}

export default Signup;