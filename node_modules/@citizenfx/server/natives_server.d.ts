/**
 * Adds a rectangular blip for the specified coordinates/area.
 * It is recommended to use [SET_BLIP_ROTATION](#_0xF87683CDF73C3F6E) and [SET_BLIP_COLOUR](#_0x03D7FB09E75D6B7E) to make the blip not rotate along with the camera.
 * By default, the blip will show as a _regular_ blip with the specified color/sprite if it is outside of the minimap view.
 * Example image:
 * ![minimap](https://w.wew.wtf/pdcjig.png)
 * ![big map](https://w.wew.wtf/zgcjcm.png)
 * (Native name is _likely_ to actually be ADD_BLIP_FOR_AREA, but due to the usual reasons this can't be confirmed)
 * @param x The X coordinate of the center of the blip.
 * @param y The Y coordinate of the center of the blip.
 * @param z The Z coordinate of the center of the blip.
 * @param width The width of the blip.
 * @param height The height of the blip.
 * @return A handle to the blip.
 */
declare function AddBlipForArea(x: number, y: number, z: number, width: number, height: number): number;

/**
 * Creates a blip for the specified coordinates. You can use `SET_BLIP_` natives to change the blip.
 * @param x The X coordinate to create the blip on.
 * @param y The Y coordinate.
 * @param z The Z coordinate.
 * @return A blip handle.
 */
declare function AddBlipForCoord(x: number, y: number, z: number): number;

/**
 * Returns red ( default ) blip attached to entity.
 * Example:
 * Blip blip; //Put this outside your case or option
 * blip = UI::ADD_BLIP_FOR_ENTITY(YourPedOrBodyguardName);
 * UI::SET_BLIP_AS_FRIENDLY(blip, true);
 */
declare function AddBlipForEntity(entity: number): number;

declare function AddBlipForRadius(posX: number, posY: number, posZ: number, radius: number): number;

/**
 * Applies an Item from a PedDecorationCollection to a ped. These include tattoos and shirt decals.
 * collection - PedDecorationCollection filename hash
 * overlay - Item name hash
 * Example:
 * Entry inside "mpbeach_overlays.xml" -
 * <Item>
 * <uvPos x="0.500000" y="0.500000" />
 * <scale x="0.600000" y="0.500000" />
 * <rotation value="0.000000" />
 * <nameHash>FM_Hair_Fuzz</nameHash>
 * <txdHash>mp_hair_fuzz</txdHash>
 * <txtHash>mp_hair_fuzz</txtHash>
 * <zone>ZONE_HEAD</zone>
 * <type>TYPE_TATTOO</type>
 * <faction>FM</faction>
 * <garment>All</garment>
 * <gender>GENDER_DONTCARE</gender>
 * <award />
 * <awardLevel />
 * </Item>
 * Code:
 * PED::_0x5F5D1665E352A839(PLAYER::PLAYER_PED_ID(), GAMEPLAY::GET_HASH_KEY("mpbeach_overlays"), GAMEPLAY::GET_HASH_KEY("fm_hair_fuzz"))
 */
declare function AddPedDecorationFromHashes(ped: number, collection: string | number, overlay: string | number): void;

/**
 * Applies a force to the specified entity.
 * **List of force types (p1)**:
 * ```
 * public enum ForceType
 * {
 * MinForce = 0,
 * MaxForceRot = 1,
 * MinForce2 = 2,
 * MaxForceRot2 = 3,
 * ForceNoRot = 4,
 * ForceRotPlusForce = 5
 * }
 * ```
 * Research/documentation on the gtaforums can be found [here](https://gtaforums.com/topic/885669-precisely-define-object-physics/) and [here](https://gtaforums.com/topic/887362-apply-forces-and-momentums-to-entityobject/).
 * @param entity The entity you want to apply a force on
 * @param forceType See native description above for a list of commonly used values
 * @param x Force amount (X)
 * @param y Force amount (Y)
 * @param z Force amount (Z)
 * @param offX Rotation/offset force (X)
 * @param offY Rotation/offset force (Y)
 * @param offZ Rotation/offset force (Z)
 * @param boneIndex (Often 0) Entity bone index
 * @param isDirectionRel (Usually false) Vector defined in local (body-fixed) coordinate frame
 * @param ignoreUpVec (Usually true)
 * @param isForceRel (Usually true) When true, force gets multiplied with the objects mass and different objects will have the same acceleration
 * @param p12 (Usually false)
 * @param p13 (Usually true)
 */
declare function ApplyForceToEntity(entity: number, forceType: number, x: number, y: number, z: number, offX: number, offY: number, offZ: number, boneIndex: number, isDirectionRel: boolean, ignoreUpVec: boolean, isForceRel: boolean, p12: boolean, p13: boolean): void;

/**
 * Returns whether or not the specified player has enough information to start a commerce session for.
 * @param playerSrc The player handle
 * @return True or false.
 */
declare function CanPlayerStartCommerceSession(playerSrc: string): number;

/**
 * Cancels the currently executing event.
 */
declare function CancelEvent(): void;

/**
 * List of component/props ID
 * gtaxscripting.blogspot.com/2016/04/gta-v-peds-component-and-props.html
 */
declare function ClearPedProp(ped: number, propId: number): void;

declare function ClearPedSecondaryTask(ped: number): void;

declare function ClearPedTasks(ped: number): void;

/**
 * Immediately stops the pedestrian from whatever it's doing. They stop fighting, animations, etc. they forget what they were doing.
 */
declare function ClearPedTasksImmediately(ped: number): void;

/**
 * This executes at the same as speed as PLAYER::SET_PLAYER_WANTED_LEVEL(player, 0, false);
 * PLAYER::GET_PLAYER_WANTED_LEVEL(player); executes in less than half the time. Which means that it's worth first checking if the wanted level needs to be cleared before clearing. However, this is mostly about good code practice and can important in other situations. The difference in time in this example is negligible.
 */
declare function ClearPlayerWantedLevel(player: number): void;

declare function CreateObject(modelHash: number, x: number, y: number, z: number, isNetwork: boolean, netMissionEntity: boolean, dynamic: boolean): number;

declare function CreateObjectNoOffset(modelHash: string | number, x: number, y: number, z: number, isNetwork: boolean, netMissionEntity: boolean, dynamic: boolean): number;

/**
 * *Heading*: 0.0
 * *Heading* is the Z axis spawn rotation of the ped 0->5th parameter.
 * Ped Types:
 * enum PedTypes
 * {
 * PED_TYPE_PLAYER_0,// michael
 * PED_TYPE_PLAYER_1,// franklin
 * PED_TYPE_NETWORK_PLAYER,	// mp character
 * PED_TYPE_PLAYER_2,// trevor
 * PED_TYPE_CIVMALE,
 * PED_TYPE_CIVFEMALE,
 * PED_TYPE_COP,
 * PED_TYPE_GANG_ALBANIAN,
 * PED_TYPE_GANG_BIKER_1,
 * PED_TYPE_GANG_BIKER_2,
 * PED_TYPE_GANG_ITALIAN,
 * PED_TYPE_GANG_RUSSIAN,
 * PED_TYPE_GANG_RUSSIAN_2,
 * PED_TYPE_GANG_IRISH,
 * PED_TYPE_GANG_JAMAICAN,
 * PED_TYPE_GANG_AFRICAN_AMERICAN,
 * PED_TYPE_GANG_KOREAN,
 * PED_TYPE_GANG_CHINESE_JAPANESE,
 * PED_TYPE_GANG_PUERTO_RICAN,
 * PED_TYPE_DEALER,
 * PED_TYPE_MEDIC,
 * PED_TYPE_FIREMAN,
 * PED_TYPE_CRIMINAL,
 * PED_TYPE_BUM,
 * PED_TYPE_PROSTITUTE,
 * PED_TYPE_SPECIAL,
 * PED_TYPE_MISSION,
 * PED_TYPE_SWAT,
 * PED_TYPE_ANIMAL,
 * PED_TYPE_ARMY
 * };
 */
declare function CreatePed(pedType: number, modelHash: string | number, x: number, y: number, z: number, heading: number, isNetwork: boolean, netMissionEntity: boolean): number;

