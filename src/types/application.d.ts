import {RouterState} from 'connected-react-router';

export type AppState = {
  router: RouterState;
  message: Message;
  appData: AppData;
};

export type Message = {
  type: number;
  content: string;
};

export type RankItem = {
  fullName: string;
  companyName: string;
};

export type AppData = {
  rankItems: RankItem[];
};
