
import {createBrowserHistory} from "history";
import {combineReducers, createStore} from "redux";

import Cookies from "js-cookie";

import * as actions from "@chango/core/actions";

import Channels, {API} from "@chango/core";


jest.mock( "redux", () => {
    return {
        createStore: jest.fn(() => {
            return {store: "STORE"};
        }),
        combineReducers: jest.fn(() => {
            return {combined: "COMBINED"};
        })};
});


jest.mock( "history", () => {
    return {
        createBrowserHistory: jest.fn(() => "HISTORY")};
});


jest.mock( "@chango/core/actions", () => {
    return {
        login: jest.fn(() => "LOGIN"),
        logout: jest.fn(() => "LOGOUT"),
        setData: jest.fn(() => "SET_DATA"),
        setAPI: jest.fn(() => "SET_API"),
        setRoute: jest.fn(() => "SET_ROUTE"),
        setTitle: jest.fn(() => "SET_TITLE"),
        socketConnected: jest.fn(() => "CONNECTED"),
        socketDisconnected: jest.fn(() => "DISCONNECTED"),
        socketReconnect: jest.fn(() => "RECONNECT"),
        socketReconnectionFailed: jest.fn(() => "RECONNECT FAILED"),
        closeRouteRequest: jest.fn(() => "CLOSE_ROUTE_REQUEST"),
        openRouteRequest: jest.fn(() => "OPEN_ROUTE_REQUEST"),
        setSettings: jest.fn(() => "SET_SETTINGS"),
        consumeAPI: jest.fn(() => "CONSUME_API"),
        updateData: jest.fn(() => "UPDATE_DATA"),
    };
});


let startApp, openSocket, ws;
const connection = {};


beforeEach(() => {
    startApp = API.prototype.startApp;
    openSocket = API.prototype.openSocket;
    ws = global.WebSocket;
    API.prototype.startApp = jest.fn();
    global.WebSocket = jest.fn(() => connection);
});


afterEach(() => {
    API.prototype.startApp = startApp;
    global.WebSocket = ws;
    combineReducers.mockClear();
    createStore.mockClear();
    actions.setRoute.mockClear();
    actions.setData.mockClear();
    actions.login.mockClear();
    actions.logout.mockClear();
    actions.setTitle.mockClear();
    actions.setSettings.mockClear();
    actions.socketReconnect.mockClear();
    actions.socketReconnectionFailed.mockClear();
    actions.updateData.mockClear();
});


test("API constructor", () => {
    expect(Channels.API).toBe(API);
    const app = {foo: "bar"};
    const api = new API(app);
    expect(api.props).toEqual(app);
    expect(API.prototype.startApp.mock.calls).toEqual([[]]);
    expect(api.settingReconnectionPolicy).toEqual(
        "channels.core.reconnection_policy");
    expect(api.settingSocketAddress).toEqual(
        "channels.core.socket_address");
});