/**
 * Ped Types:
 * enum ePedType
 * {
 * PED_TYPE_PLAYER_0 = 0,
 * PED_TYPE_PLAYER_1 = 1,
 * PED_TYPE_PLAYER_2 = 3,
 * PED_TYPE_CIVMALE = 4,
 * PED_TYPE_CIVFEMALE = 5,
 * PED_TYPE_COP = 6,
 * PED_TYPE_UNKNOWN_7 = 7,
 * PED_TYPE_UNKNOWN_12 = 12, // gang member?
 * PED_TYPE_UNKNOWN_19 = 19,
 * PED_TYPE_MEDIC = 20,
 * PED_TYPE_FIREMAN = 21,
 * PED_TYPE_UNKNOWN_22 = 22,
 * PED_TYPE_UNKNOWN_25 = 25,
 * PED_TYPE_UNKNOWN_26 = 26,
 * PED_TYPE_SWAT = 27,
 * PED_TYPE_ANIMAL = 28,
 * PED_TYPE_ARMY = 29
 * };
 */
declare function CreatePedInsideVehicle(vehicle: number, pedType: number, modelHash: string | number, seat: number, isNetwork: boolean, netMissionEntity: boolean): number;

/**
 * NativeDB Added Parameter 8: BOOL p7
 */
declare function CreateVehicle(modelHash: string | number, x: number, y: number, z: number, heading: number, isNetwork: boolean, netMissionEntity: boolean): number;

/**
 * Deletes the specified entity.
 * @param entity The entity to delete.
 */
declare function DeleteEntity(entity: number): void;

declare function DeleteFunctionReference(referenceIdentity: string): void;

declare function DeleteResourceKvp(key: string): void;

declare function DoesEntityExist(entity: number): number;

/**
 * Requests whether or not the player owns the specified SKU.
 * @param playerSrc The player handle
 * @param skuId The ID of the SKU.
 * @return A boolean.
 */
declare function DoesPlayerOwnSku(playerSrc: string, skuId: number): number;

/**
 * Requests whether or not the player owns the specified package.
 * @param playerSrc The player handle
 * @param skuId The package ID on Tebex.
 * @return A boolean.
 */
declare function DoesPlayerOwnSkuExt(playerSrc: string, skuId: number): number;

declare function DropPlayer(playerSrc: string, reason: string): void;

declare function DuplicateFunctionReference(referenceIdentity: string): string;

declare function EnableEnhancedHostSupport(enabled: boolean): void;

declare function EndFindKvp(handle: number): void;

declare function ExecuteCommand(commandString: string): void;

declare function FindKvp(handle: number): string;

declare function FlagServerAsPrivate(private_: boolean): void;

/**
 * ```
 * No, this should be called SET_ENTITY_KINEMATIC. It does more than just "freeze" it's position.
 * ^Rockstar Devs named it like that, Now cry about it.
 * ```
 * Freezes or unfreezes an entity preventing its coordinates to change by the player if set to `true`. You can still change the entity position using SET_ENTITY_COORDS.
 * @param entity The entity to freeze/unfreeze.
 * @param toggle Freeze or unfreeze entity.
 */
declare function FreezeEntityPosition(entity: number, toggle: boolean): void;

declare function GetAirDragMultiplierForPlayersVehicle(playerSrc: string): number;

/**
 * Returns all peds handles known to the server.
 * The data returned adheres to the following layout:
 * ```
 * [127, 42, 13, 37]
 * ```
 * @return An object containing a list of peds handles.
 */
declare function GetAllPeds(): any;

/**
 * Returns all vehicle handles known to the server.
 * The data returned adheres to the following layout:
 * ```
 * [127, 42, 13, 37]
 * ```
 * @return An object containing a list of vehicle handles.
 */
declare function GetAllVehicles(): any;

declare function GetBlipSprite(self: number): number;

/**
 * Returns the current console output buffer.
 * @return The most recent game console output, as a string.
 */
declare function GetConsoleBuffer(): string;

declare function GetConvar(varName: string, default_: string): string;

declare function GetConvarInt(varName: string, default_: number): number;

/**
 * Returns the name of the currently executing resource.
 * @return The name of the resource.
 */
declare function GetCurrentResourceName(): string;

/**
 * Gets the current coordinates for a specified entity. This native is used server side when using OneSync. See <a href="#_0x3FEF770D40960D5A" >GET_ENTITY_COORDS</a> for client side.
 * @param entity The entity to get the coordinates from.
 * @return The current entity coordinates.
 */
declare function GetEntityCoords(entity: number): number[];

declare function GetEntityHeading(entity: number): number;

/**
 * Currently it only works with peds.
 */
declare function GetEntityHealth(entity: number): number;

/**
 * Currently it only works with peds.
 */
declare function GetEntityMaxHealth(entity: number): number;

declare function GetEntityModel(entity: number): number;

/**
 * This native gets an entity's population type.
 * @param entity the entity to obtain the population type from
 * @return Returns the population type ID, defined by the below enumeration:```cpp
enum ePopulationType
{
	POPTYPE_UNKNOWN = 0,
	POPTYPE_RANDOM_PERMANENT,
	POPTYPE_RANDOM_PARKED,
	POPTYPE_RANDOM_PATROL,
	POPTYPE_RANDOM_SCENARIO,
	POPTYPE_RANDOM_AMBIENT,
	POPTYPE_PERMANENT,
	POPTYPE_MISSION,
	POPTYPE_REPLAY,
	POPTYPE_CACHE,
	POPTYPE_TOOL
};
```
 */
declare function GetEntityPopulationType(entity: number): number;

declare function GetEntityRotation(entity: number): number[];

declare function GetEntityRotationVelocity(entity: number): number[];

declare function GetEntityScript(entity: number): string;

declare function GetEntityType(entity: number): number;

declare function GetEntityVelocity(entity: number): number[];

/**
 * Gets the current game timer in milliseconds.
 * @return The game time.
 */
declare function GetGameTimer(): number;

/**
 * This native converts the passed string to a hash.
 */
declare function GetHashKey(model: string): number;

declare function GetHostId(): string;

declare function GetInstanceId(): number;

declare function GetInvokingResource(): string;

declare function GetIsVehicleEngineRunning(vehicle: number): number;

declare function GetIsVehiclePrimaryColourCustom(vehicle: number): number;

declare function GetIsVehicleSecondaryColourCustom(vehicle: number): number;

declare function GetNumPlayerIdentifiers(playerSrc: string): number;

declare function GetNumPlayerIndices(): number;

/**
 * Gets the amount of metadata values with the specified key existing in the specified resource's manifest.
 * See also: [Resource manifest](https://docs.fivem.net/resources/manifest/)
 * @param resourceName The resource name.
 * @param metadataKey The key to look up in the resource manifest.
 */
declare function GetNumResourceMetadata(resourceName: string, metadataKey: string): number;

declare function GetNumResources(): number;

declare function GetPasswordHash(password: string): string;

declare function GetPedArmour(ped: number): number;

declare function GetPedCauseOfDeath(ped: number): number;

declare function GetPedDesiredHeading(ped: number): number;

declare function GetPedMaxHealth(ped: number): number;

declare function GetPlayerEndpoint(playerSrc: string): string;

declare function GetPlayerFromIndex(index: number): string;

declare function GetPlayerGuid(playerSrc: string): string;

declare function GetPlayerIdentifier(playerSrc: string, identifier: number): string;

declare function GetPlayerLastMsg(playerSrc: string): number;

declare function GetPlayerMaxArmour(playerSrc: string): number;

declare function GetPlayerMaxHealth(playerSrc: string): number;

/**
 * A getter for [SET_PLAYER_MELEE_WEAPON_DAMAGE_MODIFIER](#_0x4A3DC7ECCC321032).
 * @return Returns player melee weapon damage modifier value.
 */
declare function GetPlayerMeleeWeaponDamageModifier(): number;

declare function GetPlayerName(playerSrc: string): string;

declare function GetPlayerPed(playerSrc: string): number;

declare function GetPlayerPing(playerSrc: string): number;

declare function GetPlayerTeam(playerSrc: string): number;

/**
 * Gets the amount of time player has spent evading the cops.
 * Counter starts and increments only when cops are chasing the player.
 * If the player is evading, the timer will pause.
 * @param playerSrc The target player
 * @param lastPursuit False = CurrentPursuit, True = LastPursuit
 * @return Returns -1, if the player is not wanted or wasn't in pursuit before, depending on the lastPursuit parameter
Returns 0, if lastPursuit == False and the player has a wanted level, but the pursuit has not started yet
Otherwise, will return the milliseconds of the pursuit.
 */
