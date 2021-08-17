new (class {
    constructor() {
        this.menu = $("#menu");
        this.currentMenuIndex = 1;
        this.currentMenuList = [];

        this.menu.hide();

        window.on("raflymln-menu:nui:setMenu", this.openMenu);
        window.on("raflymln-menu:nui:closeMenu", this.openMenu);

        $(document).keyup((e) => {
            this.handleArrowKeys(e);
            this.handleFunctionKeys(e);
        });
    }

    openMenu = (data) => {
        this.currentMenuList = data.menuList;

        this.menu.show();
        this.setMenu();
    };

    closeMenu = () => {
        this.currentMenuList = [];
        this.menu.hide();
        window.sendData("raflymln-menu:client:closeMenu");
    };

    setMenu = () => {
        const menuList = this.currentMenuList;
        if (!menuList || menuList.length === 0) return;

        const container = $(`#menu .menu-box-outer .menu-box-inner .menu-list`);

        container.empty();
        this.currentMenuIndex = 1;

        for (let index in menuList) {
            index = parseInt(index);

            const menu = menuList[index];
            const isActive = index === 0 ? "active" : "";

            container.append(`
                <div class="menu-block ${isActive}" id="menu-${index + 1}">
                    <span class="icon">${menu.icon}</span>
                    <div class="text">
                        <h3 class="title">${menu.title}</h3>
                        ${menu.subtitle ? `<p class='subtitle'>${menu.subtitle}</p>` : ""}
                    </div>
                </div>
            `);
        }
    };

    handleFunctionKeys = (e) => {
        if (e.key === "Enter" || e.key === "Escape") {
            switch (e.key) {
                case "Enter":
                    window.sendData("raflymln-menu:client:getMenuIndex", { index: this.currentMenuIndex });
                    break;

                case "Escape":
                    this.closeMenu();
                    break;
            }
        }
    };

    handleArrowKeys = (e) => {
        const menuList = this.currentMenuList;
        if (!menuList || menuList.length === 0) return;

        if (e.key === "ArrowDown" || e.key === "ArrowUp") {
            // Old ID
            $(`#menu-${this.currentMenuIndex}`).toggleClass("active");

            // Change ID
            switch (e.key) {
                case "ArrowDown":
                    this.currentMenuIndex += 1;

                    if (this.currentMenuIndex > menuList.length) {
                        this.currentMenuIndex = 1;
                    }

                    break;

                case "ArrowUp":
                    this.currentMenuIndex -= 1;

                    if (this.currentMenuIndex < 1) {
                        this.currentMenuIndex = menuList.length;
                    }

                    break;
            }

            // New ID
            $(`#menu-${this.currentMenuIndex}`).toggleClass("active");
            document.getElementById(`menu-${this.currentMenuIndex}`).scrollIntoView(false);
        }
    };
})();
