import * as ActionTypes from '../../actions/types';
import { StateEnum } from '../../constants/enums';
import createReducer from '../../utils/createReducer';

// Initial state
const initialState = {
  phone: '',
  isVerified: false,
  status: StateEnum.NO_CONTACT,
};

export const application = createReducer(initialState, {
  [ActionTypes.SET_VERIFICATION](state, action) {
    return Object.assign({}, state, {
      isVerified: action.payload,
    });
  },

  [ActionTypes.SET_PHONE](state, action) {
    return Object.assign({}, state, {
      phone: action.payload,
    });
  },
  [ActionTypes.SET_STATUS](state, action) {
    return Object.assign({}, state, {
      status: action.payload,
    });
  },
});