declare function GetPlayerTimeInPursuit(playerSrc: string, lastPursuit: boolean): number;

/**
 * Returns given players wanted level server-side.
 * @param playerSrc The target player
 * @return The wanted level
 */
declare function GetPlayerWantedLevel(playerSrc: string): number;

/**
 * A getter for [SET_PLAYER_WEAPON_DAMAGE_MODIFIER](#_0xCE07B9F7817AADA3).
 * @param playerId The player index.
 * @return The value of player weapon damage modifier.
 */
declare function GetPlayerWeaponDamageModifier(playerId: number): number;

/**
 * A getter for [SET_PLAYER_WEAPON_DEFENSE_MODIFIER](#_0x2D83BC011CA14A3C).
 * @param playerId The player index.
 * @return The value of player weapon defense modifier.
 */
declare function GetPlayerWeaponDefenseModifier(playerId: number): number;

/**
 * A getter for [\_SET_PLAYER_WEAPON_DEFENSE_MODIFIER_2](#_0xBCFDE9EDE4CF27DC).
 * @param playerId The player index.
 * @return The value of player weapon defense modifier 2.
 */
declare function GetPlayerWeaponDefenseModifier_2(playerId: number): number;

/**
 * Returns all commands that are registered in the command system.
 * The data returned adheres to the following layout:
 * ```
 * [
 * {
 * "name": "cmdlist"
 * },
 * {
 * "name": "command1"
 * }
 * ]
 * ```
 * @return An object containing registered commands.
 */
declare function GetRegisteredCommands(): any;

declare function GetResourceByFindIndex(findIndex: number): string;

declare function GetResourceKvpFloat(key: string): number;

declare function GetResourceKvpInt(key: string): number;

declare function GetResourceKvpString(key: string): string;

/**
 * Gets the metadata value at a specified key/index from a resource's manifest.
 * See also: [Resource manifest](https://docs.fivem.net/resources/manifest/)
 * @param resourceName The resource name.
 * @param metadataKey The key in the resource manifest.
 * @param index The value index, in a range from [0..GET_NUM_RESOURCE_METDATA-1].
 */
declare function GetResourceMetadata(resourceName: string, metadataKey: string, index: number): string;

/**
 * Returns the physical on-disk path of the specified resource.
 * @param resourceName The name of the resource.
 * @return The resource directory name, possibly without trailing slash.
 */
declare function GetResourcePath(resourceName: string): string;

/**
 * Returns the current state of the specified resource.
 * @param resourceName The name of the resource.
 * @return The resource state. One of `"missing", "started", "starting", "stopped", "stopping", "uninitialized" or "unknown"`.
 */
declare function GetResourceState(resourceName: string): string;

/**
 * Returns a hash of selected ped weapon.
 * @param ped The target ped.
 * @return The weapon hash.
 */
declare function GetSelectedPedWeapon(ped: number): number;

declare function GetVehicleBodyHealth(vehicle: number): number;

declare function GetVehicleColours(vehicle: number): [number, number];

declare function GetVehicleCustomPrimaryColour(vehicle: number): [number, number, number];

declare function GetVehicleCustomSecondaryColour(vehicle: number): [number, number, number];

declare function GetVehicleDashboardColour(vehicle: number, color: number): void;

declare function GetVehicleDirtLevel(vehicle: number): number;

/**
 * enum VehicleLockStatus = {
 * None = 0,
 * Unlocked = 1,
 * Locked = 2,
 * LockedForPlayer = 3,
 * StickPlayerInside = 4, -- Doesn't allow players to exit the vehicle with the exit vehicle key.
 * CanBeBrokenInto = 7, -- Can be broken into the car. If the glass is broken, the value will be set to 1
 * CanBeBrokenIntoPersist = 8, -- Can be broken into persist
 * CannotBeTriedToEnter = 10, -- Cannot be tried to enter (Nothing happens when you press the vehicle enter key).
 * }
 */
declare function GetVehicleDoorLockStatus(vehicle: number): number;

declare function GetVehicleDoorStatus(vehicle: number): number;

/**
 * Currently it only works when set to "all players".
 */
declare function GetVehicleDoorsLockedForPlayer(vehicle: number): number;

declare function GetVehicleEngineHealth(vehicle: number): number;

declare function GetVehicleExtraColours(vehicle: number): [number, number];

declare function GetVehicleHandbrake(vehicle: number): number;

declare function GetVehicleHeadlightsColour(vehicle: number): number;

declare function GetVehicleInteriorColour(vehicle: number, color: number): void;

declare function GetVehicleLightsState(vehicle: number): [number, any /* actually bool */, any /* actually bool */];

declare function GetVehicleLivery(vehicle: number): number;

declare function GetVehicleNumberPlateText(vehicle: number): string;

declare function GetVehicleNumberPlateTextIndex(vehicle: number): number;

/**
 * Gets the vehicle the specified Ped is/was in depending on bool value. This native is used server side when using OneSync.
 * @param ped The target ped
 * @param lastVehicle False = CurrentVehicle, True = LastVehicle
 * @return The vehicle id. Returns 0 if the ped is/was not in a vehicle.
 */
declare function GetVehiclePedIsIn(ped: number, lastVehicle: boolean): number;

declare function GetVehiclePetrolTankHealth(vehicle: number): number;

declare function GetVehicleRadioStationIndex(vehicle: number): number;

declare function GetVehicleRoofLivery(vehicle: number): number;

declare function GetVehicleTyreSmokeColor(vehicle: number): [number, number, number];

declare function GetVehicleWheelType(vehicle: number): number;

declare function GetVehicleWindowTint(vehicle: number): number;

declare function GiveWeaponComponentToPed(ped: number, weaponHash: string | number, componentHash: string | number): void;

/**
 * isHidden - ????
 * All weapon names (add to the list if something is missing), use GAMEPLAY::GET_HASH_KEY((char *)weaponNames[i]) to get get the hash:
 * static LPCSTR weaponNames[] = {
 * "WEAPON_KNIFE", "WEAPON_NIGHTSTICK", "WEAPON_HAMMER", "WEAPON_BAT", "WEAPON_GOLFCLUB",
 * "WEAPON_CROWBAR", "WEAPON_PISTOL", "WEAPON_COMBATPISTOL", "WEAPON_APPISTOL", "WEAPON_PISTOL50",
 * "WEAPON_MICROSMG", "WEAPON_SMG", "WEAPON_ASSAULTSMG", "WEAPON_ASSAULTRIFLE",
 * "WEAPON_CARBINERIFLE", "WEAPON_ADVANCEDRIFLE", "WEAPON_MG", "WEAPON_COMBATMG", "WEAPON_PUMPSHOTGUN",
 * "WEAPON_SAWNOFFSHOTGUN", "WEAPON_ASSAULTSHOTGUN", "WEAPON_BULLPUPSHOTGUN", "WEAPON_STUNGUN", "WEAPON_SNIPERRIFLE",
 * "WEAPON_HEAVYSNIPER", "WEAPON_GRENADELAUNCHER", "WEAPON_GRENADELAUNCHER_SMOKE", "WEAPON_RPG", "WEAPON_MINIGUN",
 * "WEAPON_GRENADE", "WEAPON_STICKYBOMB", "WEAPON_SMOKEGRENADE", "WEAPON_BZGAS", "WEAPON_MOLOTOV",
 * "WEAPON_FIREEXTINGUISHER", "WEAPON_PETROLCAN", "WEAPON_FLARE", "WEAPON_SNSPISTOL", "WEAPON_SPECIALCARBINE",
 * "WEAPON_HEAVYPISTOL", "WEAPON_BULLPUPRIFLE", "WEAPON_HOMINGLAUNCHER", "WEAPON_PROXMINE", "WEAPON_SNOWBALL",
 * "WEAPON_VINTAGEPISTOL", "WEAPON_DAGGER", "WEAPON_FIREWORK", "WEAPON_MUSKET", "WEAPON_MARKSMANRIFLE",
 * "WEAPON_HEAVYSHOTGUN", "WEAPON_GUSENBERG", "WEAPON_HATCHET", "WEAPON_RAILGUN", "WEAPON_COMBATPDW",
 * "WEAPON_KNUCKLE", "WEAPON_MARKSMANPISTOL", "WEAPON_FLASHLIGHT", "WEAPON_MACHETE", "WEAPON_MACHINEPISTOL",
 * "WEAPON_SWITCHBLADE", "WEAPON_REVOLVER", "WEAPON_COMPACTRIFLE", "WEAPON_DBSHOTGUN", "WEAPON_FLAREGUN",
 * "WEAPON_AUTOSHOTGUN", "WEAPON_BATTLEAXE", "WEAPON_COMPACTLAUNCHER", "WEAPON_MINISMG", "WEAPON_PIPEBOMB",
 * "WEAPON_POOLCUE", "WEAPON_SWEEPER", "WEAPON_WRENCH"
 * };
 * ----------------------------------------------------------------------------------------------------------------------------------------
 * Translation table:
 * pastebin.com/a39K8Nz8
 */