test("startApp", () => {
    const props = {foo: "bar"};
    const api = new API(props);
    API.prototype.startApp = startApp;
    global.window.Channels = {
        title: "TITLE",
        data: {foo: "BAR"},
        route: "ROUTE",
        settings: {settings: "SETTINGS"}};
    const dispatch = jest.fn();
    api.createStore = jest.fn(() => ({dispatch}));
    api.openSocket = jest.fn(() => "SOCKET");

    api.startApp(props);
    expect(api.createStore.mock.calls).toEqual([[{}]]);
    expect(api.modals).toEqual({});
    expect(dispatch.mock.calls).toEqual(
        [["SET_TITLE"],
         ["SET_ROUTE"],
         ["SET_SETTINGS"],
         ["SET_DATA"]]);
    expect(actions.login.mock.calls).toEqual([]);
    expect(actions.setTitle.mock.calls).toEqual([["TITLE"]]);
    expect(actions.setData.mock.calls).toEqual(
        [[{foo: "BAR"}, "ROUTE", {settings: "SETTINGS"}]]);
    expect(actions.setRoute.mock.calls).toEqual([["ROUTE"]]);
    expect(actions.setSettings.mock.calls).toEqual([[{settings: "SETTINGS"}]]);
    expect(api.socket).toEqual("SOCKET");
    expect(api.history).toEqual("HISTORY");
    expect(api.openSocket.mock.calls).toEqual([[]]);
    expect(createBrowserHistory.mock.calls).toEqual([[]]);
    api.createStore.mockClear();
    api.openSocket.mockClear();
    createBrowserHistory.mockClear();
    actions.setTitle.mockClear();
    actions.setData.mockClear();
    actions.setRoute.mockClear();
    actions.setSettings.mockClear();
    dispatch.mockClear();

    global.window.Channels = {
        title: "TITLE",
        data: {foo: "BAR"},
        user: {"is_anon": true, username: "NOBODY"},
        route: "ROUTE",
        settings: {settings: "SETTINGS"}};
    api.startApp(props);
    expect(api.createStore.mock.calls).toEqual([[{}]]);
    expect(api.modals).toEqual({});
    expect(dispatch.mock.calls).toEqual(
        [["SET_TITLE"],
         ["SET_ROUTE"],
         ["SET_SETTINGS"],
         ["SET_DATA"]]);
    expect(actions.login.mock.calls).toEqual([]);
    expect(actions.setTitle.mock.calls).toEqual([["TITLE"]]);
    expect(actions.setData.mock.calls).toEqual(
        [[{foo: "BAR"}, "ROUTE", {settings: "SETTINGS"}]]);
    expect(actions.setRoute.mock.calls).toEqual([["ROUTE"]]);
    expect(actions.setSettings.mock.calls).toEqual([[{settings: "SETTINGS"}]]);
    expect(api.socket).toEqual("SOCKET");
    expect(api.history).toEqual("HISTORY");
    expect(api.openSocket.mock.calls).toEqual([[]]);
    expect(createBrowserHistory.mock.calls).toEqual([[]]);
    api.createStore.mockClear();
    api.openSocket.mockClear();
    createBrowserHistory.mockClear();
    actions.setTitle.mockClear();
    actions.setData.mockClear();
    actions.setRoute.mockClear();
    actions.setSettings.mockClear();
    dispatch.mockClear();

    global.window.Channels = {
        title: "TITLE",
        data: {foo: "BAR"},
        user: {"is_anon": false, username: "SOMEBODY"},
        route: "ROUTE",
        settings: {settings: "SETTINGS"}};
    api.startApp(props);
    expect(api.createStore.mock.calls).toEqual([[{}]]);
    expect(api.modals).toEqual({});
    expect(dispatch.mock.calls).toEqual(
        [["SET_TITLE"],
         ["LOGIN"],
         ["SET_ROUTE"],
         ["SET_SETTINGS"],
         ["SET_DATA"]]);
    expect(actions.login.mock.calls).toEqual([[global.window.Channels.user]]);
    expect(actions.setTitle.mock.calls).toEqual([["TITLE"]]);
    expect(actions.setData.mock.calls).toEqual(
        [[{foo: "BAR"}, "ROUTE", {settings: "SETTINGS"}]]);
    expect(actions.setRoute.mock.calls).toEqual([["ROUTE"]]);
    expect(actions.setSettings.mock.calls).toEqual([[{settings: "SETTINGS"}]]);
    expect(api.socket).toEqual("SOCKET");
    expect(api.history).toEqual("HISTORY");
    expect(api.openSocket.mock.calls).toEqual([[]]);
    expect(createBrowserHistory.mock.calls).toEqual([[]]);
    api.createStore.mockClear();
    api.openSocket.mockClear();
    createBrowserHistory.mockClear();

    props.modals = {modal: "MODAL"};
    props.reducers = {reducer: "REDUCER"};
    api.startApp(props);
    expect(api.createStore.mock.calls).toEqual([[{reducer: "REDUCER"}]]);
    expect(api.modals).toEqual({modal: "MODAL"});
    expect(api.socket).toBe("SOCKET");
    expect(api.history).toEqual("HISTORY");
    expect(api.openSocket.mock.calls).toEqual([[]]);
    expect(createBrowserHistory.mock.calls).toEqual([[]]);

    delete global.window.Channels;
});


test("openSocket", () => {

    class DummyAPI extends API {
        address = jest.fn(() => "SOCKET ADDRESS");

        get socketAddress () {
            return this.address();
        }
    }

    const app = {};
    const api = new DummyAPI(app);
    API.prototype.openSocket = openSocket;
    const socket = api.openSocket(app);
    expect(global.WebSocket.mock.calls).toEqual([["SOCKET ADDRESS"]]);
    expect(api.address.mock.calls).toEqual([[]]);
    expect(socket).toBe(connection);
    expect(socket.onmessage).toBe(api.onSocketMessage);
    expect(socket.onopen).toBe(api.onSocketOpen);
    expect(socket.onclose).toBe(api.onSocketClose);
});


