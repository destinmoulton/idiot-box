import {
    ERROR_RECEIVED
} from '../actions/actionTypes';

const INITIAL_STATE = {
    errors: []
}

export default function errorReducer(state = INITIAL_STATE, action){
    switch(action.type){
        case ERROR_RECEIVED:
            let errors = [...state.errors];
            errors.push(action.message);
            return {
                ...state,
                errors
            }

        default:
            return state;
    }
}