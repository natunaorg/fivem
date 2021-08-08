new (class Menu {
    constructor() {
        this.currentMenuIndex = 1;
        // $(".menu").hide();

        window.on("raflymln-menu:nui:setMenu", this.openMenu);
        $(document).keyup((e) => {
            this.handleArrowKeys(e);
            this.handleFunctionKeys(e);
        });
    }

    openMenu = (data) => {
        $(".menu").show();
        setMenu(data.menuList);
    };

    setMenu = (menuList) => {
        const container = $(".menu .menu-box-outer .menu-box-inner .menu-list");

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
        $(".menu").hide();

        switch (e.key) {
            case "Enter":
                window.sendData("raflymln-menu:client:getMenuIndex", { index: this.currentMenuIndex });
                break;

            case "Escape":
                window.sendData("raflymln-menu:client:closeMenu");
                break;
        }
    };

    handleArrowKeys = (e) => {
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
    };
})();
