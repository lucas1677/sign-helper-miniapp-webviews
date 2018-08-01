import {RouterState} from 'connected-react-router';

export type AppState = {
  message: string;
  tabLogic: TabLogicState;
  userLogic: UserLogicState;
  activityLogic: ActivityLogicState;
  appLogic: AppLogicState;
  securityLogic: SecurityLogicState;
  router: RouterState;
};

export type AppLogicState = {
  superModeContent: string;
  isSuperModeActive: boolean;
  superModeData: {
    userList: User[];
    activityList: Activity[];
  };
};

export type TabLogicState = {
  currentRelContent: string;
  lastRelContent: string;
  tabs: TabItem[];
};

export type TabItem = {
  id: number;
  title: string;
  isActive: boolean;
  parentId: number;
  navPath: string;
};

export type UserLogicState = {
  page: Page;
  users: User[];
  authUnpassInfo: AuthUnpassInfo;
};

export type SecurityLogicState = {
  loginPhoneNumber: string;
  loginCaptcha: string;
  getCaptchaAvailable: boolean;
  smsSendCountDownNumber: number;
};

export type User = {
  id: number;
  fullName: string;
  mobile: number;
  businessCard: null;
  companyType: number;
  authenticateState: number;
  companyTypeName: string;
  companySubTypeName: string;
  companyName: string;
  signinCount: number;
  userCategory: number;
  authenticateDenyReason: string;
  position: string;
};

export type ActivityLogicState = {
  page: Page;
  focusUserId: number;
  focusUser: User;
  focusActivity: Activity;
  activities: Activity[];
};

export type Activity = {
  id: number;
  title: string;
  fullName: string;
  position: string;
  showTime: string;
  signinNumber: number;
  company: string;
  createUser: User;
};

export type AuthUnpassInfo = {
  userId: string;
  authUnPassReason: string;
  unpassDialogShow: false;
};

export type Page = {
  pages: number[];
  pageSize: number;
  currentPageIndex: number;
  prevPageAvailable: boolean;
  nextPageAvailable: boolean;
};
