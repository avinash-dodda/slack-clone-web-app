import React from 'react';
import { Button, Row, Col } from "react-bootstrap"

class ChatRail extends React.Component {
    render() {
        return (
            <Row className="leftRail w-100 "
                id="chatCollapse" >
                <Col className="p-0 h-100 w-100">

                    <h4 style={{
                        padding: "20px",
                        textAlign: "left",
                        margin: "0"
                    }}>Your Chats</h4>

                </Col>
            </Row>
        )
    }
}

export default ChatRail;