test("createStore", () => {
    const app = {};
    const api = new API(app);
    const reducers = {reducer: "REDUCER"};
    const store =  api.createStore(reducers);
    expect(store).toEqual({store: "STORE"});
    expect(combineReducers.mock.calls).toEqual([[reducers]]);
    expect(createStore.mock.calls).toEqual([[{combined: "COMBINED"}, undefined]]);
});


test("createStore with devtools", () => {
    const app = {};
    const api = new API(app);
    const reducers = {reducer: "REDUCER"};
    const ext = jest.fn(() => ({ext: "redux"}));
    global.window.__REDUX_DEVTOOLS_EXTENSION__ = ext;
    const store = api.createStore(reducers);
    expect(ext.mock.calls).toEqual([[]]);
    expect(store).toEqual({store: "STORE"});
    expect(combineReducers.mock.calls).toEqual([[reducers]]);
    expect(createStore.mock.calls).toEqual([[{combined: "COMBINED"}, {ext: "redux"}]]);
});


test("send", () => {
    const app = {};
    const api = new API(app);
    api.dumpMessage = jest.fn(() => "STRING");
    api.dispatch = jest.fn(() => {});
    api.socket = {send: jest.fn()};
    api.send({foo: "bar"});
    expect(api.dumpMessage.mock.calls).toEqual([[{foo: "bar"}]]);
    expect(api.socket.send.mock.calls).toEqual([["STRING"]]);
    expect(api.dispatch.mock.calls).toEqual([]);
    expect(actions.openRouteRequest.mock.calls).toEqual([]);
});


test("send route", () => {
    const app = {};
    const api = new API(app);
    api.dumpMessage = jest.fn(() => "STRING");
    api.dispatch = jest.fn(() => {});
    api.socket = {send: jest.fn()};
    api.send({route: "ROUTE"});
    expect(api.dumpMessage.mock.calls).toEqual([[{route: "ROUTE"}]]);
    expect(api.socket.send.mock.calls).toEqual([["STRING"]]);
    expect(api.dispatch.mock.calls).toEqual([["OPEN_ROUTE_REQUEST"]]);
    expect(actions.openRouteRequest.mock.calls).toEqual([["ROUTE"]]);
});


test("dumpMessage", () => {
    const mockStringify = jest.fn(() => "STRING");
    const stringify = global.JSON.stringify;
    global.JSON.stringify = mockStringify;
    const app = {};
    const api = new API(app);
    const result = api.dumpMessage({foo: "BAR"});
    expect(result).toEqual("STRING");
    expect(global.JSON.stringify.mock.calls).toEqual([[{foo: "BAR"}]]);
    global.JSON.stringify = stringify;
});


test("loadMessage", () => {
    const mockParse = jest.fn(() => "OBJECT");
    const parse = global.JSON.parse;
    global.JSON.parse = mockParse;
    const app = {};
    const api = new API(app);
    const result = api.loadMessage("STRING");
    expect(result).toEqual("OBJECT");
    expect(global.JSON.parse.mock.calls).toEqual([["STRING"]]);
    global.JSON.parse = parse;
});


test("getState", () => {
    const app = {};
    const api = new API(app);
    api.store = {getState: jest.fn(() => "ALLSTATE")};
    api.useSelector = jest.fn(() => "VALUE");
    let result = api.getState();
    expect(result).toEqual("ALLSTATE");
    expect(api.store.getState.mock.calls).toEqual([[]]);
    expect(api.useSelector.mock.calls).toEqual([]);
    result = api.getState("KEY");
    expect(result).toEqual("VALUE");
    expect(api.store.getState.mock.calls).toEqual([[]]);
    const fn = api.useSelector.mock.calls[0][0];
    expect(fn({KEY: "OTHERVALUE"})).toEqual("OTHERVALUE");
    expect(api.useSelector.mock.calls).toEqual([[fn]]);
});


test("useSelector", () => {
    const app = {};
    const api = new API(app);
    api.store = {getState: jest.fn(() => "STATE")};
    const fn = jest.fn(() => "RESULT");
    const result = api.useSelector(fn);
    expect(result).toEqual("RESULT");
    expect(fn.mock.calls).toEqual([["STATE"]]);
    expect(api.store.getState.mock.calls).toEqual([[]]);
});


test("dispatch", () => {
    const app = {};
    const api = new API(app);
    api.store = {dispatch: jest.fn(() => "DISPATCH")};
    const result = api.dispatch("ACTION");
    expect(result).toEqual("DISPATCH");
    expect(api.store.dispatch.mock.calls).toEqual([["ACTION"]]);
});


