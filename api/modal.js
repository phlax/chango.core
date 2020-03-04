
import {
    clearModalData, clearModalResponse,
    updateModalData, closeModal} from "../actions";


export class Modal {

    constructor (modal, api) {
        this.modal = modal;
        this.api = api;
        this.unsubscribe = api.subscribe(this.subscribe);
    }

    listen = (fun) => {
        this.fun = fun;
        return this.close;
    };

    close = () => {
        this.api.dispatch(closeModal());
    };

    update = (data) => {
        this.api.dispatch(updateModalData(data));
    };

    _clearing = false;
    subscribe = () => {
        const response = this.api.getState("modalResponse") || {};
        const modal = this.api.getState("modal");
        if (response && response !== {} && response !== this.response && !this._clearing) {
            this._clearing = true;
            this.api.dispatch(clearModalResponse());
            this.fun(response, this);
            this._clearing = false;
        }
        if (modal !== this.modal) {
            this.unsubscribe();
            this.api.dispatch(clearModalData());
        }
    };
}
