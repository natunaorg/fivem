import Client from "@client/index";

class Module {
    client: Client;
    config: any;

    usedObjects: {
        [key: number]: string;
    };

    menu: {
        isOpen: boolean;
        type: "PRIMARY" | "SECONDARY";
    };

    isCrosshairOpen: boolean;

    player: {
        isRotating: boolean;
        isHittingSomething:
            | false
            | {
                  entityType: string;
                  entityId: number;
              };
    };

    constructor(client: Client, config: any) {
        this.client = client;
        this.config = config;

        this.isCrosshairOpen = false;
        this.usedObjects = {};

        this.menu = {
            isOpen: false,
            type: "PRIMARY",
        };

        this.player = {
            isHittingSomething: false,
            isRotating: false,
        };

        for (const object of config.usedObjects) {
            this.usedObjects[GetHashKey(object)] = object;
        }

        this.client.addNUIEventHandler("raflymln-entitymenu:client:closeMenuFocus", (_, callback) => {
            SetNuiFocus(false, false);
            this.showCrosshair(false);

            this.menu.isOpen = false;

            if (this.player.isRotating) {
                ClearPedTasks(PlayerPedId());
                this.player.isRotating = false;
            }

            callback({ ok: true });
        });

        setInterval(() => {
            const entityId = this.client.utils.getTargetedEntity(5.0).entityHit; // Lighter than GetEntityPlayerIsFreeAimingAt
            const entityType = this.parseEntityType(entityId);

            switch (entityType) {
                case false:
                    this.showCrosshair(false);

                    if (this.player.isHittingSomething) this.player.isHittingSomething = false;

                    if (this.menu.isOpen) {
                        this.client.triggerNUIEvent("raflymln-entitymenu:nui:closeMenu", { menu: false });

                        SetNuiFocus(false, false);
                        this.menu.isOpen = false;
                    }
                    break;

                default:
                    this.showCrosshair(true);

                    if (!this.player.isHittingSomething) {
                        this.player.isHittingSomething = {
                            entityType,
                            entityId,
                        };
                    }
                    break;
            }
        }, 500);

        let isHoldingKey = false;

        setTick(() => {
            const entityHit = this.player.isHittingSomething;

            if (entityHit) {
                this.client.utils.createHelpNotification(`Press or Hold ~INPUT_PICKUP~ for 1 Second to Interact With ${this.client.utils.ucwords(entityHit.entityType)}`);

                if (IsControlJustPressed(0, 38) && !isHoldingKey) {
                    isHoldingKey = true;

                    setTimeout(() => {
                        if (isHoldingKey) {
                            console.log("[Entity Menu] Opening Secondary Menu");

                            this.menu.type = "SECONDARY";
                            this.openMenu();

                            isHoldingKey = false;
                        }
                    }, 1000);
                }

                if (IsControlJustReleased(0, 38)) {
                    isHoldingKey = false;

                    if (!this.menu.isOpen) {
                        console.log("[Entity Menu] Opening Main Menu");

                        this.menu.type = "PRIMARY";
                        this.openMenu();
                    }
                }
            }
        });
    }

    openMenu = () => {
        if (!this.menu.isOpen) {
            this.rotatePlayerToTarget();
            this.client.triggerNUIEvent("raflymln-entitymenu:nui:openMenu", {
                menuType: this.menu.type,
                ...this.player.isHittingSomething,
                menuList: [
                    {
                        value: "wave",
                        emoji: "👋",
                        text: "Wave the person",
                    },
                    {
                        value: "handshake",
                        emoji: "🤝",
                        text: "Handshake",
                    },
                    {
                        value: "givemoney",
                        emoji: "💵",
                        text: "Give a Money",
                    },
                    {
                        value: "sendcontact",
                        emoji: "📱",
                        text: "Send Contact Data",
                    },
                    {
                        value: "showidcard",
                        emoji: "💶",
                        text: "Show ID Card",
                    },
                    {
                        value: "rob",
                        emoji: "💰",
                        text: "Rob the person",
                    },
                ],
            });

            SetNuiFocus(true, true);
            this.menu.isOpen = true;
        }
    };

    showCrosshair = (toggle: boolean) => {
        if (this.isCrosshairOpen !== toggle) {
            this.client.triggerNUIEvent("raflymln-entitymenu:nui:toggleCrosshair", { toggle });
            this.isCrosshairOpen = toggle;
        }
    };

    parseEntityType = (entity: number) => {
        const type = GetEntityType(entity);

        switch (type) {
            case 1:
                const playerServerId = GetPlayerServerId(entity);
                return playerServerId ? "player" : "pedestrian";

            case 2:
                return "vehicle";

            case 3:
                return this.usedObjects[GetEntityModel(entity)] || false;

            default:
                return false;
        }
    };

    rotatePlayerToTarget = () => {
        if (this.player.isHittingSomething) {
            const p1 = PlayerPedId();
            const p2 = this.player.isHittingSomething.entityId;
            const p2Type = this.player.isHittingSomething.entityType;

            if (p2Type === ("player" || "pedestrian")) {
                this.player.isRotating = true;

                return TaskChatToPed(p1, p2, 16, 0, 0, 0, 0, 0);
            } else {
                const [p1x, p1y, p1z] = GetEntityCoords(p1, true);
                const [p2x, p2y, p2z] = GetEntityCoords(p2, true);

                const dx = p2x - p1x;
                const dy = p2y - p1y;

                const p1h = GetEntityHeading(p1);
                const p2h = GetHeadingFromVector_2d(dx, dy);

                if (p1h - p2h >= 2 || p2h - p1h >= 2) {
                    this.player.isRotating = true;
                    return TaskGoStraightToCoord(p1, p1x, p1y, p1z, 1, -1, p2h, 0);
                }
            }
        }
    };
}

const _handler = (client: Client, config: any) => new Module(client, config);
export { _handler };
