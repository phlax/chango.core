
import Channels from "@chango/core";


test("login", () => {
    const action = Channels.actions.login("USER");
    expect(action.user).toEqual("USER");
    expect(action.type).toEqual("LOGIN");
});


test("logout", () => {
    const action = Channels.actions.logout("USER");
    expect(action.user).toEqual("USER");
    expect(action.type).toEqual("LOGOUT");
});


test("setRoute", () => {
    const action = Channels.actions.setRoute("ROUTE");
    expect(action.route).toEqual("ROUTE");
    expect(action.type).toEqual("SET_ROUTE");
});


test("setData", () => {
    const action = Channels.actions.setData("DATA", "ROUTE");
    expect(action.data).toEqual("DATA");
    expect(action.route).toEqual("ROUTE");
    expect(action.type).toEqual("SET_DATA");
});


test("updateData", () => {
    const action = Channels.actions.updateData("DATA", "ROUTE");
    expect(action.data).toEqual("DATA");
    expect(action.route).toEqual("ROUTE");
    expect(action.type).toEqual("UPDATE_DATA");
});


test("setAPI", () => {
    const action = Channels.actions.setAPI("API", "DATA");
    expect(action.data).toEqual("DATA");
    expect(action.api).toEqual("API");
    expect(action.type).toEqual("SET_API");
});


test("setSettings", () => {
    const action = Channels.actions.setSettings("SETTINGS");
    expect(action.settings).toEqual("SETTINGS");
    expect(action.type).toEqual("SET_SETTINGS");
});


test("setTitle", () => {
    const action = Channels.actions.setTitle("TITLE");
    expect(action.title).toEqual("TITLE");
    expect(action.type).toEqual("SET_TITLE");
});


test("socketReconnectionFailed", () => {
    const action = Channels.actions.socketReconnectionFailed();
    expect(action.type).toEqual("SOCKET_RECONNECT_FAILED");
});


test("socketConnected", () => {
    const action = Channels.actions.socketConnected();
    expect(action.type).toEqual("SOCKET_CONNECTED");
});


test("socketDisconnected", () => {
    const action = Channels.actions.socketDisconnected();
    expect(action.type).toEqual("SOCKET_DISCONNECTED");
});


test("socketReconnect", () => {
    const action = Channels.actions.socketReconnect("POLICY");
    expect(action.type).toEqual("SOCKET_RECONNECT");
    expect(action.policy).toEqual("POLICY");
});


test("openRouteRequest", () => {
    const action = Channels.actions.openRouteRequest("ROUTE");
    expect(action.type).toEqual("OPEN_ROUTE_REQUEST");
    expect(action.route).toEqual("ROUTE");
});


test("closeRouteRequest", () => {
    const action = Channels.actions.closeRouteRequest();
    expect(action.type).toEqual("CLOSE_ROUTE_REQUEST");
});


test("consumeAPI", () => {
    const action = Channels.actions.consumeAPI();
    expect(action.type).toEqual("CONSUME_API");
});


test("openModal", () => {
    const action = Channels.actions.openModal("MODAL");
    expect(action.type).toEqual("OPEN_MODAL");
    expect(action.modal).toEqual("MODAL");
});


test("closeModal", () => {
    const action = Channels.actions.closeModal();
    expect(action.type).toEqual("CLOSE_MODAL");
});


test("setModalData", () => {
    const action = Channels.actions.setModalData("DATA");
    expect(action.type).toEqual("SET_MODAL_DATA");
    expect(action.data).toEqual("DATA");
});


test("updateModalData", () => {
    const action = Channels.actions.updateModalData("DATA");
    expect(action.type).toEqual("UPDATE_MODAL_DATA");
    expect(action.data).toEqual("DATA");
});


test("clearModalData", () => {
    const action = Channels.actions.clearModalData("DATA");
    expect(action.type).toEqual("CLEAR_MODAL_DATA");
});


test("setModalResponse", () => {
    const action = Channels.actions.setModalResponse("RESPONSE");
    expect(action.type).toEqual("SET_MODAL_RESPONSE");
    expect(action.response).toEqual("RESPONSE");
});


test("clearModalResponse", () => {
    const action = Channels.actions.clearModalResponse("RESPONSE");
    expect(action.type).toEqual("CLEAR_MODAL_RESPONSE");
});