test("subscribe", () => {
    const app = {};
    const api = new API(app);
    api.store = {subscribe: jest.fn(() => "UNSUBSCRIBE")};
    const result = api.subscribe("FN");
    expect(result).toEqual("UNSUBSCRIBE");
    expect(api.store.subscribe.mock.calls).toEqual([["FN"]]);
});


test("handleRoute", () => {
    const app = {};
    const api = new API(app);

    api.getState = jest.fn(() => {});
    api.dispatch = jest.fn(() => {});
    api.history = {push: jest.fn()};

    api.handleRoute({});
    expect(api.getState.mock.calls).toEqual([["route"]]);
    expect(api.dispatch.mock.calls).toEqual([["CLOSE_ROUTE_REQUEST"]]);
    expect(api.history.push.mock.calls).toEqual([]);
    expect(actions.closeRouteRequest.mock.calls).toEqual([[]]);
    expect(actions.setData.mock.calls).toEqual([]);
    expect(actions.setRoute.mock.calls).toEqual([]);
    api.getState.mockClear();
    api.dispatch.mockClear();
    actions.closeRouteRequest.mockClear();

    api.handleRoute({route: "NEW ROUTE"});
    expect(api.getState.mock.calls).toEqual([["route"]]);
    expect(api.dispatch.mock.calls).toEqual([["CLOSE_ROUTE_REQUEST"], ["SET_ROUTE"]]);
    expect(actions.closeRouteRequest.mock.calls).toEqual([[]]);
    expect(actions.setData.mock.calls).toEqual([]);
    expect(actions.setRoute.mock.calls).toEqual([["NEW ROUTE"]]);
    expect(api.history.push.mock.calls).toEqual([["NEW ROUTE"]]);
    api.getState.mockClear();
    api.dispatch.mockClear();
    api.history.push.mockClear();
    actions.setRoute.mockClear();
    actions.closeRouteRequest.mockClear();

    api.handleRoute({data: "NEW DATA"});
    expect(api.getState.mock.calls).toEqual([["route"]]);
    expect(api.dispatch.mock.calls).toEqual([["CLOSE_ROUTE_REQUEST"], ["SET_DATA"]]);
    expect(actions.closeRouteRequest.mock.calls).toEqual([[]]);
    expect(actions.setData.mock.calls).toEqual([["NEW DATA", undefined]]);
    expect(actions.setRoute.mock.calls).toEqual([]);
    expect(api.history.push.mock.calls).toEqual([]);
    api.getState.mockClear();
    api.dispatch.mockClear();
    actions.setData.mockClear();
    actions.closeRouteRequest.mockClear();

    api.handleRoute({
        data: "NEW DATA",
        route: "NEW ROUTE"});
    expect(api.getState.mock.calls).toEqual([["route"]]);
    // order is important here
    expect(api.dispatch.mock.calls).toEqual([
        ["CLOSE_ROUTE_REQUEST"],
        ["SET_DATA"],
        ["SET_ROUTE"]]);
    expect(actions.closeRouteRequest.mock.calls).toEqual([[]]);
    expect(actions.setData.mock.calls).toEqual([["NEW DATA", "NEW ROUTE"]]);
    expect(actions.setRoute.mock.calls).toEqual([["NEW ROUTE"]]);
    expect(api.history.push.mock.calls).toEqual([["NEW ROUTE"]]);
    api.getState.mockClear();
    api.dispatch.mockClear();
    api.history.push.mockClear();
    actions.setRoute.mockClear();
    actions.setData.mockClear();
    actions.closeRouteRequest.mockClear();
});


