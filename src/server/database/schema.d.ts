// This file is autogenerated, you should not edit it.
// Run `yarn db:schema:generate` in the project root to regenerate this file.

declare type DatabaseDriver = "mysql";
declare type DatabaseSchema = {
    ban_lists: {
        license: string;
        reason: string;
    };
    characters: {
        id: number;
        user_id: number;
        first_name: string;
        last_name: string;
        last_position: string;
        skin: string;
        health: number;
        armour: number;
    };
    users: {
        id: number;
        license: string;
        active_character_id: number;
        last_ip: string;
        last_login: string;
    };
    whitelist_lists: {
        license: string;
    };
};