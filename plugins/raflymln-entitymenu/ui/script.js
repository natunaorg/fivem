$(() => new EntityMenu());

class EntityMenu {
    constructor() {
        this.crosshair = $("#entitymenu-crosshair");

        window.on("raflymln-entitymenu:nui:openMenu", async (data) => await this.openMenu(data.menuList));
        window.on("raflymln-entitymenu:nui:closeMenu", this.closeMenu);
        window.on("raflymln-entitymenu:nui:toggleCrosshair", (data) => this.toggleCrosshair(data.toggle));

        $(document).keyup((e) => (e.key === "Escape" ? this.closeMenu() : false));
        $("#entitymenu-menu li a").on("click", this.closeMenu);
        this.crosshair.on("click", this.closeMenu);
    }

    toggleCrosshair = (isActive) => {
        return isActive ? this.crosshair.addClass("fadeIn") : this.crosshair.removeClass("fadeIn");
    };

    openMenu = async (menuList) => {
        this.crosshair.addClass("active");

        $(`#nui\\:raflymln-entitymenu menu`).empty().addClass("fadeIn");

        for (const action of menuList) {
            $(`#nui\\:raflymln-entitymenu menu`).append(`
                <li>
                    <a class="action-${action.value}" value="${action.value}">
                        <span class="emoji">${action.emoji}</span>
                        ${action.text}
                    </a>
                </li>
            `);

            await new Promise((res) => setTimeout(res, 100));
        }
    };

    closeMenu = (event) => {
        if (event && event.preventDefault) event.preventDefault();

        this.crosshair.removeClass("fadeIn").removeClass("active");
        $("#entitymenu-menu").removeClass("fadeIn");

        return window.sendData("raflymln-entitymenu:client:closeMenuFocus");
    };
}
