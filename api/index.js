
import {createBrowserHistory} from "history";
import {combineReducers, createStore} from "redux";

import Cookies from "js-cookie";

import {
    login,
    closeRouteRequest, consumeAPI, openRouteRequest,
    socketConnected, socketDisconnected, socketReconnect,
    socketReconnectionFailed,
    setAPI, setData, setRoute, updateData,
    setSettings, setTitle, setModalData, clearModalData,
    clearModalResponse, openModal} from "../actions";
import {Modal} from "./modal";


export class API {

    // try every 10s x12 (ie 2mins)
    // try every 1m x10 (ie 10mins)
    // try every 5m forever
    defaultReconnectionPolicy = [
        [12, 10],
        [10, 60],
        ["*", 300]];
    defaultSocketAddress = "ws://" + window.location.host + "/ws";
    settingReconnectionPolicy = "channels.core.reconnection_policy";
    settingSocketAddress = "channels.core.socket_address";

    constructor (props) {
        this.props = props;
        this.startApp();
        this.unloading = false;
    }

    get socketAddress () {
        return (
            this.getState("settings")[this.settingSocketAddress]
                || this.defaultSocketAddress);
    }

    get reconnectionPolicy () {
        const {reconnectionPolicy} = this.props;
        return (
            this.getState("settings")[this.settingReconnectionPolicy]
                || reconnectionPolicy
                || this.defaultReconnectionPolicy);
    }

    startApp () {
        const {Channels: ChannelsData} = window;
        const {
            columns={},
            reducers={},
            modals={}} = this.props;
        const {
            data, route,
            settings, title, user} = ChannelsData;
        this.modals = modals;
        this.columns = columns;
        this.store = this.createStore(reducers);
        this.dispatch(setTitle(title));
        if (user && !user.is_anon) {
            this.dispatch(login(user));
        }
        this.dispatch(setRoute(route));
        this.dispatch(setSettings(settings));
        this.dispatch(setData(data, route, settings));
        this.history = createBrowserHistory();
        this.socket = this.openSocket();
    }

    openSocket () {
        const socket = new WebSocket(this.socketAddress);
        socket.onmessage = this.onSocketMessage;
        socket.onclose = this.onSocketClose;
        socket.onopen = this.onSocketOpen;
        return socket;
    }

    createStore (reducers) {
        return createStore(
            combineReducers(reducers),
            (window.__REDUX_DEVTOOLS_EXTENSION__
             && window.__REDUX_DEVTOOLS_EXTENSION__()));
    }

    handleCookies = (cookies) => {
        for (let cookie of Object.keys(cookies)) {
            Cookies.set(cookie, cookies[cookie]);
        }
    };

    handleRoute = (route) => {
        const currentRoute = this.getState("route");
        const {data, route: path} = route;
        this.dispatch(closeRouteRequest());
        if (data) {
            this.dispatch(setData(data, path));
        }
        if (currentRoute !== path) {
            this.dispatch(setRoute(path));
            this.history.push(path);
        }
    };

    handleRedirect = (redirect) => {
        window.location.assign(redirect);
    };

    handleAPI = (api) => {
        Object.keys(api).forEach(k => {
            this.dispatch(setAPI(k, api[k]));
        });
    };

    loadMessage = (msg) => {
        return JSON.parse(msg);
    };

    dumpMessage = (msg) => {
        return JSON.stringify(msg);
    };

    logMessage = () => {
        // console.log("recv", data);
    };

    onSocketMessage = (e) => {
        const data = this.loadMessage(e.data);
        const {api, cookies, route, redirect} = data;
        this.logMessage(data);
        if (cookies) {
            this.handleCookies(cookies);
        }
        if (redirect) {
            this.handleRedirect(redirect);
        } else if (route) {
            this.handleRoute(route);
        } else if (api) {
            this.handleAPI(api);
        }
    };

    onSocketClose = (e) => {
        if (e.wasClean) {
            return;
        }
        if (this.getState("connected")) {
            this.dispatch(socketDisconnected());
        }
        if (!this.getState("reconnect") && !this.getState("connectionFailed")) {
            this.reconnect();
        }
    };

    reconnect = () => {
        if (this.getState("connected")) {
            return;
        }
        const policy = this.reconnectionPolicy;
        this.dispatch(socketReconnect(policy));
        const reconnect = this.getState("reconnect");
        if (reconnect) {
            this.socket = this.openSocket();
            setTimeout(
                this.reconnect,
                policy[reconnect[0]][1] * 1000);
        } else {
            this.dispatch(socketReconnectionFailed());
        }
    };

    onSocketOpen = () => {
        this.dispatch(socketConnected());
        if (this.getState("reconnect")) {
            this.dispatch(socketReconnect(false));
        }
    };

    send = (msg) => {
        if (msg.route) {
            this.dispatch(openRouteRequest(msg.route));
        }
        this.socket.send(this.dumpMessage(msg));
    };

    subscribeAPI = ({api, nostate, resolve, unsubscribe}) => {
        const response = this.consume(api);
        if (response === undefined) {
            return;
        }
        if (!nostate) {
            this.dispatch(updateData(response));
        }
        resolve(response);
        unsubscribe();
    };

    callAPI = ({api, msg, nostate}, resolve) => {
        msg.api = api;
        this.send(msg);
        const args = {api, nostate, resolve};
        args.unsubscribe = this.subscribe(
            this.subscribeAPI.bind(this, args));
    };

    call = async (api, msg, nostate) => {
        return new Promise(
            this.callAPI.bind(
                this, {api, msg, nostate}));
    };

    consume = (k) => {
        const api = this.getState("api") || {};
        const v = api[k];
        if (k in api) {
            this.dispatch(consumeAPI(k));
        }
        return v;
    };

    setting = (k) => {
        return (this.getState("settings") || {})[k];
    };

    subscribeModal = ({modal, resolve, unsubscribe}) => {
        const {response} = this.getState("modalResponse") || {};
        const {modal: current} = this.getState("modal") || {};
        if (response === undefined && modal === current) {
            return;
        }
        unsubscribe();
        this.dispatch(clearModalData());
        this.dispatch(clearModalResponse());
        resolve(response);
    };

    openModal = ({modal, data, interactive}, resolve) => {
        this.dispatch(setModalData(data));
        this.dispatch(openModal(modal));
        if (interactive) {
            return resolve(new Modal(modal, this));
        }
        const args = {modal, resolve};
        args.unsubscribe = this.subscribe(
            this.subscribeModal.bind(this, args));
    };

    modal = async (modal, data, interactive) => {
        return new Promise(
            this.openModal.bind(
                this, {modal, data, interactive}));
    };

    getColumns (columns, update) {
        return columns.map(c => {
            if (!update || update.indexOf(c) === -1) {
                return this.columns[c];
            }
            return {...this.columns[c], ...update[c]};
        });
    }

    getData = (k) => {
        return (this.getState("data") || {})[k];
    };

    getState = (k) => {
        if (k) {
            return this.useSelector(s => s[k]);
        }
        return this.store.getState();
    };

    useSelector = (fn) => {
        return fn(this.store.getState());
    };

    dispatch = (action) => {
        return this.store.dispatch(action);
    };

    subscribe = (fn) => {
        return this.store.subscribe(fn);
    };
}
