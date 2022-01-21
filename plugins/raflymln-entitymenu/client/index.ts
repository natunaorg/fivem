import Client from "@client/index";
import MenuList from "./menulist";

class Module {
    client: Client;
    config: any;

    isPlayerHoldingAKey: boolean;
    keyHoldingTimeout: NodeJS.Timeout;

    isCrosshairOpen: boolean;
    isPlayerRotating: boolean;
    currentMenu:
        | false
        | {
              [key: string]: any;
          };

    constructor(client: Client, config: any) {
        this.client = client;
        this.config = config;

        this.isCrosshairOpen = false;
        this.isPlayerRotating = false;
        this.currentMenu = false;

        this.client.addNUIEventHandler("raflymln-entitymenu:client:closeMenuFocus", this.closeMenu);
        setTick(this.checkEntity);
    }

    showCrosshair = (toggle: boolean) => {
        if (this.isCrosshairOpen !== toggle) {
            this.client.triggerNUIEvent("raflymln-entitymenu:nui:toggleCrosshair", { toggle });
            this.isCrosshairOpen = toggle;
        }
    };

    rotatePlayerToTarget = (entity: number) => {
        const p1 = PlayerPedId();
        const p2 = entity;

        if (GetEntityType(p2) === 1) {
            this.isPlayerRotating = true;
            return TaskChatToPed(p1, p2, 16, 0, 0, 0, 0, 0);
        } else {
            const [p1x, p1y, p1z] = GetEntityCoords(p1, true);
            const [p2x, p2y, p2z] = GetEntityCoords(p2, true);

            const dx = p2x - p1x;
            const dy = p2y - p1y;

            const p1h = GetEntityHeading(p1);
            const p2h = GetHeadingFromVector_2d(dx, dy);

            if (p1h - p2h >= 2 || p2h - p1h >= 2) {
                this.isPlayerRotating = true;
                return TaskGoStraightToCoord(p1, p1x, p1y, p1z, 1, -1, p2h, 0);
            }
        }
    };

    openMenu = async (entity: number, menuType: "PRIMARY" | "SECONDARY") => {
        if (!this.currentMenu) {
            const menu = new MenuList(this.client, entity, menuType).getMenu();

            if (menu) {
                console.log(`[Entity Menu] Opening ${menuType} Menu`);

                this.rotatePlayerToTarget(entity);
                this.client.triggerNUIEvent("raflymln-entitymenu:nui:openMenu", { menu });

                SetNuiFocus(true, true);
                this.currentMenu = menu;
            }
        }
    };

    closeMenu = (data: any, callback: Function) => {
        SetNuiFocus(false, false);
        this.showCrosshair(false);

        const value = data.data;
        if (value && this.currentMenu) {
            this.currentMenu?.[value]?.callback?.();
        }

        if (this.isPlayerRotating) {
            ClearPedTasks(PlayerPedId());
            this.isPlayerRotating = false;
        }

        this.currentMenu = false;
        callback({ ok: true });
    };

    checkEntity = async () => {
        const entity = this.client.utils.getTargetedEntity(5.0).entityHit; // Lighter than GetEntityPlayerIsFreeAimingAt

        switch (DoesEntityExist(entity) && !!GetEntityType(entity)) {
            case false:
                this.showCrosshair(false);

                if (this.currentMenu) {
                    this.client.triggerNUIEvent("raflymln-entitymenu:nui:closeMenu", { menu: false });

                    SetNuiFocus(false, false);
                    this.currentMenu = false;
                }
                break;

            default:
                this.showCrosshair(true);
                this.client.utils.createHelpNotification(`Press or Hold ~INPUT_PICKUP~ for 1 Second to Interact`);

                // Primary Menu (Click)
                if (IsControlJustReleased(0, 38)) {
                    this.isPlayerHoldingAKey = false;

                    if (!this.currentMenu) {
                        await this.openMenu(entity, "PRIMARY");
                    }

                    if (this.keyHoldingTimeout) {
                        clearTimeout(this.keyHoldingTimeout);
                    }
                }

                // Secondary Menu (Holding 1s)
                if (IsControlJustPressed(0, 38) && !this.isPlayerHoldingAKey) {
                    this.isPlayerHoldingAKey = true;

                    this.keyHoldingTimeout = setTimeout(async () => {
                        if (this.isPlayerHoldingAKey) {
                            await this.openMenu(entity, "SECONDARY");
                            this.isPlayerHoldingAKey = false;
                        }
                    }, 1000);
                }
                break;
        }
    };
}

const _handler = (client: Client, config: any) => new Module(client, config);
export { _handler };