declare function GiveWeaponToPed(ped: number, weaponHash: string | number, ammoCount: number, isHidden: boolean, equipNow: boolean): void;

declare function HasEntityBeenMarkedAsNoLongerNeeded(vehicle: number): number;

declare function HasVehicleBeenOwnedByPlayer(vehicle: number): number;

declare function InvokeFunctionReference(referenceIdentity: string, argsSerialized: string, argsLength: number, retvalLength: number): string;

declare function IsAceAllowed(object: string): number;

/**
 * Gets whether or not this is the CitizenFX server.
 * @return A boolean value.
 */
declare function IsDuplicityVersion(): number;

declare function IsPlayerAceAllowed(playerSrc: string, object: string): number;

/**
 * Requests whether or not the commerce data for the specified player has loaded.
 * @param playerSrc The player handle
 * @return A boolean.
 */
declare function IsPlayerCommerceInfoLoaded(playerSrc: string): number;

/**
 * Requests whether or not the commerce data for the specified player has loaded from Tebex.
 * @param playerSrc The player handle
 * @return A boolean.
 */
declare function IsPlayerCommerceInfoLoadedExt(playerSrc: string): number;

/**
 * This will return true if the player is evading wanted level, meaning that the wanted level stars are blink.
 * Otherwise will return false.
 * If the player is not wanted, it simply returns false.
 * @param playerSrc The target player
 * @return boolean value, depending if the player is evading his wanted level or not.
 */
declare function IsPlayerEvadingWantedLevel(playerSrc: string): number;

declare function IsPlayerUsingSuperJump(playerSrc: string): number;

declare function IsPrincipalAceAllowed(principal: string, object: string): number;

declare function IsVehicleEngineStarting(vehicle: number): number;

declare function IsVehicleExtraTurnedOn(vehicle: number, extraId: number): number;

declare function IsVehicleSirenOn(vehicle: number): number;

declare function IsVehicleTyreBurst(vehicle: number, wheelID: number, completely: boolean): number;

/**
 * Requests the commerce data for the specified player, including the owned SKUs. Use `IS_PLAYER_COMMERCE_INFO_LOADED` to check if it has loaded.
 * @param playerSrc The player handle
 */
declare function LoadPlayerCommerceData(playerSrc: string): void;

/**
 * Requests the commerce data from Tebex for the specified player, including the owned SKUs. Use `IS_PLAYER_COMMERCE_INFO_LOADED` to check if it has loaded.
 * @param playerSrc The player handle
 */
declare function LoadPlayerCommerceDataExt(playerSrc: string): void;

/**
 * Reads the contents of a text file in a specified resource.
 * If executed on the client, this file has to be included in `files` in the resource manifest.
 * Example: `local data = LoadResourceFile("devtools", "data.json")`
 * @param resourceName The resource name.
 * @param fileName The file in the resource.
 * @return The file contents
 */
declare function LoadResourceFile(resourceName: string, fileName: string): string;

/**
 * Create a permanent voice channel.
 * @param id ID of the channel.
 */
declare function MumbleCreateChannel(id: number): void;

declare function NetworkGetEntityFromNetworkId(netId: number): number;

/**
 * Returns the owner ID of the specified entity.
 * @param entity The entity to get the owner for.
 * @return On the server, the server ID of the entity owner. On the client, returns the player/slot ID of the entity owner.
 */
declare function NetworkGetEntityOwner(entity: number): number;

declare function NetworkGetNetworkIdFromEntity(entity: number): number;

declare function NetworkGetVoiceProximityOverride(playerSrc: string): number[];

declare function PerformHttpRequestInternal(requestData: string, requestDataLength: number): number;

/**
 * Scope entry for profiler.
 * @param scopeName Scope name.
 */
declare function ProfilerEnterScope(scopeName: string): void;

/**
 * Scope exit for profiler.
 */
declare function ProfilerExitScope(): void;

/**
 * Returns true if the profiler is active.
 * @return True or false.
 */
declare function ProfilerIsRecording(): number;

/**
 * Registered commands can be executed by entering them in the client console (this works for client side and server side registered commands). Or by entering them in the server console/through an RCON client (only works for server side registered commands). Or if you use a supported chat resource, like the default one provided in the cfx-server-data repository, then you can enter the command in chat by prefixing it with a `/`.
 * Commands registered using this function can also be executed by resources, using the [`ExecuteCommand` native](#_0x561C060B).
 * The restricted bool is not used on the client side. Permissions can only be checked on the server side, so if you want to limit your command with an ace permission automatically, make it a server command (by registering it in a server script).
 * **Example result**:
 * ![](https://i.imgur.com/TaCnG09.png)
 * @param commandName The command you want to register.
 * @param handler A handler function that gets called whenever the command is executed.
 * @param restricted If this is a server command and you set this to true, then players will need the command.yourCommandName ace permission to execute this command.
 */
declare function RegisterCommand(commandName: string, handler: Function, restricted: boolean): void;

/**
 * Registers a listener for console output messages.
 * @param listener A function of `(channel: string, message: string) => void`. The message might contain `\n`.
 */
declare function RegisterConsoleListener(listener: Function): void;

/**
 * An internal function which allows the current resource's HLL script runtimes to receive state for the specified event.
 * @param eventName An event name, or "\*" to disable HLL event filtering for this resource.
 */
declare function RegisterResourceAsEventHandler(eventName: string): void;

/**
 * **Experimental**: This native may be altered or removed in future versions of CitizenFX without warning.
 * Registers a cached resource asset with the resource system, similar to the automatic scanning of the `stream/` folder.
 * @param resourceName The resource to add the asset to.
 * @param fileName A file name in the resource.
 * @return A cache string to pass to `REGISTER_STREAMING_FILE_FROM_CACHE` on the client.
 */
declare function RegisterResourceAsset(resourceName: string, fileName: string): string;

/**
 * Registers a build task factory for resources.
 * The function should return an object (msgpack map) with the following fields:
 * ```
 * {
 * // returns whether the specific resource should be built
 * shouldBuild = func(resourceName: string): bool,
 * // asynchronously start building the specific resource.
 * // call cb when completed
 * build = func(resourceName: string, cb: func(success: bool, status: string): void): void
 * }
 * ```
 * @param factoryId The identifier for the build task.
 * @param factoryFn The factory function.
 */
declare function RegisterResourceBuildTaskFactory(factoryId: string, factoryFn: Function): void;

/**
 * setting the last params to false it does that same so I would suggest its not a toggle
 */
declare function RemoveAllPedWeapons(ped: number, p1: boolean): void;

/**
 * In the C++ SDK, this seems not to work-- the blip isn't removed immediately. I use it for saving cars.
 * E.g.:
 * Ped pped = PLAYER::PLAYER_PED_ID();
 * Vehicle v = PED::GET_VEHICLE_PED_IS_USING(pped);
 * Blip b = UI::ADD_BLIP_FOR_ENTITY(v);
 * works fine.
 * But later attempting to delete it with:
 * Blip b = UI::GET_BLIP_FROM_ENTITY(v);
 * if (UI::DOES_BLIP_EXIST(b)) UI::REMOVE_BLIP(&b);
 * doesn't work. And yes, doesn't work without the DOES_BLIP_EXIST check either. Also, if you attach multiple blips to the same thing (say, a vehicle), and that thing disappears, the blips randomly attach to other things (in my case, a vehicle).
 * Thus for me, UI::REMOVE_BLIP(&b) only works if there's one blip, (in my case) the vehicle is marked as no longer needed, you drive away from it and it eventually despawns, AND there is only one blip attached to it. I never intentionally attach multiple blips but if the user saves the car, this adds a blip. Then if they delete it, it is supposed to remove the blip, but it doesn't. Then they can immediately save it again, causing another blip to re-appear.
 * -------------
 * Passing the address of the variable instead of the value works for me.
 * e.g.
 * int blip = UI::ADD_BLIP_FOR_ENTITY(ped);
 * UI::REMOVE_BLIP(&blip);
 * Remove blip will currently crash your game, just artificially remove the blip by setting the sprite to a id that is 'invisible'.
 * --
 * It crashes my game.
 */
