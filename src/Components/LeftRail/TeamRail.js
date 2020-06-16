import React from 'react';
import firebase from "../../firebase"
import CreateTeamModal from "../Modals/CreateTeamModal"
import LoadingSpinner from '../Spinner/Spinner'
import { Button, Row, Col, Dropdown, ButtonGroup } from "react-bootstrap"
import { connect } from "react-redux"
import Avatar from "react-avatar"
import { setCurrentTeam } from '../../Actions/index'

class TeamRail extends React.Component {
    constructor(props) {
        super(props)

        this.teamsRef = firebase.firestore().collection('teams')

        this.state = {
            isLoading: false,
            teamList: [],
            firstLoad: true,
            activeTeam: ""
        }

        this.setActiveTeam = this.setActiveTeam.bind(this)

    }


    componentDidMount() {

        const { currentUser } = this.props;

        this.setState({
            isLoading: true
        })

        this.listener = this.teamsRef
            .doc(currentUser.uid)
            .collection("userTeams")
            .orderBy("timestamp", "desc")
            .onSnapshot(querySnapshot => {
                let loadedTeams = [];

                querySnapshot.forEach((doc) => {

                    loadedTeams.push(doc.data())

                    console.log(loadedTeams);
                });

                this.setState({
                    isLoading: false,
                    teamList: loadedTeams
                },
                    () => this.setFirstTeam()
                )
                console.log(this.state.teamList)

            }, (error) => {
                console.log("Error getting documents: ", error);
            });

    }

    setFirstTeam = () => {
        const { firstLoad, teamList } = this.state
        const firstTeam = teamList[0]
        if (firstLoad && teamList.length > 0) {
            this.props.setCurrentTeam(firstTeam)
            this.setActiveTeam(firstTeam)
        }
        this.setState({
            firstLoad: false
        })
    }

    setActiveTeam = (team) => {
        this.setState({
            activeTeam: team.teamId
        })

        console.log(team)
    }

    componentWillUnmount() {
        this.listener()
    }

    changeTeam = (team) => {
        this.setActiveTeam(team)
        this.props.setCurrentTeam(team)
    }

    displayTeamList = (teamList, isLoading) => {
        return isLoading ?
            <LoadingSpinner position="static" />
            : (teamList.length > 0 ?
                teamList.map((team) =>

                    <Button
                        className={team.teamId === this.state.activeTeam ? "active w-100 btn-teamRail" : "w-100 btn-teamRail"}
                        onClick={() => this.changeTeam(team)}
                        key={team.timestamp}>

                        <Row className="m-0 p-0 w-100">
                            <Col className="p-0 d-none d-md-block"
                            style={{textAlign: "center"}}
                                lg={2} md={2} sm={2} xs={2}>
                                <Avatar name={team.teamName} size="50" round={true} textSizeRatio={1.5} maxInitials={1}/>
                            </Col>
                            <Col className="trimText"
                                lg={10} md={10} sm={10} xs={10}>
                                <h5  className="trimText" style={{ marginBottom: "0", lineHeight: "1.35"}}>{team.teamName}</h5>
                                <p className="trimText" style={{ marginBottom: "0", lineHeight: "1.35"}}>{team.teamDescription}</p>
                            </Col>
                        </Row>


                    </Button>


                )
                : <p>Click on the button below to create a team.</p>
            )
    }

    render() {
        const { currentUser } = this.props;
        const { isLoading, teamList } = this.state;

        return (
            <Row className="leftRail w-100 "
                id="teamCollapse" >
                <Col className="p-0 h-100">

                    <h4 style={{ padding: "20px", textAlign: "left", margin: "0" }}>Your Team Space</h4>
                    {this.displayTeamList(teamList, isLoading)}

                    <CreateTeamModal
                        currentUser={currentUser}
                        buttonStyle={{
                            borderRadius: "0px",
                            bottom: "0px"
                        }}
                        setActiveTeam={this.setActiveTeam}
                        setCurrentTeam={this.props.setCurrentTeam}
                    />

                </Col>
            </Row>

        )
    }
}

export default connect(null, { setCurrentTeam })(TeamRail);