import React from 'react';
import firebase from '../../firebase'
import { Row, Col, Image, Card, OverlayTrigger, Popover, DropdownButton, ButtonGroup, Dropdown } from "react-bootstrap"
import { BsThreeDotsVertical, BsPencilSquare, BsTrash } from "react-icons/bs"
import moment from "moment"

class Messages extends React.Component {

    constructor(props) {
        super(props)

        this.messagesRef = firebase.firestore().collection('messages')

        this.state = {

        }

    }


    handleDelete = (message, currentTeam) => {

        this.messagesRef
            .doc(currentTeam.teamId)
            .collection("teamMessages")
            .doc(message.messageId)
            .delete()
            .then(() => {
                console.log("Message successfully deleted!");
            }).catch((error) => {
                console.error("Error deleting message: ", error);
            });

    }


    render() {

        const { message, currentUser, currentTeam } = this.props

        const isOwnMessage = message.user.id === currentUser.uid

        const messagePopover = (

            <Popover id="message-popover" >

                <Popover.Content style={{ padding: "2px" }}>
                    <strong>Emoticons!</strong>
                    {isOwnMessage ? (
                        <DropdownButton
                            as={ButtonGroup}
                            variant="light"
                            key="message-more-options"
                            id="message-more-options"
                            title={<BsThreeDotsVertical />}
                            flip
                        >

                            <Dropdown.Item
                                eventKey="Edit"
                                onClick={() => console.log("Edit")}
                                style={{ paddingLeft: "0.8rem" }}>

                                <BsPencilSquare style={{ marginRight: "0.8rem" }} /> Edit

                            </Dropdown.Item>

                            <Dropdown.Item
                                eventKey="Delete"
                                onClick={() => this.handleDelete(message, currentTeam)}
                                style={{ paddingLeft: "0.8rem" }}>

                                <BsTrash style={{ marginRight: "0.8rem" }} />Delete

                            </Dropdown.Item>

                        </DropdownButton>
                    ) : ""}

                </Popover.Content>

            </Popover>)


        return (
            <Row className={isOwnMessage ? "m-0 my-3 px-0 justify-content-end" : "m-0 my-3 px-0"} >


                <Card className="shadow-sm"
                    text={isOwnMessage ? "white" : ""}
                    style={{
                        maxWidth: "80%",
                        backgroundColor: isOwnMessage ? "#5B86E5" : "",
                    }}>

                    <OverlayTrigger trigger="click" placement="top-end" overlay={messagePopover} >
                        <Card.Body className="px-3 py-2">

                            <Card.Subtitle className="py-1 font-weight-light"
                                style={{ fontSize: "0.8rem" }}>
                                {isOwnMessage ? "" : message.user.name}
                                <span style={{ marginLeft: isOwnMessage ? "" : "1rem" }}>{moment(message.timestamp).format('MMMM Do, h:mm a')}</span>
                            </Card.Subtitle>
                            <Card.Text>
                                {message.content}
                            </Card.Text>

                        </Card.Body>
                    </OverlayTrigger>

                </Card>


            </ Row >
        )
    }

}


export default Messages