declare function RemoveBlip(blip: number): void;

declare function RemoveWeaponComponentFromPed(ped: number, weaponHash: string | number, componentHash: string | number): void;

/**
 * This native removes a specified weapon from your selected ped.
 * Weapon Hashes: pastebin.com/0wwDZgkF
 * Example:
 * C#:
 * Function.Call(Hash.REMOVE_WEAPON_FROM_PED, Game.Player.Character, 0x99B507EA);
 * C++:
 * WEAPON::REMOVE_WEAPON_FROM_PED(PLAYER::PLAYER_PED_ID(), 0x99B507EA);
 * The code above removes the knife from the player.
 */
declare function RemoveWeaponFromPed(ped: number, weaponHash: string | number): void;

/**
 * Requests the specified player to buy the passed SKU. This'll pop up a prompt on the client, which upon acceptance
 * will open the browser prompting further purchase details.
 * @param playerSrc The player handle
 * @param skuId The ID of the SKU.
 */
declare function RequestPlayerCommerceSession(playerSrc: string, skuId: number): void;

/**
 * Writes the specified data to a file in the specified resource.
 * Using a length of `-1` will automatically detect the length assuming the data is a C string.
 * @param resourceName The name of the resource.
 * @param fileName The name of the file.
 * @param data The data to write to the file.
 * @param dataLength The length of the written data.
 * @return A value indicating if the write succeeded.
 */
declare function SaveResourceFile(resourceName: string, fileName: string, data: string, dataLength: number): number;

/**
 * Schedules the specified resource to run a tick as soon as possible, bypassing the server's fixed tick rate.
 * @param resourceName The resource to tick.
 */
declare function ScheduleResourceTick(resourceName: string): void;

/**
 * <!--
 * _loc1_.map((name, idx) => `| ${idx} | ${name} | ![${name}](https://runtime.fivem.net/blips/${name}.svg) |`).join('\n')
 * -->
 * Sets the displayed sprite for a specific blip.
 * There's a [list of sprites](https://docs.fivem.net/game-references/blips/) on the FiveM documentation site.
 * @param blip The blip to change.
 * @param spriteId The sprite ID to set.
 */
declare function SetBlipSprite(blip: number, spriteId: number): void;

declare function SetConvar(varName: string, value: string): void;

declare function SetConvarReplicated(varName: string, value: string): void;

declare function SetConvarServerInfo(varName: string, value: string): void;

declare function SetCurrentPedWeapon(ped: number, weaponHash: string | number, equipNow: boolean): void;

/**
 * ```
 * p7 is always 1 in the scripts. Set to 1, an area around the destination coords for the moved entity is cleared from other entities.
 * Often ends with 1, 0, 0, 1); in the scripts. It works.
 * Axis - Invert Axis Flags
 * ```
 * Sets an entity's coordinates in world space.
 * @param entity The entity to change coordinates for.
 * @param xPos The x coordinate.
 * @param yPos The y coordinate.
 * @param zPos The z coordinate.
 * @param xAxis Whether to invert x axis.
 * @param yAxis Whether to invert y axis.
 * @param zAxis Whether to invert z axis.
 * @param clearArea Whether to clear other entities in area around entity.
 */
declare function SetEntityCoords(entity: number, xPos: number, yPos: number, zPos: number, xAxis: boolean, yAxis: boolean, zAxis: boolean, clearArea: boolean): void;

/**
 * Set the heading of an entity in degrees also known as "Yaw".
 * @param entity The entity to set the heading for.
 * @param heading The heading in degrees.
 */
declare function SetEntityHeading(entity: number, heading: number): void;

/**
 * rotationOrder refers to the order yaw pitch roll is applied, see [GET_ENTITY_ROTATION](#_0xAFBD61CC738D9EB9)
 * p5 is usually set as true
 */
declare function SetEntityRotation(entity: number, pitch: number, roll: number, yaw: number, rotationOrder: number, p5: boolean): void;

/**
 * Note that the third parameter(denoted as z) is "up and down" with positive ment.
 */
declare function SetEntityVelocity(entity: number, x: number, y: number, z: number): void;

declare function SetGameType(gametypeName: string): void;

declare function SetHttpHandler(handler: Function): void;

declare function SetMapName(mapName: string): void;

/**
 * NativeDB Added Parameter 4: BOOL p3
 */
declare function SetPedAmmo(ped: number, weaponHash: string | number, ammo: number): void;

/**
 * Sets the armor of the specified ped.
 * ped: The Ped to set the armor of.
 * amount: A value between 0 and 100 indicating the value to set the Ped's armor to.
 */
declare function SetPedArmour(ped: number, amount: number): void;

declare function SetPedCanRagdoll(ped: number, toggle: boolean): void;

/**
 * This native is used to set component variation on a ped. Components, drawables and textures IDs are related to the ped model.
 * ### MP Freemode list of components
 * **0**: Face
 * **1**: Mask
 * **2**: Hair
 * **3**: Torso
 * **4**: Leg
 * **5**: Parachute / bag
 * **6**: Shoes
 * **7**: Accessory
 * **8**: Undershirt
 * **9**: Kevlar
 * **10**: Badge
 * **11**: Torso 2
 * ### Related and useful natives
 * [GET_NUMBER_OF_PED_DRAWABLE_VARIATIONS](#_0x27561561732A7842)
 * [GET_NUMBER_OF_PED_TEXTURE_VARIATIONS](#_0x8F7156A3142A6BAD)
 * [List of component/props ID](gtaxscripting.blogspot.com/2016/04/gta-v-peds-component-and-props.html) of player_two with examples
 * @param ped The ped handle.
 * @param componentId The component that you want to set.
 * @param drawableId The drawable id that is going to be set.
 * @param textureId The texture id of the drawable.
 * @param paletteId 0 to 3.
 */
declare function SetPedComponentVariation(ped: number, componentId: number, drawableId: number, textureId: number, paletteId: number): void;

/**
 * Research help : pastebin.com/fPL1cSwB
 * New items added with underscore as first char
 * -----------------------------------------------------------------------
 * enum PedConfigFlags
 * {
 * PED_FLAG_CAN_FLY_THRU_WINDSCREEN = 32,
 * PED_FLAG_DIES_BY_RAGDOLL = 33,
 * _PED_FLAG_PUT_ON_MOTORCYCLE_HELMET = 35,
 * PED_FLAG_NO_COLLISION = 52,
 * _PED_FLAG_IS_SHOOTING = 58,
 * _PED_FLAG_IS_ON_GROUND = 60,
 * PED_FLAG_NO_COLLIDE = 62,
 * PED_FLAG_DEAD = 71,
 * PED_FLAG_IS_SNIPER_SCOPE_ACTIVE = 72,
 * PED_FLAG_SUPER_DEAD = 73,
 * _PED_FLAG_IS_IN_AIR = 76,
 * PED_FLAG_IS_AIMING = 78,
 * PED_FLAG_DRUNK = 100,
 * _PED_FLAG_IS_NOT_RAGDOLL_AND_NOT_PLAYING_ANIM = 104,
 * PED_FLAG_NO_PLAYER_MELEE = 122,
 * PED_FLAG_NM_MESSAGE_466 = 125,
 * PED_FLAG_INJURED_LIMP = 166,
 * PED_FLAG_INJURED_LIMP_2 = 170,
 * _PED_FLAG_DISABLE_SHUFFLING_TO_DRIVER_SEAT = 184,
 * PED_FLAG_INJURED_DOWN = 187,
 * PED_FLAG_SHRINK = 223,
 * PED_FLAG_MELEE_COMBAT = 224,
 * _PED_FLAG_IS_ON_STAIRS = 253,
 * _PED_FLAG_HAS_ONE_LEG_ON_GROUND = 276,
 * PED_FLAG_NO_WRITHE = 281,
 * PED_FLAG_FREEZE = 292,
 * PED_FLAG_IS_STILL = 301,
 * PED_FLAG_NO_PED_MELEE = 314,
 * _PED_SWITCHING_WEAPON = 331,
 * PED_FLAG_ALPHA = 410,
 * _PED_FLAG_DISABLE_STARTING_VEH_ENGINE = 429,
 * };
 * (*) When flagId is set to 33 and the bool value to true, peds will die by starting ragdoll, so you should set this flag to false when you resurrect a ped.
 * When flagId is set to 62 and the boolvalue to false this happens: Ped is taken out of vehicle and can't get back in when jacking their empty vehicle. If in a plane it falls from the sky and crashes. Sometimes peds vehicle continue to drive the route without its driver who's running after.
 * (*)
 * JUMPING CHANGES  60,61,104 TO FALSE
 * BEING ON WATER CHANGES 60,61 TO FALSE AND 65,66,168 TO TRUE
 * FALLING CHANGES 60,61,104,276 TO FALSE AND TO 76 TRUE
 * DYING CHANGES 60,61,104,276* TO FALSE AND (NONE) TO TRUE
 * DYING MAKES 60,61,104 TO FALSE
 * BEING IN A CAR CHANGES 60,79,104 TO FALSE AND 62 TO TRUE
 * (*)Maximum value for flagId is 0x1AA (426) in b944.
 * ID 0xF0 (240) appears to be a special flag which is handled different compared to the others IDs.
 */
