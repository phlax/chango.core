

export const login = (user) => {
    return {user, type: "LOGIN"};
};


export const logout = (user) => {
    return {user, type: "LOGOUT"};
};


export const setRoute = (route) => {
    return {route, type: "SET_ROUTE"};
};


export const socketReconnectionFailed = () => {
    return {type: "SOCKET_RECONNECT_FAILED"};
};


export const socketConnected = () => {
    return {type: "SOCKET_CONNECTED"};
};


export const socketDisconnected = () => {
    return {type: "SOCKET_DISCONNECTED"};
};


export const socketReconnect = (policy) => {
    return {type: "SOCKET_RECONNECT", policy};
};


export const openRouteRequest = (route) => {
    return {route, type: "OPEN_ROUTE_REQUEST"};
};


export const closeRouteRequest = () => {
    return {type: "CLOSE_ROUTE_REQUEST"};
};


export const setSettings = (settings) => {
    return {settings, type: "SET_SETTINGS"};
};


export const setTitle = (title) => {
    return {title, type: "SET_TITLE"};
};


export const setData = (data, route, settings) => {
    return {data, route, settings, type: "SET_DATA"};
};


export const updateData = (data, route) => {
    return {data, route, type: "UPDATE_DATA"};
};


export const setAPI = (api, data) => {
    return {api, data, type: "SET_API"};
};


export const consumeAPI = (api) => {
    return {api, type: "CONSUME_API"};
};


export const openModal = (modal) => {
    return {
	modal,
	type: "OPEN_MODAL"
    };
};


export const  closeModal = () => {
    return {
	type: "CLOSE_MODAL"
    };
};


export const  setModalData = (data) => {
    return {
	data,
	type: "SET_MODAL_DATA"
    };
};


export const  updateModalData = (data) => {
    return {
	data,
	type: "UPDATE_MODAL_DATA"
    };
};


export const  clearModalData = () => {
    return {
	type: "CLEAR_MODAL_DATA"
    };
};


export const  setModalResponse = (response) => {
    return {
	response,
	type: "SET_MODAL_RESPONSE"
    };
};


export const  clearModalResponse = () => {
    return {
	type: "CLEAR_MODAL_RESPONSE"
    };
};


export default {
    login, logout, setRoute, setSettings, setTitle,
    consumeAPI, socketConnected, socketDisconnected,
    socketReconnect,
    setData, setAPI, updateData,
    openModal, closeModal,
    setModalData, clearModalData, updateModalData,
    setModalResponse, clearModalResponse};
