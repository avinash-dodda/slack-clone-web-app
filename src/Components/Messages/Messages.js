import React from 'react';
import firebase from '../../firebase'
import MessagesHeader from "../Messages/MessagesHeader"
import MessageForm from "../Messages/MessageForm"
import Message from "../Messages/Message"
import CreatedNewTeam from "../Messages/CreatedNewTeam"
import { Col, Row } from 'react-bootstrap';


class Messages extends React.Component {

    constructor(props) {
        super(props)

        this.messagesRef = firebase.firestore().collection('messages')

        this.state = {
            messages: [],
            messagesLoading: true,
        }

    }

    componentDidMount() {
        const { currentTeam, currentUser } = this.props

        if (currentUser && currentTeam) {
            this.addListeners(currentTeam.teamId)
        }

    }




    addListeners = teamId => {
        this.addMessageListener(teamId)
    }

    addMessageListener = teamId => {
        const { messages } = this.state

        this.messageListener = this.messagesRef
            .doc(teamId)
            .collection("teamMessages")
            .orderBy("timestamp")
            .onSnapshot(querySnapshot => {
                let loadedMessages = [];

                var source = querySnapshot.metadata.hasPendingWrites ? "Local" : "Server";
                console.log(source, " message data: ");

                querySnapshot.forEach((doc) => {

                    loadedMessages.push(doc.data())

                });

                this.setState({
                    messages: loadedMessages,
                    messagesLoading: false
                })
                this.updateScroll()

            }, (error) => {
                console.log("Error getting messages: ", error);
            });

    }

    updateScroll = () => {

        const messageScroll = document.getElementById("messages-container")
        const isScrolledToBottom = messageScroll.scrollHeight - messageScroll.clientHeight <= messageScroll.scrollTop + 1

        if (!isScrolledToBottom) {
            messageScroll.scrollTop = messageScroll.scrollHeight - messageScroll.clientHeight
        }

    }

    displayMessages = () => {
        const { messages } = this.state
        const { currentUser, currentTeam } = this.props

        return (
            messages.length > 0
            && messages.map((message, index) =>
                <Message
                    key={index}
                    message={message}
                    currentUser={currentUser}
                    currentTeam={currentTeam} />
            )
        )

    }

    render() {
        const { currentTeam, currentUser, currentWorkspace } = this.props
        const { messages } = this.state



        return (

            <>
                <MessagesHeader currentTeam={currentTeam} />

                <Row className="m-0 px-0 justify-content-center messages"

                    id="messages-container">

                    <Col >
                        <Row className="mx-0 px-0 justify-content-center">
                            <Col xl={10} lg={10} md={12} sm={12} xs={12}>
                                {currentTeam === null ?
                                    "Please select a team space to display messages"
                                    :
                                    <CreatedNewTeam
                                        currentTeam={currentTeam}
                                        currentUser={currentUser}
                                        currentWorkspace={currentWorkspace} />
                                }
                                {this.displayMessages()}
                            </Col>
                        </Row>
                    </Col>

                </Row>


                <MessageForm
                    currentTeam={currentTeam}
                    currentUser={currentUser} />
            </>

        )

    }
}

export default Messages