declare function SetPedConfigFlag(ped: number, flagId: number, value: boolean): void;

/**
 * Sets Ped Default Clothes
 */
declare function SetPedDefaultComponentVariation(ped: number): void;

/**
 * Used for freemode (online) characters.
 * For some reason, the scripts use a rounded float for the index.
 */
declare function SetPedEyeColor(ped: number, index: number): void;

/**
 * Sets the various freemode face features, e.g. nose length, chin shape. Scale ranges from -1.0 to 1.0.
 * Index can be 0
 * Enum Face_Feature
 * Nose_Width
 * Nose_Peak_Hight
 * Nose_Peak_Lenght
 * Nose_Bone_High
 * Nose_Peak_Lowering
 * Nose_Bone_Twist
 * EyeBrown_High
 * EyeBrown_Forward
 * Cheeks_Bone_High
 * Cheeks_Bone_Width
 * Cheeks_Width
 * Eyes_Openning
 * Lips_Thickness
 * Jaw_Bone_Width 'Bone size to sides
 * Jaw_Bone_Back_Lenght 'Bone size to back
 * Chimp_Bone_Lowering 'Go Down
 * Chimp_Bone_Lenght 'Go forward
 * Chimp_Bone_Width
 * Chimp_Hole
 * Neck_Thikness
 * End Enum
 */
declare function SetPedFaceFeature(ped: number, index: number, scale: number): void;

/**
 * Used for freemode (online) characters.
 */
declare function SetPedHairColor(ped: number, colorID: number, highlightColorID: number): void;

/**
 * The "shape" parameters control the shape of the ped's face. The "skin" parameters control the skin tone. ShapeMix and skinMix control how much the first and second IDs contribute,(typically mother and father.) ThirdMix overrides the others in favor of the third IDs. IsParent is set for "children" of the player character's grandparents during old-gen character creation. It has unknown effect otherwise.
 * The IDs start at zero and go Male Non-DLC, Female Non-DLC, Male DLC, and Female DLC.
 * !!!Can someone add working example for this???
 * try this:
 * headBlendData headData;
 * _GET_PED_HEAD_BLEND_DATA(PLAYER_PED_ID(), &headData);
 * SET_PED_HEAD_BLEND_DATA(PLAYER_PED_ID(), headData.shapeFirst, headData.shapeSecond, headData.shapeThird, headData.skinFirst, headData.skinSecond
 * , headData.skinThird, headData.shapeMix, headData.skinMix, headData.skinThird, 0);
 * For more info please refer to this topic.
 * gtaforums.com/topic/858970-all-gtao-face-ids-pedset-ped-head-blend-data-explained
 */
declare function SetPedHeadBlendData(ped: number, shapeFirstID: number, shapeSecondID: number, shapeThirdID: number, skinFirstID: number, skinSecondID: number, skinThirdID: number, shapeMix: number, skinMix: number, thirdMix: number, isParent: boolean): void;

/**
 * OverlayID ranges from 0 to 12, index from 0 to _GET_NUM_OVERLAY_VALUES(overlayID)-1, and opacity from 0.0 to 1.0.
 * overlayID       Part                  Index, to disable
 * 0               Blemishes             0 - 23, 255
 * 1               Facial Hair           0 - 28, 255
 * 2               Eyebrows              0 - 33, 255
 * 3               Ageing                0 - 14, 255
 * 4               Makeup                0 - 74, 255
 * 5               Blush                 0 - 6, 255
 * 6               Complexion            0 - 11, 255
 * 7               Sun Damage            0 - 10, 255
 * 8               Lipstick              0 - 9, 255
 * 9               Moles/Freckles        0 - 17, 255
 * 10              Chest Hair            0 - 16, 255
 * 11              Body Blemishes        0 - 11, 255
 * 12              Add Body Blemishes    0 - 1, 255
 */
declare function SetPedHeadOverlay(ped: number, overlayID: number, index: number, opacity: number): void;

/**
 * Used for freemode (online) characters.
 * ColorType is 1 for eyebrows, beards, and chest hair; 2 for blush and lipstick; and 0 otherwise, though not called in those cases.
 * Called after SET_PED_HEAD_OVERLAY().
 */
declare function SetPedHeadOverlayColor(ped: number, overlayID: number, colorType: number, colorID: number, secondColorID: number): void;

/**
 * Ped: The ped to warp.
 * vehicle: The vehicle to warp the ped into.
 * Seat_Index: [-1 is driver seat, -2 first free passenger seat]
 * Moreinfo of Seat Index
 * DriverSeat = -1
 * Passenger = 0
 * Left Rear = 1
 * RightRear = 2
 */
declare function SetPedIntoVehicle(ped: number, vehicle: number, seatIndex: number): void;

/**
 * This native is used to set prop variation on a ped. Components, drawables and textures IDs are related to the ped model.
 * ### MP Freemode list of props
 * **0**: Hat
 * **1**: Glass
 * **2**: Ear
 * **6**: Watch
 * **7**: Bracelet
 * ### Related and useful natives
 * [GET_NUMBER_OF_PED_PROP_DRAWABLE_VARIATIONS](#_0x5FAF9754E789FB47)
 * [GET_NUMBER_OF_PED_PROP_TEXTURE_VARIATIONS](#_0xA6E7F1CEB523E171)
 * [List of component/props ID](gtaxscripting.blogspot.com/2016/04/gta-v-peds-component-and-props.html) of player_two with examples
 * @param ped The ped handle.
 * @param componentId The component that you want to set.
 * @param drawableId The drawable id that is going to be set.
 * @param textureId The texture id of the drawable.
 * @param attach Attached or not.
 */
declare function SetPedPropIndex(ped: number, componentId: number, drawableId: number, textureId: number, attach: boolean): void;

/**
 * p1 is always false in R* scripts; and a quick disassembly seems to indicate that p1 is unused.
 * List of component/props ID:
 * gtaxscripting.blogspot.com/2016/04/gta-v-peds-component-and-props.html
 * ```
 * ```
 * NativeDB Parameter 1: int p1
 */
declare function SetPedRandomComponentVariation(ped: number, p1: boolean): void;

/**
 * List of component/props ID
 * gtaxscripting.blogspot.com/2016/04/gta-v-peds-component-and-props.html
 */
declare function SetPedRandomProps(ped: number): void;

/**
 * **Known values**
 * `PRF_PreventGoingIntoStillInVehicleState` = 236 _(fanatic2.c)_
 */
declare function SetPedResetFlag(ped: number, flagId: number, doReset: boolean): void;

/**
 * p4/p5: Unusued in TU27
 * ### Ragdoll Types
 * **0**: CTaskNMRelax
 * **1**: CTaskNMScriptControl: Hardcoded not to work in networked environments.
 * **Else**: CTaskNMBalance
 * @param time1 Time(ms) Ped is in ragdoll mode; only applies to ragdoll types 0 and not 1.
 * @param p4 :
 * @param p5 :
 */
