import React from 'react';
import firebase from '../../firebase'
import { Row, Col, InputGroup, FormControl, Button, Form } from "react-bootstrap"
import { IoIosSend } from "react-icons/io"

class MessageForm extends React.Component {

    constructor(props) {
        super(props)

        this.messagesRef = firebase.firestore().collection('messages')

        this.state = {
            message: "",
            loading: false,
            buttonDisable: true
        }
        this.handleChange = this.handleChange.bind(this)
        this.sendMessage = this.sendMessage.bind(this)
    }

    handleChange(event) {
        const { message } = this.state
        this.setState({
            [event.target.name]: event.target.value,
        });

        if (event.target.value === "") {
            this.setState({
                buttonDisable: true
            })
        } else {
            this.setState({
                buttonDisable: false
            })
        }
    };

    sendMessage = (event) => {
        event.preventDefault();
        event.stopPropagation();

        const { message } = this.state
        const { currentTeam, currentUser } = this.props

        if (message) {
            this.setState({
                loading: true
            })
            var newMessageRef = this.messagesRef.doc(currentTeam.teamId).collection("teamMessages").doc()


            newMessageRef.set({
                content: message,
                timestamp: Date.now(),
                messageId: newMessageRef.id,
                user: {
                    name: currentUser.displayName,
                    id: currentUser.uid
                }

            }).then(() => {
                console.log('message saved');
                this.setState(() => {
                    return {
                        loading: false,
                        message: ""
                    }
                })
            }).catch(err => {
                console.error(err);
            })


        } else {
            console.log("Please add a message")
        }


    };
    render() {
        const { message, buttonDisable, loading } = this.state
        const { currentUser } = this.props
        return (
            <Row className="m-0 px-0 align-self-end justify-content-center"
                style={{ minHeight: "56px" }}>
                <Col className="m-0 p-3"
                    xl={10} lg={10} md={12} sm={12} xs={12}>
                    <Form>
                        <InputGroup >

                            <FormControl
                                required
                                name="message"
                                type="text"
                                autoComplete="off"
                                placeholder="Type your message. Use @ to mention someone."
                                value={message}
                                onChange={this.handleChange}
                            />
                            <InputGroup.Append>
                                <Button
                                    id="sendMessage"
                                    onClick={this.sendMessage}
                                    disabled={buttonDisable && !loading}
                                    type="submit"
                                    variant="info"
                                    
                                >
                                    <IoIosSend />
                                </Button>
                            </InputGroup.Append>
                        </InputGroup>
                    </Form>

                </Col>
            </Row>
        )

    }
}

export default MessageForm