
import Channels from "@chango/core";

import Reducers from "@chango/core/reducers";


test("socketReconnectionReducer", () => {
    const reconnectionHandler = jest.fn(() => "RECONNECTION STATE");
    Reducers.__Rewire__("reconnectionHandler", reconnectionHandler);
    let result = Channels.reducers.socketReconnectionReducer(undefined, {});
    expect(result).toEqual(null);
    expect(reconnectionHandler.mock.calls).toEqual([]);

    result = Channels.reducers.socketReconnectionReducer(
        "OLD STATE", {type: "SOCKET_RECONNECT", policy: "POLICY"});
    expect(result).toEqual("RECONNECTION STATE");
    expect(reconnectionHandler.mock.calls).toEqual([["OLD STATE", "POLICY"]]);
});


test("reconnectionHandler", () => {
    let policy = [
        [12, 10],
        [10, 60],
        ["*", 300]];
    expect(Channels.reducers.reconnectionHandler()).toBe(null);
    expect(Channels.reducers.reconnectionHandler([0, 0])).toBe(null);
    expect(Channels.reducers.reconnectionHandler(null, policy)).toEqual([0, 0]);
    expect(Channels.reducers.reconnectionHandler([0, 0], policy)).toEqual([0, 1]);
    expect(Channels.reducers.reconnectionHandler([0, 7], policy)).toEqual([0, 8]);
    expect(Channels.reducers.reconnectionHandler([0, 12], policy)).toEqual([1, 0]);
    expect(Channels.reducers.reconnectionHandler([1, 10], policy)).toEqual([2, 0]);
    expect(Channels.reducers.reconnectionHandler([2, 5000], policy)).toEqual([2, 5001]);
    policy = [
        [12, 10],
        [10, 60],
        [5000, 300]];
    expect(Channels.reducers.reconnectionHandler([2, 5000], policy)).toBe(null);
});


test("routeReducer", () => {
    let result = Channels.reducers.routeReducer(undefined, {});
    expect(result).toBe(null);
    result = Channels.reducers.routeReducer(
        {}, {type: "SET_ROUTE", route: "ROUTE"});
    expect(result).toBe("ROUTE");
});


test("titleReducer", () => {
    let result = Channels.reducers.titleReducer(undefined, {});
    expect(result).toBe(null);
    result = Channels.reducers.titleReducer(
        {}, {type: "SET_TITLE", title: "TITLE"});
    expect(result).toEqual("TITLE");
});


test("apiReducer SET_API", () => {
    let result = Channels.reducers.apiReducer(undefined, {});
    expect(result).toEqual({});
    result = Channels.reducers.apiReducer(
        {}, {type: "SET_API", api: "API", data: "APIDATA"});
    expect(result).toEqual({"API": "APIDATA"});
    result = Channels.reducers.apiReducer(
        {OTHER_API: "OTHERDATA"},
        {type: "SET_API", api: "API", data: "APIDATA"});
    expect(result).toEqual(
        {"API": "APIDATA",
         "OTHER_API": "OTHERDATA"});
});


test("apiReducer CONSUME_API", () => {
    let result = Channels.reducers.apiReducer(undefined, {});
    expect(result).toEqual({});
    result = Channels.reducers.apiReducer(
        {}, {type: "CONSUME_API", api: "API"});
    expect(result).toEqual({});
    result = Channels.reducers.apiReducer(
        {OTHER_API: "OTHERDATA"}, {type: "CONSUME_API", api: "API"});
    expect(result).toEqual({"OTHER_API": "OTHERDATA"});
    result = Channels.reducers.apiReducer(
        {OTHER_API: "OTHERDATA", API: "DATA"},
        {type: "CONSUME_API", api: "API"});
    expect(result).toEqual(
        {"OTHER_API": "OTHERDATA"});
});


test("dataReducer", () => {
    let result = Channels.reducers.dataReducer(undefined, {});
    expect(result).toBe(null);
    result = Channels.reducers.dataReducer(
        {}, {type: "SET_DATA", data: "DATA"});
    expect(result).toEqual("DATA");
    result = Channels.reducers.dataReducer(
        null,
        {type: "UPDATE_DATA",
         data: {
             data1: "DATA 1",
             data2: "DATA 2"}});
    expect(result).toEqual(
        {"data1": "DATA 1",
         "data2": "DATA 2"});
    result = Channels.reducers.dataReducer(
        {"data1": "DATA 1", "data2": "DATA 2"},
        {type: "UPDATE_DATA",
         data: {
             data2: "NEW DATA 2"}});
    expect(result).toEqual(
        {"data1": "DATA 1",
         "data2": "NEW DATA 2"});

});


test("settingsReducer", () => {
    let result = Channels.reducers.settingsReducer(undefined, {});
    expect(result).toEqual({});
    result = Channels.reducers.settingsReducer(
        {}, {type: "SET_SETTINGS", settings: "SETTINGS"});
    expect(result).toBe("SETTINGS");
});


test("userReducer", () => {
    let result = Channels.reducers.userReducer(undefined, {});
    expect(result).toBe(null);
    result = Channels.reducers.userReducer(
        null, {type: "LOGIN", user: "USER"});
    expect(result).toEqual("USER");
    result = Channels.reducers.userReducer(
        "USER", {type: "LOGOUT", user: "USER"});
    expect(result).toBe(null);
    result = Channels.reducers.userReducer(
        "USER", {type: "LOGOUT"});
    expect(result).toBe(null);
});


