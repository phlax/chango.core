
import * as actions from "./actions";
import * as reducers from "./reducers";
import {API} from "./api";


const Channels = {
    withReducers: reducers.withReducers,
    actions, reducers,
    API,
};

export {API, Channels};
export default Channels;
