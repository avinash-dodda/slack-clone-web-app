import React from 'react';
import ReactDOM from 'react-dom';
import './Components/App.css'
import App from './Components/App';
import Signin from './Components/Auth/Signin.js';
import Signup from './Components/Auth/Signup.js';
// import Verify from './Components/Auth/Verify.js'
import * as serviceWorker from './serviceWorker';
import firebase from './firebase'

// import 'semantic-ui-css/semantic.min.css';

import 'bootstrap/dist/css/bootstrap.min.css';

import { BrowserRouter as Router, Switch, Route, withRouter } from 'react-router-dom'

import { createStore } from 'redux';
import { Provider, connect } from 'react-redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import rootReducer from './Reducers/index.js';
import { setUser, setWorkspace, clearUser, clearWorkspace } from './Actions/index'
import LoadingSpinner from './Components/Spinner/Spinner.js';

const store = createStore(rootReducer, composeWithDevTools())


class Root extends React.Component {

  constructor(props) {
    super(props)

    this.usersRef = firebase.firestore().collection('users')
    this.workspacesRef = firebase.firestore().collection('workspaces')

    this.state = {

    }

  }


  componentDidMount() {

    this.authListener = firebase.auth().onAuthStateChanged(user => {
      // if(user && user.emailVerified === false){
      //   this.props.setUser(user)
      //   this.props.history.replace("/verify")
      // } else 

      if (user) {
        this.props.setUser(user)
        this.getWorkspace(user)
      } else {
        this.props.history.replace("/signin")
        this.props.clearUser();
        this.props.clearWorkspace();
      }
    })
  }

  componentWillUnmount() {
    this.authListener()
  }

  getWorkspace = (user) => {

    this.usersRef.doc(user.uid).get().then(userDoc => {

      if (userDoc.exists) {
        this.workspacesRef.doc(userDoc.data().workspaceId).get().then(workspaceDoc => {

          if (workspaceDoc.exists) {
            this.props.setWorkspace(workspaceDoc.data())
            this.props.history.replace("/")

          } else {
            console.log("No such workspace document!");
          }

        }).catch(error => {
          console.log("Error getting workspace document:", error);
        })

      } else {
        // doc.data() will be undefined in this case
        console.log("No such user document!");
      }

    }).catch(error => {
      console.log("Error getting user document:", error);
    });

  }

  render() {
    return this.props.isLoading ? <LoadingSpinner /> : (
      <Switch>
        <Route exact path="/" component={App} />
        <Route path="/signin" component={Signin} />
        <Route path="/signup" component={Signup} />
        {/* <Route path="/verify" component={Verify} /> */}
      </Switch>
    )
  }

}

const mapStateToProps = state => ({

  isLoading: state.user.isLoading || state.workspace.isLoading

})

const RootWithAuth = withRouter(connect(mapStateToProps, { setUser, setWorkspace, clearUser, clearWorkspace})(Root));

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <Router>
        <RootWithAuth />
      </Router>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register();
