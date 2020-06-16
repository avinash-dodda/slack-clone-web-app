import React from 'react';
import firebase from '../../firebase'
import { Container, Row, Col, Form, Button, Spinner, Toast } from 'react-bootstrap'
import { Link } from 'react-router-dom'

class Signin extends React.Component {
    constructor() {
        super()

        this.state = {
            email: '',
            password: '',
            validated: false,
            loading: false,
            errors: "",
        }
        this.handleChange = this.handleChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
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
        } else {

            this.setState({
                loading: true
            })

            firebase
                .auth()
                .signInWithEmailAndPassword(this.state.email, this.state.password)
                .then(signedInUser => {
                    console.log(signedInUser)
                    this.setState({
                        loading: false
                    })
                })
                .catch(err => {
                    console.log(err);
                    this.setState({
                        errors: err.message,
                        loading: false
                    })
                })
        }

    };



    clearErrors = () => {
        this.setState({
            errors: ""

        })

    }


    render() {

        const { email, password, validated, loading, errors } = this.state;

        return (
            <Container fluid style={{ height: "100vh" }}>
                <Row noGutters={true} className="h-100">
                    <Col lg={4} className="d-none d-lg-block align-self-center">

                    </Col>
                    <Col lg={4} md={12} sm={12} xs={12} className="align-self-center px-md-5 shadow">
                        <div style={{ marginTop: "24px" }}></div>

                        <h1 style={{ textAlign: "center" }}>
                            Sign in to Teamin.
                        </h1>
                        <p style={{ textAlign: "center" }}>
                            Enter your email address and password.
                        </p>
                        <Form noValidate validated={validated} onSubmit={this.handleSubmit} style={{ marginTop: "30px" }}>


                            <Form.Group controlId="email">
                                {/* <Form.Label>Your work email</Form.Label>    */}
                                <Form.Control
                                    required
                                    name="email"
                                    size="lg"
                                    type="email"
                                    placeholder='you@yourcompany.com'
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
                                    placeholder='password'
                                    value={password}
                                    onChange={this.handleChange}
                                />
                                <Form.Control.Feedback type="invalid">
                                    Please enter a valid password.
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
                                    /> : <strong>Sign in</strong>}

                            </Button>

                        </Form>
                        <div style={{ marginTop: "24px" }}></div>

                        <p className="text-center">Don't have an account? <Link to="/signup">Sign up</Link></p>

                        <div style={{ marginTop: "24px" }}></div>

                        <Toast onClose={this.clearErrors} show={errors.length !== 0} delay={5000} autohide>
                            <Toast.Body><p style={{ color: "red" }}>{errors}</p></Toast.Body>
                        </Toast>


                    </Col>



                </Row>
            </Container>
        )
    }

}

export default Signin;