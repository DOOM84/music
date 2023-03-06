export interface IError extends Error {
    response?: {
        status: number;
        _data?: {
            msg: string
        }
    }
    statusCode?: number;

    status?: number;

    message: string;

    statusMessage: string;
    code?: number | string;

    path?: string;

    errors?: string[];
}

export interface IPost {
    id?: number
    text: string;
    added: string;
    status?: boolean
}

export interface IAbout {
    text: string;
}

export interface ITrack {
    id?: number;
    title: string;
    path: string;
    status?: boolean
}

export interface IRelease {
    id?: number;
    title: string;
    image: string;
    published: string;
    recordLabel: string;
    format: string;
    length: string;
    link: string;
    status?: boolean;
    tracks: ITDetail[];
}

export interface ITDetail{
  title: string;
  time: string
}

export interface IHero {
    id?: number;
    name: string;
    duties: string;
    img: string;
    status?: boolean;
}

export interface IUser {
    id?: string;
    admin?: boolean;
    email: string;
    login?: string;
    password?: string | undefined;
    passwordConfirmation?: string;
}