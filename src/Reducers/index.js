import { combineReducers } from 'redux';
import * as actionTypes from '../Actions/types'

// workspace reducer
const initialWorkspaceState = {
    currentWorkspace: null,
    isLoading: true
}


const workspaceReducer = (state = initialWorkspaceState, action) => {
    switch (action.type) {
        case (actionTypes.SET_WORKSPACE):
            return {
                ...state,
                currentWorkspace: action.payload.currentWorkspace,
                isLoading: false
            }
        case (actionTypes.CLEAR_WORKSPACE):
                return {
                    ...state,
                    currentWorkspace: null,
                    isLoading: false
                }

        default:
            return state;
    }

}




// user reducer
const initialUserState = {
    currentUser: null,
    isLoading: true
}


const userReducer = (state = initialUserState, action) => {
    switch (action.type) {
        case (actionTypes.SET_USER):
            return {
                currentUser: action.payload.currentUser,
                isLoading: false
            }
        case (actionTypes.CLEAR_USER):
            return {
                ...state,
                currentUser: null,
                isLoading: false
            }
        default:
            return state;
    }

}

// Team reducer
const initialTeamState = {
    currentTeam: null
}

const teamReducer = (state = initialTeamState, action) =>{
    switch (action.type) {
        case (actionTypes.SET_CURRENT_TEAM):
            return {
                ...state,
                currentTeam: action.payload.currentTeam
            }
        default:
            return state;
    }
}

const rootReducer = combineReducers({
    workspace: workspaceReducer,
    user: userReducer,
    team: teamReducer
})

export default rootReducer;