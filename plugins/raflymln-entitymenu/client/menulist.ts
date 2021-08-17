import Client from "@client/index";

const beds = {
    2117668672: "Pillbox Bed",
};

export default class MenuList {
    client: Client;
    menuType: "PRIMARY" | "SECONDARY";
    entity: {
        id: number;
        type: number;
        model: number;
    };

    constructor(client: Client, entity: number, menuType: "PRIMARY" | "SECONDARY") {
        this.client = client;
        this.menuType = menuType;
        this.entity = {
            id: entity,
            type: GetEntityType(entity),
            model: GetEntityModel(entity),
        };
    }

    setCancelButton = () => {
        const wakeup = setTick(() => {
            this.client.utils.createHelpNotification("Press ~INPUT_JUMP~ to Wake Up");

            if (IsControlJustPressed(1, 22)) {
                FreezeEntityPosition(this.entity.id, false);
                ClearPedTasks(PlayerPedId());
                clearTick(wakeup);
            }
        });
    };

    getMenu = () => {
        switch (true) {
            case this.menuType === "PRIMARY" && this.entity.type == 1:
                return {
                    wave: {
                        emoji: "👋",
                        text: "Wave the person",
                        callback: () => {
                            ExecuteCommand("e wave9");
                        },
                    },
                    handshake: {
                        emoji: "🤝",
                        text: "Handshake",
                    },
                    givemoney: {
                        emoji: "💵",
                        text: "Give a Money",
                    },
                    sendcontact: {
                        emoji: "📱",
                        text: "Send Contact Data",
                    },
                    showidcard: {
                        emoji: "💶",
                        text: "Show ID Card",
                    },
                    rob: {
                        emoji: "💰",
                        text: "Rob the person",
                    },
                    follow: {
                        emoji: "🙏",
                        text: "Make NPC following you",
                        callback: () => {
                            ClearPedTasks(this.entity.id);
                            const cancel = setTick(() => {
                                TaskFollowToOffsetOfEntity(this.entity.id, PlayerPedId(), 0, 0, 0, 10, -1, 0, true);

                                this.client.utils.createHelpNotification("Press ~INPUT_JUMP~ to Cancel");

                                if (IsControlJustPressed(1, 22)) {
                                    ClearPedTasksImmediately(this.entity.id);
                                    clearTick(cancel);
                                }
                            });
                        },
                    },
                };

            case this.menuType == "PRIMARY" && this.entity.type === 3:
                let actions: Array<{ [key: string]: { emoji: string; text: string; callback: () => any } }> = [];

                console.log(this.entity.model);
                return {
                    delete: {
                        emoji: "🗑️",
                        text: "Delete",
                        callback: () => {
                            SetEntityAsNoLongerNeeded(this.entity.id);
                            SetEntityAsMissionEntity(this.entity.id, true, true);
                            DeleteEntity(this.entity.id);
                        },
                    },
                    sit: {
                        emoji: "🪑",
                        text: "Sit",
                        callback: () => {
                            const objCoords = this.client.game.entity.getCoords(this.entity.id);
                            const playerCoords = this.client.game.entity.getCoords(PlayerPedId());
                            const zAxis = objCoords.z + (playerCoords.z - objCoords.z) / 2;

                            TaskStartScenarioAtPosition(PlayerPedId(), "PROP_HUMAN_SEAT_BENCH", objCoords.x, objCoords.y, zAxis, objCoords.heading + 180, 0, true, false);
                            FreezeEntityPosition(this.entity.id, true);

                            this.setCancelButton();
                        },
                    },
                    sleep: {
                        emoji: "🛌",
                        text: "Sleep",
                        callback: async () => {
                            const animDict = "anim@gangops@morgue@table@";
                            const { x, y, z, heading } = this.client.game.entity.getCoords(this.entity.id);

                            SetEntityCoords(PlayerPedId(), x, y, z + 0.3, true, true, true, false);
                            SetEntityHeading(PlayerPedId(), heading + 180.0);
                            FreezeEntityPosition(this.entity.id, true);

                            RequestAnimDict(animDict);
                            while (!HasAnimDictLoaded(animDict)) await this.client.wait(100);
                            TaskPlayAnim(PlayerPedId(), animDict, "ko_front", 8.0, -8.0, -1, 1, 0, false, false, false);
                            RemoveAnimDict(animDict);

                            this.setCancelButton();
                        },
                    },
                    grab: {
                        emoji: "🤏",
                        text: "Grab",
                        callback: async () => {
                            let distance = 1.3;
                            let dict = "impexp_int-0";

                            SetEntityAsMissionEntity(this.entity.id, true, true);
                            SetEntityAlpha(this.entity.id, 150, true);

                            RequestAnimDict(dict);

                            while (!HasAnimDictLoaded(dict)) {
                                await this.client.wait(100);
                            }

                            TaskPlayAnim(PlayerPedId(), dict, "mp_m_waremech_01_dual-0", 2.0, 2.0, -1, 51, 0, false, false, false);
                            RemoveAnimDict(dict);

                            const tick = setTick(async () => {
                                const { x, y, z } = this.client.utils.getCamTargetedCoords(distance);
                                let heading = GetEntityHeading(this.entity.id);

                                await this.client.utils.drawInstructionalButtons([
                                    { controlType: 2, controlId: 201, message: "Confirm" },
                                    { controlType: 2, controlId: 188, message: "Add More Radius" },
                                    { controlType: 2, controlId: 187, message: "Reduce Radius" },
                                    { controlType: 2, controlId: 189, message: "Rotate Left" },
                                    { controlType: 2, controlId: 190, message: "Rotate Right" },
                                ]);

                                if (IsControlPressed(2, 188)) distance += 0.2;
                                if (IsControlPressed(2, 187)) distance -= 0.2;

                                if (IsControlPressed(2, 189)) heading += 3.0;
                                if (IsControlPressed(2, 190)) heading -= 3.0;

                                SetEntityCoordsNoOffset(this.entity.id, x, y, z, true, true, true);
                                SetEntityHeading(this.entity.id, heading);
                                SetEntityCollision(this.entity.id, false, true);

                                if (IsControlJustPressed(2, 201)) {
                                    ClearPedTasks(PlayerPedId());
                                    PlaceObjectOnGroundProperly(this.entity.id);
                                    SetEntityAlpha(this.entity.id, 255, true);
                                    SetEntityCollision(this.entity.id, true, true);
                                    clearTick(tick);
                                }
                            });
                        },
                    },
                };

            default:
                return false;
        }
    };
}