test("onSocketMessage", () => {
    const app = {};
    const api = new API(app);

    api.loadMessage = jest.fn(() => ({}));
    api.handleCookies = jest.fn();
    api.handleRedirect = jest.fn();
    api.handleRoute = jest.fn();
    api.handleAPI = jest.fn();

    api.onSocketMessage({data: "MESSAGE"});
    expect(api.loadMessage.mock.calls).toEqual([["MESSAGE"]]);
    expect(api.handleCookies.mock.calls).toEqual([]);
    expect(api.handleRedirect.mock.calls).toEqual([]);
    expect(api.handleRoute.mock.calls).toEqual([]);
    expect(api.handleAPI.mock.calls).toEqual([]);

    api.loadMessage = jest.fn(() => ({cookies: "COOKIES"}));
    api.onSocketMessage({data: "MESSAGE"});
    expect(api.loadMessage.mock.calls).toEqual([["MESSAGE"]]);
    expect(api.handleCookies.mock.calls).toEqual([["COOKIES"]]);
    expect(api.handleRedirect.mock.calls).toEqual([]);
    expect(api.handleRoute.mock.calls).toEqual([]);
    expect(api.handleAPI.mock.calls).toEqual([]);
    api.loadMessage.mockClear();
    api.handleCookies.mockClear();

    api.loadMessage = jest.fn(() => ({redirect: "REDIRECT"}));
    api.onSocketMessage({data: "MESSAGE"});
    expect(api.loadMessage.mock.calls).toEqual([["MESSAGE"]]);
    expect(api.handleCookies.mock.calls).toEqual([]);
    expect(api.handleRedirect.mock.calls).toEqual([["REDIRECT"]]);
    expect(api.handleRoute.mock.calls).toEqual([]);
    expect(api.handleAPI.mock.calls).toEqual([]);
    api.loadMessage.mockClear();
    api.handleRedirect.mockClear();

    api.loadMessage = jest.fn(() => ({route: "ROUTE"}));
    api.onSocketMessage({data: "MESSAGE"});
    expect(api.loadMessage.mock.calls).toEqual([["MESSAGE"]]);
    expect(api.handleCookies.mock.calls).toEqual([]);
    expect(api.handleRedirect.mock.calls).toEqual([]);
    expect(api.handleRoute.mock.calls).toEqual([["ROUTE"]]);
    expect(api.handleAPI.mock.calls).toEqual([]);
    api.loadMessage.mockClear();
    api.handleRoute.mockClear();

    api.loadMessage = jest.fn(() => ({route: "ROUTE", api: "API"}));
    api.onSocketMessage({data: "MESSAGE"});
    expect(api.loadMessage.mock.calls).toEqual([["MESSAGE"]]);
    expect(api.handleCookies.mock.calls).toEqual([]);
    expect(api.handleRedirect.mock.calls).toEqual([]);
    expect(api.handleRoute.mock.calls).toEqual([["ROUTE"]]);
    expect(api.handleAPI.mock.calls).toEqual([]);
    api.loadMessage.mockClear();
    api.handleRoute.mockClear();

    api.loadMessage = jest.fn(() => ({api: "API"}));
    api.onSocketMessage({data: "MESSAGE"});
    expect(api.loadMessage.mock.calls).toEqual([["MESSAGE"]]);
    expect(api.handleCookies.mock.calls).toEqual([]);
    expect(api.handleRedirect.mock.calls).toEqual([]);
    expect(api.handleRoute.mock.calls).toEqual([]);
    expect(api.handleAPI.mock.calls).toEqual([["API"]]);
    api.loadMessage.mockClear();
    api.handleAPI.mockClear();

    api.loadMessage = jest.fn(() => ({
        api: "API",
        route: "ROUTE",
        redirect: "REDIRECT",
        cookies: "COOKIES"}));
    api.onSocketMessage({data: "MESSAGE"});
    expect(api.loadMessage.mock.calls).toEqual([["MESSAGE"]]);
    expect(api.handleCookies.mock.calls).toEqual([["COOKIES"]]);
    expect(api.handleRedirect.mock.calls).toEqual([["REDIRECT"]]);
    expect(api.handleRoute.mock.calls).toEqual([]);
    expect(api.handleAPI.mock.calls).toEqual([]);
    api.loadMessage.mockClear();
    api.handleCookies.mockClear();
    api.handleRedirect.mockClear();

    api.loadMessage = jest.fn(() => ({
        route: "ROUTE",
        cookies: "COOKIES"}));
    api.onSocketMessage({data: "MESSAGE"});
    expect(api.loadMessage.mock.calls).toEqual([["MESSAGE"]]);
    expect(api.handleCookies.mock.calls).toEqual([["COOKIES"]]);
    expect(api.handleRedirect.mock.calls).toEqual([]);
    expect(api.handleRoute.mock.calls).toEqual([["ROUTE"]]);
    expect(api.handleAPI.mock.calls).toEqual([]);
    api.loadMessage.mockClear();
    api.handleCookies.mockClear();
    api.handleRoute.mockClear();

    api.loadMessage = jest.fn(() => ({
        api: "API",
        cookies: "COOKIES"}));
    api.onSocketMessage({data: "MESSAGE"});
    expect(api.loadMessage.mock.calls).toEqual([["MESSAGE"]]);
    expect(api.handleCookies.mock.calls).toEqual([["COOKIES"]]);
    expect(api.handleRedirect.mock.calls).toEqual([]);
    expect(api.handleRoute.mock.calls).toEqual([]);
    expect(api.handleAPI.mock.calls).toEqual([["API"]]);
});


