import {getParticipateAwardDetail} from '@src/app/lib/appDataService';
import {handleErrors} from '@src/app/util/fetchUtil';
import {AppData} from '@src/types/application';

export const LOAD_PARTICIPATION_AWARD_DATA = 'LOAD_PARTICIPATION_AWARD_DATA';

export const loadParticipateAwardDetail = () => {
  return (dispatch) => {
    getParticipateAwardDetail().then(res => handleErrors(res, dispatch, (filterRes) => {
      dispatch({
        type: LOAD_PARTICIPATION_AWARD_DATA,
        payload: filterRes.data.data,
      });
    }));
  };
};

export default (
  state: AppData = {
    rankItems: [],
  },
  action
) => {
  switch (action.type) {
    case LOAD_PARTICIPATION_AWARD_DATA:
      return {
        ...state,
        rankItems: action.payload,
      };
    default:
      return state;
  }
};
