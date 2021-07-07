class Utils {
    client: KoiClientInterface;

    constructor(client: any) {
        this.client = client;
    }

    drawText3D = (text: string, x: number, y: number, z: number, r: number, g: number, b: number) => {
        SetDrawOrigin(x, y, z, 0);
        SetTextFont(0);
        SetTextProportional(false);
        SetTextScale(0.0, 0.2);
        SetTextColour(r, g, b, 255);
        SetTextDropshadow(0, 0, 0, 0, 255);
        SetTextEdge(2, 0, 0, 0, 150);
        SetTextDropShadow();
        SetTextOutline();
        SetTextEntry("STRING");
        SetTextCentre(true);
        AddTextComponentString(text);
        DrawText(0.0, 0.0);
        ClearDrawOrigin();
        return true;
    };

    drawText = (text: string, x: number, y: number) => {
        SetTextFont(1);
        SetTextProportional(true);
        SetTextScale(0.0, 0.6);
        SetTextDropshadow(1, 0, 0, 0, 255);
        SetTextEdge(1, 0, 0, 0, 255);
        SetTextDropShadow();
        SetTextOutline();
        SetTextEntry("STRING");
        AddTextComponentString(text);
        DrawText(x, y);
        return true;
    };

    notify = (...text) => {
        SetNotificationTextEntry("STRING");
        AddTextComponentString(text.join(" "));
        DrawNotification(false, false);
        return true;
    };
}

export default Utils;
