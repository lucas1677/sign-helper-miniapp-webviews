import {RouterState} from 'connected-react-router';

export type AppState = {
    router: RouterState;
    message: Message;
};

export type Message = {
    type: number;
    content: string;
};
