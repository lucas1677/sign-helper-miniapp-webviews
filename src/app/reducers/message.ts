import {MESSAGE_TYPE} from '@src/commons/const';
import {Message} from '@src/types/application';

const SHOW_MESSAGE = 'SHOW_MESSAGE';
export const showMessage = (message) => ({type: SHOW_MESSAGE, payload: message});

export default (state: Message = null, action) => {
  switch (action.type) {
    case SHOW_MESSAGE:
      return {
        type: MESSAGE_TYPE.INFO,
        content: action.payload,
      };
    default:
      return state;
  }
};
