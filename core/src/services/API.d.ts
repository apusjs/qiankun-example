declare namespace API {
  export type CurrentUser = {
    avatar?: string;
    nick?: string;
    userId?: string;
  };

  export type CurrentMenus = {
    path: string,
    name: string,
    locale: string,
    children: [CurrentMenus]
  };

  export type LoginStateType = {
    accessToken?: string;
    expiresIn?: number;
  };

  export type NoticeIconData = {
    id: string;
    key: string;
    avatar: string;
    title: string;
    datetime: string;
    type: string;
    read?: boolean;
    description: string;
    clickClose?: boolean;
    extra: any;
    status: string;
  };
}