test("handleCookies", () => {
    const app = {};
    const api = new API(app);
    const set = Cookies.set;
    Cookies.set = jest.fn();
    api.handleCookies({
        cookie1: "COOKIE 1",
        cookie2: "COOKIE 2",
        cookie3: "COOKIE 3"});
    expect(Cookies.set.mock.calls).toEqual([
        ["cookie1", "COOKIE 1"],
        ["cookie2", "COOKIE 2"],
        ["cookie3", "COOKIE 3"]]);
    Cookies.set = set;
});


test("handleRedirect", () => {
    const app = {};
    const api = new API(app);
    const location = global.window.location;
    delete global.window.location;
    global.window.location = {assign: jest.fn()};
    api.handleRedirect("REDIRECT");
    expect(global.window.location.assign.mock.calls).toEqual([["REDIRECT"]]);
    global.window.location = location;
});


test("onSocketOpen", () => {
    const app = {};
    const api = new API(app);

    api.dispatch = jest.fn();
    api.getState = jest.fn();
    api.onSocketOpen();
    expect(api.dispatch.mock.calls).toEqual([["CONNECTED"]]);
    expect(api.getState.mock.calls).toEqual([["reconnect"]]);
    expect(actions.socketConnected.mock.calls).toEqual([[]]);
    expect(actions.socketReconnect.mock.calls).toEqual([]);
    actions.socketConnected.mockClear();

    api.dispatch = jest.fn();
    api.getState = jest.fn(() => "RECONNECTING");
    api.onSocketOpen();
    expect(api.dispatch.mock.calls).toEqual([["CONNECTED"], ["RECONNECT"]]);
    expect(api.getState.mock.calls).toEqual([["reconnect"]]);
    expect(actions.socketConnected.mock.calls).toEqual([[]]);
    expect(actions.socketReconnect.mock.calls).toEqual([[false]]);
});


test("onSocketClose", () => {
    const app = {};
    const api = new API(app);

    api.dispatch = jest.fn();
    api.getState = jest.fn(() => true);
    api.reconnect = jest.fn();

    api.onSocketClose({wasClean: true});
    expect(api.dispatch.mock.calls).toEqual([]);
    expect(api.getState.mock.calls).toEqual([]);
    expect(actions.socketDisconnected.mock.calls).toEqual([]);
    expect(api.reconnect.mock.calls).toEqual([]);

    api.onSocketClose({wasClean: false});
    expect(api.dispatch.mock.calls).toEqual([["DISCONNECTED"]]);
    expect(api.getState.mock.calls).toEqual([["connected"], ["reconnect"]]);
    expect(actions.socketDisconnected.mock.calls).toEqual([[]]);
    expect(api.reconnect.mock.calls).toEqual([]);
    api.dispatch.mockClear();
    actions.socketDisconnected.mockClear();

    api.getState = jest.fn(() => false);
    api.onSocketClose({wasClean: false});
    expect(api.dispatch.mock.calls).toEqual([]);
    expect(actions.socketDisconnected.mock.calls).toEqual([]);
    expect(api.getState.mock.calls).toEqual([["connected"], ["reconnect"], ["connectionFailed"]]);
    expect(api.reconnect.mock.calls).toEqual([[]]);
    api.reconnect.mockClear();

    api.getState = jest.fn((k) => {
        if (k === "connectionFailed") {
            return true;
        }
        return false;
    });
    api.onSocketClose({wasClean: false});
    expect(api.dispatch.mock.calls).toEqual([]);
    expect(actions.socketDisconnected.mock.calls).toEqual([]);
    expect(api.getState.mock.calls).toEqual([["connected"], ["reconnect"], ["connectionFailed"]]);
    expect(api.reconnect.mock.calls).toEqual([]);
});


test("socketAddress", () => {
    const app = {};
    const api = new API(app);

    api.getState = jest.fn(() => ({}));
    expect(api.socketAddress).toEqual(api.defaultSocketAddress);
    expect(api.getState.mock.calls).toEqual([["settings"]]);

    const socketAddress = {};
    socketAddress[api.settingSocketAddress] = "SOCKET ADDRESS";
    api.getState = jest.fn(() => (socketAddress));
    expect(api.socketAddress).toEqual("SOCKET ADDRESS");
    expect(api.getState.mock.calls).toEqual([["settings"]]);
});


