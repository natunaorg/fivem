export enum SharedEventType {
    GET_CLIENT_CONFIG = "natuna:client:config",
    CURRENT_PLAYER_UPDATE = "natuna:server:players:currentPlayerUpdate",
    UPDATED_DATA_BROADCAST = "natuna:client:players:updatedDataBroadcast",
    CLIENT_EXECUTE_COMMAND = "natuna:client:command:execute",
    SET_COMMAND_DESCRIPTION = "natuna:client:command:setDescription",
    REGISTER_COMMAND = "natuna:server:command:register",
    SHARED_SERVER_EVENT_HANDLER = "natuna:shared:server:eventHandler",
    SHARED_SERVER_CALLBACK_RECEIVER = "natuna:shared:server:sendCallbackValues",
    SHARED_CLIENT_EVENT_HANDLER = "natuna:shared:client:eventHandler",
    SHARED_CLIENT_CALLBACK_RECEIVER = "natuna:shared:client:sendCallbackValues",
}
