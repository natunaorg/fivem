new (class {
    constructor() {
        const closeMenu = this.closeMenu;

        this.document = $(document);
        this.crosshair = $("#entitymenu-crosshair");
        this.menu = $(`#entitymenu-menu`);

        window.on("raflymln-entitymenu:nui:toggleCrosshair", (data) => this.toggleCrosshair(data.toggle));
        window.on("raflymln-entitymenu:nui:openMenu", async (data) => await this.openMenu(data.menu));
        window.on("raflymln-entitymenu:nui:closeMenu", this.closeMenu);

        this.document.keyup((e) => (e.key === "Escape" ? closeMenu() : false));
        this.crosshair.on("click", closeMenu);
        this.menu.on("click", "li", function () {
            const value = $(this).attr("value");
            return closeMenu(this, value);
        });
    }

    toggleCrosshair = (isActive) => {
        return isActive ? this.crosshair.addClass("fadeIn") : this.crosshair.removeClass("fadeIn");
    };

    openMenu = async (menu) => {
        this.crosshair.addClass("active");
        this.menu.empty().addClass("fadeIn");

        for (const key in menu) {
            const action = menu[key];

            this.menu.append(`
                <li value="${key}">
                    <a>
                        <span class="emoji">${action.emoji}</span>
                        ${action.text}
                    </a>
                </li>
            `);

            // await new Promise((res) => setTimeout(res, 100));
        }

        return true;
    };

    closeMenu = (event, data = false) => {
        if (event && event.preventDefault) event.preventDefault();

        this.crosshair.removeClass("fadeIn").removeClass("active");
        this.menu.removeClass("fadeIn");

        return window.sendData("raflymln-entitymenu:client:closeMenuFocus", { data });
    };
})();
