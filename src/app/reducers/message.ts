const SHOW_MESSAGE = 'SHOW_MESSAGE';
export const showMessage = (message) => ({type: SHOW_MESSAGE, payload: message});

export default (state: string = '', action) => {
  switch (action.type) {
    case SHOW_MESSAGE:
      return action.payload;
    default:
      return state;
  }
};