test("socketConnectionReducer", () => {
    let result = Channels.reducers.socketConnectionReducer(undefined, {});
    expect(result).toBe(false);
    result = Channels.reducers.socketConnectionReducer(
        null, {type: "SOCKET_CONNECTED"});
    expect(result).toEqual(true);
    result = Channels.reducers.socketConnectionReducer(
        "SOCKETCONNECTION", {type: "SOCKET_DISCONNECTED"});
    expect(result).toBe(false);
});


test("socketConnectionFailureReducer", () => {
    let result = Channels.reducers.socketConnectionFailureReducer(undefined, {});
    expect(result).toBe(false);
    result = Channels.reducers.socketConnectionFailureReducer(
        null, {type: "SOCKET_RECONNECT_FAILED"});
    expect(result).toEqual(true);
});


test("routeRequestReducer", () => {
    let result = Channels.reducers.routeRequestReducer(undefined, {});
    expect(result).toBe(null);
    result = Channels.reducers.routeRequestReducer(
        null, {type: "OPEN_ROUTE_REQUEST", route: "ROUTE"});
    expect(result).toEqual("ROUTE");
    result = Channels.reducers.routeRequestReducer(
        "ROUTE", {type: "CLOSE_ROUTE_REQUEST"});
    expect(result).toEqual(null);
});


test("modalReducer", () => {
    let result = Channels.reducers.modalReducer(undefined, {});
    expect(result).toBe(false);
    result = Channels.reducers.modalReducer(
        null, {type: "OPEN_MODAL", modal: "MODAL"});
    expect(result).toEqual("MODAL");
    result = Channels.reducers.modalReducer(
        "MODAL", {type: "CLOSE_MODAL", modal: "MODAL"});
    expect(result).toBe(false);
    result = Channels.reducers.modalReducer(
        "MODAL", {type: "CLOSE_MODAL"});
    expect(result).toBe(false);
});


test("modalDataReducer", () => {
    let result = Channels.reducers.modalDataReducer(undefined, {});
    expect(result).toBe(null);
    result = Channels.reducers.modalDataReducer(
        {}, {type: "SET_MODAL_DATA", data: "DATA"});
    expect(result).toEqual("DATA");
    result = Channels.reducers.modalDataReducer(
        null,
        {type: "UPDATE_MODAL_DATA",
         data: {
             data1: "DATA 1",
             data2: "DATA 2"}});
    expect(result).toEqual(
        {"data1": "DATA 1",
         "data2": "DATA 2"});
    result = Channels.reducers.modalDataReducer(
        {"data1": "DATA 1", "data2": "DATA 2"},
        {type: "UPDATE_MODAL_DATA",
         data: {
             data2: "NEW DATA 2"}});
    expect(result).toEqual(
        {"data1": "DATA 1",
         "data2": "NEW DATA 2"});
    result = Channels.reducers.modalDataReducer(
        null,
        {type: "CLEAR_MODAL_DATA",
         data: {
             data1: "DATA 1",
             data2: "DATA 2"}});
    expect(result).toEqual(null);
    result = Channels.reducers.modalDataReducer(
        {"data1": "DATA 1", "data2": "DATA 2"},
        {type: "CLEAR_MODAL_DATA",
         data: {
             data2: "NEW DATA 2"}});
    expect(result).toEqual(null);
});


test("modalResponseReducer", () => {
    let result = Channels.reducers.modalResponseReducer(undefined, {});
    expect(result).toBe(null);
    result = Channels.reducers.modalResponseReducer(
        null, {type: "SET_MODAL_RESPONSE", response: "RESPONSE"});
    expect(result).toEqual("RESPONSE");
    result = Channels.reducers.modalResponseReducer(
        "RESPONSE", {type: "CLEAR_MODAL_RESPONSE", response: "RESPONSE"});
    expect(result).toBe(null);
    result = Channels.reducers.modalResponseReducer(
        "RESPONSE", {type: "CLEAR_MODAL_RESPONSE"});
    expect(result).toBe(null);
});


test("withReducers", () => {
    let result = Channels.reducers.withReducers();
    expect(result).toEqual(
        {route: Channels.reducers.routeReducer,
         user: Channels.reducers.userReducer,
         settings: Channels.reducers.settingsReducer,
         routeRequest: Channels.reducers.routeRequestReducer,
         connected: Channels.reducers.socketConnectionReducer,
         connectionFailed: Channels.reducers.socketConnectionFailureReducer,
         reconnect: Channels.reducers.socketReconnectionReducer,
         data: Channels.reducers.dataReducer,
         modal: Channels.reducers.modalReducer,
         modalData: Channels.reducers.modalDataReducer,
         modalResponse: Channels.reducers.modalResponseReducer,
         title: Channels.reducers.titleReducer,
         api: Channels.reducers.apiReducer});
    result = Channels.reducers.withReducers({settings: "SETTINGS"});
    expect(result).toEqual(
        {route: Channels.reducers.routeReducer,
         user: Channels.reducers.userReducer,
         settings: "SETTINGS",
         routeRequest: Channels.reducers.routeRequestReducer,
         connected: Channels.reducers.socketConnectionReducer,
         connectionFailed: Channels.reducers.socketConnectionFailureReducer,
         reconnect: Channels.reducers.socketReconnectionReducer,
         data: Channels.reducers.dataReducer,
         modal: Channels.reducers.modalReducer,
         modalData: Channels.reducers.modalDataReducer,
         modalResponse: Channels.reducers.modalResponseReducer,
         title: Channels.reducers.titleReducer,
         api: Channels.reducers.apiReducer});
});