test("reconnectionPolicy", () => {
    const app = {};
    const api = new API(app);

    api.getState = jest.fn(() => ({}));
    expect(api.reconnectionPolicy).toEqual(api.defaultReconnectionPolicy);
    expect(api.getState.mock.calls).toEqual([["settings"]]);

    const reconnectionPolicy = {};
    reconnectionPolicy[api.settingReconnectionPolicy] = "SERVER RECONNECTION POLICY";

    api.getState = jest.fn(() => reconnectionPolicy);
    expect(api.reconnectionPolicy).toEqual("SERVER RECONNECTION POLICY");
    expect(api.getState.mock.calls).toEqual([["settings"]]);

    api.getState = jest.fn(() => reconnectionPolicy);
    api.props = {reconnectionPolicy: "APP RECONNECTION POLCIY"};
    expect(api.reconnectionPolicy).toEqual("SERVER RECONNECTION POLICY");
    expect(api.getState.mock.calls).toEqual([["settings"]]);

    api.getState = jest.fn(() => ({}));
    api.props = {reconnectionPolicy: "APP RECONNECTION POLICY"};
    expect(api.reconnectionPolicy).toEqual("APP RECONNECTION POLICY");
    expect(api.getState.mock.calls).toEqual([["settings"]]);

});


test("reconnect", () => {

    class DummyAPI extends API {
        policy = jest.fn(() => ([[], ["", 1000]]));

        get reconnectionPolicy () {
            return this.policy();
        }
    }

    const app = {};
    const api = new DummyAPI(app);

    global.setTimeout = jest.fn();
    api.getState = jest.fn((k) => {
        if (k  === "connected") {
            return true;
        }
    });
    api.dispatch = jest.fn();
    api.openSocket = jest.fn(() => "SOCKET");

    api.reconnect();
    expect(api.getState.mock.calls).toEqual([["connected"]]);
    expect(api.policy.mock.calls).toEqual([]);
    expect(api.dispatch.mock.calls).toEqual([]);
    expect(api.openSocket.mock.calls).toEqual([]);
    expect(global.setTimeout.mock.calls).toEqual([]);
    expect(actions.socketReconnect.mock.calls).toEqual([]);
    expect(actions.socketReconnectionFailed.mock.calls).toEqual([]);

    api.getState = jest.fn((k) => {
        if (k  === "reconnect") {
            return [1];
        }
    });
    api.reconnect();
    expect(api.getState.mock.calls).toEqual([["connected"], ["reconnect"]]);
    expect(api.policy.mock.calls).toEqual([[]]);
    expect(api.dispatch.mock.calls).toEqual([["RECONNECT"]]);
    expect(api.openSocket.mock.calls).toEqual([[]]);
    expect(global.setTimeout.mock.calls).toEqual([[api.reconnect, 1000000]]);
    expect(actions.socketReconnect.mock.calls).toEqual([[api.reconnectionPolicy]]);
    expect(actions.socketReconnectionFailed.mock.calls).toEqual([]);
    api.policy.mockClear();
    api.dispatch.mockClear();
    api.openSocket.mockClear();
    global.setTimeout.mockClear();
    actions.socketReconnect.mockClear();

    api.getState = jest.fn(() => false);
    api.reconnect();
    expect(api.getState.mock.calls).toEqual([["connected"], ["reconnect"]]);
    expect(api.policy.mock.calls).toEqual([[]]);
    expect(api.dispatch.mock.calls).toEqual([["RECONNECT"], ["RECONNECT FAILED"]]);
    expect(api.openSocket.mock.calls).toEqual([]);
    expect(global.setTimeout.mock.calls).toEqual([]);
    expect(actions.socketReconnect.mock.calls).toEqual([[api.reconnectionPolicy]]);
    expect(actions.socketReconnectionFailed.mock.calls).toEqual([[]]);

});


test("handleAPI", () => {
    const app = {};
    const api = new API(app);

    api.dispatch = jest.fn();
    api.handleAPI({});
    expect(api.dispatch.mock.calls).toEqual([]);
    expect(actions.setAPI.mock.calls).toEqual([]);

    api.handleAPI({api1: "API 1", api2: "API 2"});
    expect(api.dispatch.mock.calls).toEqual([["SET_API"], ["SET_API"]]);
    expect(actions.setAPI.mock.calls).toEqual([
        ["api1", "API 1"],
        ["api2", "API 2"]]);
});


