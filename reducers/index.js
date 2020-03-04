

export const routeReducer = (state=null, action) => {

    switch (action.type) {
    case "SET_ROUTE":
        return action.route;
    default:
        return state;
    }
};


export const socketConnectionReducer = (state=false, action) => {

    switch (action.type) {
    case "SOCKET_CONNECTED":
        return true;
    case "SOCKET_DISCONNECTED":
        return false;
    default:
        return state;
    }
};


export const socketConnectionFailureReducer = (state=false, action) => {

    switch (action.type) {
    case "SOCKET_RECONNECT_FAILED":
        return true;
    default:
        return state;
    }
};


export const reconnectionHandler = (state, policy) => {
    if (!policy) {
        return null;
    }
    if (!state) {
        return [0, 0];
    }
    if (policy[state[0]][0] === "*" || policy[state[0]][0] > state[1]) {
        return [state[0], state[1] + 1];
    }

    if (policy.length > state[0] + 1) {
        return [state[0] + 1, 0];
    }
    return null;
};


export const socketReconnectionReducer = (state=null, action) => {
    const {policy, type} = action;
    switch (type) {
    case "SOCKET_RECONNECT":
        return reconnectionHandler(state, policy);
    default:
        return state;
    }
};


export const routeRequestReducer = (state=null, action) => {

    switch (action.type) {
    case "OPEN_ROUTE_REQUEST":
        return action.route;
    case "CLOSE_ROUTE_REQUEST":
        return null;
    default:
        return state;
    }
};


export const settingsReducer = (state={}, action) => {

    switch (action.type) {
    case "SET_SETTINGS":
        return action.settings;
    default:
        return state;
    }
};


export const apiReducer = (state={}, action) => {

    switch (action.type) {
    case "SET_API":
        state[action.api] = action.data;
        return state;
    case "CONSUME_API":
        delete state[action.api];
        return state;
    default:
        return state;
    }
};


export const dataReducer = (state=null, action) => {

    switch (action.type) {
    case "SET_DATA":
        return action.data;
    case "UPDATE_DATA":
        return {
            ...((state || {}) || {}),
            ...action.data};
    default:
        return state;
    }
};


export const titleReducer = (state=null, action) => {

    switch (action.type) {
    case "SET_TITLE":
        return action.title;
    default:
        return state;
    }
};


export const userReducer = (state=null, action) => {

    switch (action.type) {
    case "LOGIN":
        return action.user;
    case "LOGOUT":
        return null;
    default:
        return state;
    }
};


export const modalReducer = (state=false, action) => {

    switch (action.type) {
    case "OPEN_MODAL":
        return action.modal;
    case "CLOSE_MODAL":
        return false;
    default:
        return state;
    }
};


export const modalDataReducer = (state=null, action) => {

    switch (action.type) {
    case "SET_MODAL_DATA":
        return action.data;
    case "UPDATE_MODAL_DATA":
        return {...(state || {}), ...action.data};
    case "CLEAR_MODAL_DATA":
        return null;
    default:
        return state;
    }
};


export const modalResponseReducer = (state=null, action) => {

    switch (action.type) {
    case "SET_MODAL_RESPONSE":
        return action.response;
    case "CLEAR_MODAL_RESPONSE":
        return null;
    default:
        return state;
    }
};


export const withReducers = (reducers) => {
    return Object.assign(
        {},
        {route: routeReducer,
         routeRequest: routeRequestReducer,
         connected: socketConnectionReducer,
         reconnect: socketReconnectionReducer,
         connectionFailed: socketConnectionFailureReducer,
         user: userReducer,
         data: dataReducer,
         title: titleReducer,
         settings: settingsReducer,
         api: apiReducer,
         modal: modalReducer,
         modalData: modalDataReducer,
         modalResponse: modalResponseReducer},
        reducers || {});
};