declare function SetPedToRagdoll(ped: number, time1: number, time2: number, ragdollType: number, p4: boolean, p5: boolean, p6: boolean): void;

/**
 * Return variable is never used in R*'s scripts.
 * Not sure what p2 does. It seems like it would be a time judging by it's usage in R*'s scripts, but didn't seem to affect anything in my testings.
 * x, y, and z are coordinates, most likely to where the ped will fall.
 * p7 is probably the force of the fall, but untested, so I left the variable name the same.
 * p8 to p13 are always 0f in R*'s scripts.
 * (Simplified) Example of the usage of the function from R*'s scripts:
 * ped::set_ped_to_ragdoll_with_fall(ped, 1500, 2000, 1, -entity::get_entity_forward_vector(ped), 1f, 0f, 0f, 0f, 0f, 0f, 0f);
 */
declare function SetPedToRagdollWithFall(ped: number, time: number, p2: number, ragdollType: number, x: number, y: number, z: number, p7: number, p8: number, p9: number, p10: number, p11: number, p12: number, p13: number): void;

/**
 * Flags used in the scripts: 0,4,16,24,32,56,60,64,128,134,256,260,384,512,640,768,896,900,952,1024,1280,2048,2560
 * Note to people who needs this with camera mods, etc.:
 * Flags(0, 4, 16, 24, 32, 56, 60, 64, 128, 134, 512, 640, 1024, 2048, 2560)
 * - Disables camera rotation as well.
 * Flags(256, 260, 384, 768, 896, 900, 952, 1280)
 * cameraRotation = flags & (1 << 8)
 */
declare function SetPlayerControl(player: number, bHasControl: boolean, flags: number): void;

/**
 * Simply sets you as invincible (Health will not deplete).
 * Use 0x733A643B5B0C53C1 instead if you want Ragdoll enabled, which is equal to:
 * *(DWORD *)(playerPedAddress + 0x188) |= (1 << 9);
 */
declare function SetPlayerInvincible(player: number, toggle: boolean): void;

/**
 * Set the model for a specific Player. Be aware that this will destroy the current Ped for the Player and create a new one, any
 * reference to the old ped should be reset (by using the GetPlayerPed native).
 * ```
 * Make sure to request the model first and wait until it has loaded.
 * ```
 */
declare function SetPlayerModel(player: number, model: string | number): void;

/**
 * Call SET_PLAYER_WANTED_LEVEL_NOW for immediate effect
 * wantedLevel is an integer value representing 0 to 5 stars even though the game supports the 6th wanted level but no police will appear since no definitions are present for it in the game files
 * disableNoMission-  Disables When Off Mission- appears to always be false
 */
declare function SetPlayerWantedLevel(player: number, wantedLevel: number, disableNoMission: boolean): void;

declare function SetResourceKvp(key: string, value: string): void;

declare function SetResourceKvpFloat(key: string, value: number): void;

declare function SetResourceKvpInt(key: string, value: number): void;

declare function SetVehicleAlarm(vehicle: number, state: boolean): void;

/**
 * p2 often set to 1000.0 in the decompiled scripts.
 */
declare function SetVehicleBodyHealth(vehicle: number, value: number): void;

/**
 * Sets the selected vehicle's colors to their default value (specific variant specified using the colorCombination parameter).
 * Range of possible values for colorCombination is currently unknown, I couldn't find where these values are stored either (Disquse's guess was vehicles.meta but I haven't seen it in there.)
 * @param vehicle The vehicle to modify.
 * @param colorCombination One of the default color values of the vehicle.
 */
declare function SetVehicleColourCombination(vehicle: number, colorCombination: number): void;

/**
 * colorPrimary & colorSecondary are the paint index for the vehicle.
 * For a list of valid paint indexes, view: pastebin.com/pwHci0xK
 * -------------------------------------------------------------------------
 * Use this to get the number of color indices: pastebin.com/RQEeqTSM
 * Note: minimum color index is 0, maximum color index is (numColorIndices - 1)
 */
declare function SetVehicleColours(vehicle: number, colorPrimary: number, colorSecondary: number): void;

/**
 * p1, p2, p3 are RGB values for color (255,0,0 for Red, ect)
 */
declare function SetVehicleCustomPrimaryColour(vehicle: number, r: number, g: number, b: number): void;

/**
 * p1, p2, p3 are RGB values for color (255,0,0 for Red, ect)
 */
declare function SetVehicleCustomSecondaryColour(vehicle: number, r: number, g: number, b: number): void;

/**
 * You can't use values greater than 15.0
 * You can see why here: pastebin.com/Wbn34fGD
 * Also, R* does (float)(rand() % 15) to get a random dirt level when generating a vehicle.
 */
declare function SetVehicleDirtLevel(vehicle: number, dirtLevel: number): void;

/**
 * doorIndex:
 * 0 = Front Right Door
 * 1 = Front Left Door
 * 2 = Back Right Door
 * 3 = Back Left Door
 * 4 = Hood
 * 5 = Trunk
 * Changed last paramater from CreateDoorObject To NoDoorOnTheFloor because when on false, the door object is created,and not created when on true...the former parameter name was counter intuitive...(by Calderon)
 */
declare function SetVehicleDoorBroken(vehicle: number, doorIndex: number, deleteDoor: boolean): void;

/**
 * 1
 * 2 - CARLOCK_LOCKED (locked)
 * 3
 * 4 - CARLOCK_LOCKED_PLAYER_INSIDE (can get in, can't leave)
 * (maybe, these are leftovers from GTA:VC)
 * 5
 * 6
 * 7
 * (source: GTA VC miss2 leak, matching constants for 0/2/4, testing)
 * They use 10 in am_mp_property_int, don't know what it does atm.
 */
declare function SetVehicleDoorsLocked(vehicle: number, doorLockStatus: number): void;

/**
 * Sets a vehicle's license plate text.  8 chars maximum.
 * Example:
 * Ped playerPed = PLAYER::PLAYER_PED_ID();
 * Vehicle veh = PED::GET_VEHICLE_PED_IS_USING(playerPed);
 * char *plateText = "KING";
 * VEHICLE::SET_VEHICLE_NUMBER_PLATE_TEXT(veh, plateText);
 */
declare function SetVehicleNumberPlateText(vehicle: number, plateText: string): void;

declare function StartFindKvp(prefix: string): number;

declare function StartResource(resourceName: string): number;

declare function StopResource(resourceName: string): number;

/**
 * Makes the specified ped attack the target ped.
 * p2 should be 0
 * p3 should be 16
 */
declare function TaskCombatPed(ped: number, targetPed: number, p2: number, p3: number): void;

/**
 * Example:
 * AI::TASK_DRIVE_BY(l_467[1 -- [[22]] ], PLAYER::PLAYER_PED_ID(), 0, 0.0, 0.0, 2.0, 300.0, 100, 0, ${firing_pattern_burst_fire_driveby});
 * Needs working example. Doesn't seem to do anything.
 * I marked p2 as targetVehicle as all these shooting related tasks seem to have that in common.
 * I marked p6 as distanceToShoot as if you think of GTA's Logic with the native SET_VEHICLE_SHOOT natives, it won't shoot till it gets within a certain distance of the target.
 * I marked p7 as pedAccuracy as it seems it's mostly 100 (Completely Accurate), 75, 90, etc. Although this could be the ammo count within the gun, but I highly doubt it. I will change this comment once I find out if it's ammo count or not.
 */
declare function TaskDriveBy(driverPed: number, targetPed: number, targetVehicle: number, targetX: number, targetY: number, targetZ: number, distanceToShoot: number, pedAccuracy: number, p8: boolean, firingPattern: string | number): void;

/**
 * speed 1.0 = walk, 2.0 = run
 * p5 1 = normal, 3 = teleport to vehicle, 16 = teleport directly into vehicle
 * p6 is always 0
 * Usage of seat
 * -1 = driver
 * 0 = passenger
 * 1 = left back seat
 * 2 = right back seat
 * 3 = outside left
 * 4 = outside right
 */
declare function TaskEnterVehicle(ped: number, vehicle: number, timeout: number, seat: number, speed: number, flag: number, p6: number): void;

declare function TaskEveryoneLeaveVehicle(vehicle: number): void;