test("consume", () => {
    const app = {};
    const api = new API(app);

    api.getState = jest.fn();
    api.dispatch = jest.fn();
    let result = api.consume("API");
    expect(api.dispatch.mock.calls).toEqual([]);
    expect(api.getState.mock.calls).toEqual([["api"]]);
    expect(actions.consumeAPI.mock.calls).toEqual([]);
    expect(result).toBe(undefined);
    api.getState.mockClear();

    api.getState = jest.fn(() => (
        {API: "DATA", OTHERAPI: "OTHERDATA"}));
    api.dispatch = jest.fn();
    result = api.consume("API");
    expect(api.dispatch.mock.calls).toEqual([["CONSUME_API"]]);
    expect(api.getState.mock.calls).toEqual([["api"]]);
    expect(actions.consumeAPI.mock.calls).toEqual([["API"]]);
    expect(result).toEqual("DATA");
});



test("setting", () => {
    const app = {};
    const api = new API(app);

    api.getState = jest.fn();
    expect(api.setting("SETTING")).toBe(undefined);
    expect(api.getState.mock.calls).toEqual([["settings"]]);

    api.getState = jest.fn(() => ({}));
    expect(api.setting("SETTING")).toBe(undefined);
    expect(api.getState.mock.calls).toEqual([["settings"]]);

    api.getState = jest.fn(() => ({SETTING: "VALUE"}));
    expect(api.setting("SETTING")).toEqual("VALUE");
    expect(api.getState.mock.calls).toEqual([["settings"]]);
});


test("getData", () => {
    const app = {};
    const api = new API(app);

    api.getState = jest.fn();
    expect(api.getData("KEY")).toBe(undefined);
    expect(api.getState.mock.calls).toEqual([["data"]]);

    api.getState = jest.fn(() => ({}));
    expect(api.getData("KEY")).toBe(undefined);
    expect(api.getState.mock.calls).toEqual([["data"]]);

    api.getState = jest.fn(() => ({KEY: "VALUE"}));
    expect(api.getData("KEY")).toEqual("VALUE");
    expect(api.getState.mock.calls).toEqual([["data"]]);
});


test("call", async () => {
    const app = {};
    const api = new API(app);
    api.callAPI.bind = jest.fn(() => ((resolve) => resolve("DONE")));
    const result = await api.call("API", {params: "PARAMS"}, true);
    expect(result).toBe("DONE");
    expect(api.callAPI.bind.mock.calls).toEqual(
        [[api,
          {api: "API",
           msg: {params: "PARAMS"},
           nostate: true}]]);
});


test("callAPI", () => {
    const app = {};
    const api = new API(app);
    api.send = jest.fn();
    api.subscribe = jest.fn(() => "UNSUBSCRIBE");
    api.subscribeAPI.bind = jest.fn(() => "UNSUBSCRIBE");
    const args = {api: "API", msg: {params: "PARAMS"}, nostate: true};
    api.callAPI(args, "RESOLVE");
    expect(api.send.mock.calls).toEqual([[args.msg]]);
    delete args.msg;
    const expected = {
        ...args,
        ...{api: "API", resolve: "RESOLVE", unsubscribe: "UNSUBSCRIBE"}};
    expect(api.subscribeAPI.bind.mock.calls).toEqual(
        [[api, expected]]);
});


const subscribeTests = [
    ["defaults", {}, {}],
    ["no response", {nostate: true}, {}],
    ["response",
     {response: "RESPONSE"},
     {dispatch: [["UPDATE_DATA"]],
      resolve: [["RESPONSE"]],
      unsubscribe: [[]],
      update: [["RESPONSE"]]}],
    ["response, nostate",
     {response: "RESPONSE", nostate: true},
     {resolve: [["RESPONSE"]],
      unsubscribe: [[]]}],
];


test.each(subscribeTests)(
    "API.subscribeAPI %s",
    (name, props, expected) => {
        const {response, nostate} = props;
        const {
            update=[],
            dispatch=[],
            resolve=[],
            unsubscribe=[]} = expected;

        const app = {};
        const api = new API(app);
        api.consume = jest.fn(() => response);
        api.dispatch = jest.fn();
        const resolveFun = jest.fn();
        const unsubscribeFun = jest.fn();
        const args = {
            api: "API",
            nostate,
            resolve: resolveFun,
            unsubscribe: unsubscribeFun};
        api.subscribeAPI(args);
        expect(api.consume.mock.calls).toEqual([["API"]]);
        expect(api.dispatch.mock.calls).toEqual(dispatch);
        expect(resolveFun.mock.calls).toEqual(resolve);
        expect(unsubscribeFun.mock.calls).toEqual(unsubscribe);
        expect(actions.updateData.mock.calls).toEqual(update);
    });
