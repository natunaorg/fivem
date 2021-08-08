class NUILoader {
    constructor(pluginName) {
        $.get(`../../../plugins/${pluginName}/ui/index.html`, (html) => {
            const CSSParser = this.CSSParser;
            const nuiWrapperId = `nui\\:${pluginName}`;

            /**
             * Append the Parsed HTML
             */
            $("body").prepend(`<section id="${nuiWrapperId}" class="nui-wrapper">${this.DOMParser(pluginName, html)}</section>`);

            /**
             * Set the Z-Index of the NUI
             */
            const zIndex = $(`#${nuiWrapperId} meta[name="nuiIndex"]`).attr("content") || 1;
            $(`#${nuiWrapperId}`).css("z-index", parseInt(zIndex));

            /**
             * Parse the CSS file
             * [IMPORTANT] CSSParser must be declared from outer the function
             */
            $(`#${nuiWrapperId} [href]`).each(function () {
                const attr = $(this).attr("href");

                if (attr.endsWith(".css")) {
                    $.get(attr, (css) => CSSParser(pluginName, css, nuiWrapperId));
                    $(this).remove();
                }
            });
        });
    }

    // https://stackoverflow.com/questions/7379168/load-an-external-css-for-a-specific-div/18252363#18252363
    renderCSSForSelector = (css, selector) => {
        return (css + "" || "")
            .replace(/\n|\t/g, " ")
            .replace(/\s+/g, " ")
            .replace(/\s*\/\*.*?\*\/\s*/g, " ")
            .replace(/(^|\})(.*?)(\{)/g, function ($0, $1, $2, $3) {
                var collector = [],
                    parts = $2.split(",");
                for (var i in parts) {
                    collector.push(selector + " " + parts[i].replace(/^\s*|\s*$/, ""));
                }
                return $1 + " " + collector.join(", ") + " " + $3;
            })
            .replace(/body/, "");
    };

    CSSParser = (pluginName, css, selector) => {
        let regexMatched;
        const regex = /url\(("|'|`|)(.*?)("|'|`|)(\))/gm;

        while ((regexMatched = regex.exec(css)) !== null) {
            // This is necessary to avoid infinite loops with zero-width matches
            if (regexMatched.index === regex.lastIndex) {
                regex.lastIndex++;
            }

            for (const url of regexMatched) {
                for (const prefix of [".", "@"]) {
                    if (url.startsWith(`${prefix}/`)) {
                        const newUrl = url.replace(prefix, `../../../plugins/${pluginName}/ui`);
                        css = css.replace(url, newUrl);
                    }
                }
            }
        }

        $(`#${selector}`).append(`<style>${this.renderCSSForSelector(css, `#${selector}`)}</style>`);
    };

    DOMParser = (pluginName, html) => {
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

        return html;
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
