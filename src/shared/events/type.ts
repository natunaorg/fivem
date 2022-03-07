export enum SharedEventType {
    // Config
    GET_CLIENT_CONFIG = "natuna:client:config",

    // Players
    CURRENT_PLAYER_UPDATE = "natuna:server:players:currentPlayerUpdate",
    UPDATED_DATA_BROADCAST = "natuna:client:players:updatedDataBroadcast",

    // Commands
    CLIENT_EXECUTE_COMMAND = "natuna:client:command:execute",
    SET_COMMAND_DESCRIPTION = "natuna:client:command:setDescription",
    REGISTER_COMMAND = "natuna:server:command:register",

    // Shared Event (on server)
    SERVER_EVENT_HANDLER = "natuna:shared:server:eventHandler",
    SERVER_CALLBACK_RECEIVER = "natuna:shared:server:sendCallbackValues",

    // Shared Event (on client)
    CLIENT_EVENT_HANDLER = "natuna:shared:client:eventHandler",
    CLIENT_CALLBACK_RECEIVER = "natuna:shared:client:sendCallbackValues",
}