/**
 * This native will make the ped move straight to a coordinate.
 * @param ped The ped handle.
 * @param x The x coordinate.
 * @param y The y coordinate.
 * @param z The z coordinate.
 * @param speed The ped movement speed.
 * @param timeout \-1 , other values appear to break the ped movement.
 * @param targetHeading The heading you want the ped to be on x,y,z coord.
 * @param distanceToSlide The distance from x,y,z where the ped will start sliding.
 */
declare function TaskGoStraightToCoord(ped: number, x: number, y: number, z: number, speed: number, timeout: number, targetHeading: number, distanceToSlide: number): void;

/**
 * example from fm_mission_controller
 * AI::TASK_GO_TO_COORD_ANY_MEANS(l_649, sub_f7e86(-1, 0), 1.0, 0, 0, 786603, 0xbf800000);
 */
declare function TaskGoToCoordAnyMeans(ped: number, x: number, y: number, z: number, speed: number, p5: number, p6: boolean, walkingStyle: number, p8: number): void;

/**
 * The entity will move towards the target until time is over (duration) or get in target's range (distance). p5 and p6 are unknown, but you could leave p5 = 1073741824 or 100 or even 0 (didn't see any difference but on the decompiled scripts, they use 1073741824 mostly) and p6 = 0
 * Note: I've only tested it on entity -> ped and target -> vehicle. It could work differently on other entities, didn't try it yet.
 * Example: AI::TASK_GO_TO_ENTITY(pedHandle, vehicleHandle, 5000, 4.0, 100, 1073741824, 0)
 * Ped will run towards the vehicle for 5 seconds and stop when time is over or when he gets 4 meters(?) around the vehicle (with duration = -1, the task duration will be ignored).
 */
declare function TaskGoToEntity(entity: number, target: number, duration: number, distance: number, speed: number, p5: number, p6: number): void;

/**
 * In the scripts, p3 was always -1.
 * p3 seems to be duration or timeout of turn animation.
 * Also facingPed can be 0 or -1 so ped will just raise hands up.
 */
declare function TaskHandsUp(ped: number, duration: number, facingPed: number, p3: number, p4: boolean): void;

declare function TaskLeaveAnyVehicle(ped: number, p1: number, p2: number): void;

/**
 * Flags from decompiled scripts:
 * 0 = normal exit and closes door.
 * 1 = normal exit and closes door.
 * 16 = teleports outside, door kept closed.
 * 64 = normal exit and closes door, maybe a bit slower animation than 0.
 * 256 = normal exit but does not close the door.
 * 4160 = ped is throwing himself out, even when the vehicle is still.
 * 262144 = ped moves to passenger seat first, then exits normally
 * Others to be tried out: 320, 512, 131072.
 */
declare function TaskLeaveVehicle(ped: number, vehicle: number, flags: number): void;

/**
 * [Animations list](https://alexguirre.github.io/animations-list/)
 * ```
 * float blendInSpeed > normal speed is 8.0f
 * ----------------------
 * float blendOutSpeed > normal speed is 8.0f
 * ----------------------
 * int duration: time in millisecond
 * ----------------------
 * -1 _ _ _ _ _ _ _> Default (see flag)
 * 0 _ _ _ _ _ _ _ > Not play at all
 * Small value _ _ > Slow down animation speed
 * Other _ _ _ _ _ > freeze player control until specific time (ms) has
 * _ _ _ _ _ _ _ _ _ passed. (No effect if flag is set to be
 * _ _ _ _ _ _ _ _ _ controllable.)
 * int flag:
 * ----------------------
 * enum eAnimationFlags
 * {
 * ANIM_FLAG_NORMAL = 0,
 * ANIM_FLAG_REPEAT = 1,
 * ANIM_FLAG_STOP_LAST_FRAME = 2,
 * ANIM_FLAG_UPPERBODY = 16,
 * ANIM_FLAG_ENABLE_PLAYER_CONTROL = 32,
 * ANIM_FLAG_CANCELABLE = 120,
 * };
 * Odd number : loop infinitely
 * Even number : Freeze at last frame
 * Multiple of 4: Freeze at last frame but controllable
 * 01 to 15 > Full body
 * 10 to 31 > Upper body
 * 32 to 47 > Full body > Controllable
 * 48 to 63 > Upper body > Controllable
 * ...
 * 001 to 255 > Normal
 * 256 to 511 > Garbled
 * ...
 * playbackRate:
 * values are between 0.0 and 1.0
 * lockX:
 * 0 in most cases 1 for rcmepsilonism8 and rcmpaparazzo_3
 * > 1 for mini@sprunk
 * lockY:
 * 0 in most cases
 * 1 for missfam5_yoga, missfra1mcs_2_crew_react
 * lockZ:
 * 0 for single player
 * Can be 1 but only for MP
 * ```
 */
declare function TaskPlayAnim(ped: number, animDictionary: string, animationName: string, blendInSpeed: number, blendOutSpeed: number, duration: number, flag: number, playbackRate: number, lockX: boolean, lockY: boolean, lockZ: boolean): void;

/**
 * It's similar to the one above, except the first 6 floats let you specify the initial position and rotation of the task. (Ped gets teleported to the position).
 * [Animations list](https://alexguirre.github.io/animations-list/)
 * @param ped The target ped
 * @param animDict Name of the animation dictionary
 * @param animName Name of the animation
 * @param posX Initial X position of the task
 * @param posY Initial Y position of the task
 * @param posZ Initial Z position of the task
 * @param rotX Initial X rotation of the task, doesn't seem to have any effect
 * @param rotY Initial Y rotation of the task, doesn't seem to have any effect
 * @param rotZ Initial Z rotation of the task
 * @param animEnterSpeed Adjust character speed to fully enter animation
 * @param animExitSpeed Adjust character speed to fully exit animation (useless `ClearPedTasksImmediately()` is called)
 * @param duration Time in milliseconds
 * @param animTime Value between 0.0 and 1.0, lets you start an animation from the given point
 */
declare function TaskPlayAnimAdvanced(ped: number, animDict: string, animName: string, posX: number, posY: number, posZ: number, rotX: number, rotY: number, rotZ: number, animEnterSpeed: number, animExitSpeed: number, duration: number, flag: number, animTime: number, p14: number, p15: number): void;

declare function TaskReactAndFleePed(ped: number, fleeTarget: number): void;

declare function TaskShootAtCoord(ped: number, x: number, y: number, z: number, duration: number, firingPattern: string | number): void;

/**
 * //this part of the code is to determine at which entity the player is aiming, for example if you want to create a mod where you give orders to peds
 * Entity aimedentity;
 * Player player = PLAYER::PLAYER_ID();
 * PLAYER::_GET_AIMED_ENTITY(player, &aimedentity);
 * //bg is an array of peds
 * AI::TASK_SHOOT_AT_ENTITY(bg[i], aimedentity, 5000, GAMEPLAY::GET_HASH_KEY("FIRING_PATTERN_FULL_AUTO"));
 * in practical usage, getting the entity the player is aiming at and then task the peds to shoot at the entity, at a button press event would be better.
 */
declare function TaskShootAtEntity(entity: number, target: number, duration: number, firingPattern: string | number): void;

/**
 * Seat Numbers
 * -------------------------------
 * Driver = -1
 * Any = -2
 * Left-Rear = 1
 * Right-Front = 0
 * Right-Rear = 2
 * Extra seats = 3-14(This may differ from vehicle type e.g. Firetruck Rear Stand, Ambulance Rear)
 */
declare function TaskWarpPedIntoVehicle(ped: number, vehicle: number, seat: number): void;

declare function TempBanPlayer(playerSrc: string, reason: string): void;

/**
 * The backing function for TriggerClientEvent.
 */
declare function TriggerClientEventInternal(eventName: string, eventTarget: string, eventPayload: string, payloadLength: number): void;

/**
 * The backing function for TriggerEvent.
 */
declare function TriggerEventInternal(eventName: string, eventPayload: string, payloadLength: number): void;

/**
 * The backing function for TriggerLatentClientEvent.
 */
declare function TriggerLatentClientEventInternal(eventName: string, eventTarget: string, eventPayload: string, payloadLength: number, bps: number): void;

declare function VerifyPasswordHash(password: string, hash: string): number;

/**
 * Returns whether or not the currently executing event was canceled.
 * @return A boolean.
 */
declare function WasEventCanceled(): number;

