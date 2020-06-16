import * as actionTypes from './types'

// workspace actions
export const setWorkspace = workspace => {
    return{
        type: actionTypes.SET_WORKSPACE,
        payload: {
            currentWorkspace: workspace
        }
    }
}

export const clearWorkspace = () => {
    return{
        type: actionTypes.CLEAR_WORKSPACE,

    }
}

// user actions
export const setUser = user => {
    return{
        type: actionTypes.SET_USER,
        payload: {
            currentUser: user
        }
    }
}

export const clearUser = () => {
    return{
        type: actionTypes.CLEAR_USER,

    }
}

// Team actions
export const setCurrentTeam = team => {
    return{
        type: actionTypes.SET_CURRENT_TEAM,
        payload: {
            currentTeam: team
        }

    }
}
