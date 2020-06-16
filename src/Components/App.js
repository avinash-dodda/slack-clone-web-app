import React from 'react';
import { Container, Col, Row } from 'react-bootstrap';
import { connect } from 'react-redux';
import TopNavBar from './TopNavBar/TopNavBar'
import LeftAppBar from './LeftAppBar/LeftAppBar'
import Messages from './Messages/Messages'




const App = ({ currentUser, currentTeam, currentWorkspace }) => (

  <Container fluid style={{ padding: "0", height: "100vh" }}>

    <Row className="m-0 p-0">

      <Col className="m-0 p-0">
        <TopNavBar currentWorkspace={currentWorkspace}/>
      </Col>
      
    </Row>

    <Row className="m-0 p-0"
      style={{ height: "calc(100% - 56px)" }}>
      
      <Col className="m-0 p-0"
        lg={4} md={6} sm={6} xs={6}
      >
        <LeftAppBar
          key={currentUser && currentUser.uid}
          currentUser={currentUser}
          currentWorkspace={currentWorkspace} />
      </Col>

      <Col className="m-0 p-0 bg-light"
        lg={8} md={6} sm={6} xs={6}
      >
        <Messages
          key={currentTeam && currentTeam.teamId}
          currentTeam={currentTeam}
          currentUser={currentUser}
          currentWorkspace={currentWorkspace} />
      </Col>

    </Row>

  </Container>

)




const mapStateToProps = state => ({
  currentUser: state.user.currentUser,
  currentWorkspace: state.workspace.currentWorkspace,
  currentTeam: state.team.currentTeam
})

export default connect(mapStateToProps)(App);
