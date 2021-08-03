class NUILoader {
    constructor(pluginName) {
        $.get(`../../../plugins/${pluginName}/ui/index.html`, (data) => {
            const [html, zIndex] = this.DOMParser(pluginName, data);
            $("body").append(`<div id="${pluginName}" class="nui-wrapper" style="z-index: ${parseInt(zIndex)}">${html}</div>`);
        });
    }

    DOMParser = (pluginName, html) => {
        const zIndex = $(`${html} meta[name='ui:z-index']`).attr("content") || 1;

        for (const attr of ["href", "src"]) {
            $(`${html} [${attr}]`).each(function () {
                const currAttr = $(this).attr(attr);
                if (!currAttr || typeof currAttr == "undefined" || currAttr == "") return;

                for (const prefix of ["@", "."]) {
                    if (currAttr.startsWith(`${prefix}/`)) {
                        const newAttr = currAttr.replace(prefix, `../../../plugins/${pluginName}/ui`);
                        html = html.replace(currAttr, newAttr);
                    }
                }
            });
        }

        return [html, zIndex];
    };
}

window.addEventListener("message", (event) => {
    if (typeof event.data.name !== "undefined") {
        return window.emit(event.data.name, event.data.data);
    }
});

window.on("natuna:nui:retrievePluginList", (data) => {
    return new NUILoader(data.name);
});
