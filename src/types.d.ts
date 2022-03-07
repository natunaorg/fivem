// eslint-disable-next-line no-var
declare var __natunaDirname: string;

declare namespace NodeJS {
    export interface ProcessEnv {
        DATABASE_HOST: string | undefined;
        DATABASE_PORT: string | undefined;
        DATABASE_NAME: string | undefined;
        DATABASE_USER: string | undefined;
        DATABASE_PASSWORD: string | undefined;
        CRYPTER_SECRET_KEY: string | undefined;
        CRYPTER_ALGORITHM: string | undefined;
    }
}
