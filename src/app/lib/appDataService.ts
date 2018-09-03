import axios from 'axios';

import {API_PATH} from '@src/commons/config';

export const getParticipateAwardDetail = () => {
  return axios.get(`${API_PATH}/activity/participate-award`);
};
