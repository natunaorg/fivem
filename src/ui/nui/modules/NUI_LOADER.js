let JQueryReady = false;
$(() => (JQueryReady = true));

class NUILoader {
    constructor(pluginName) {
        this.pluginName = pluginName;
        this.nuiWrapperId = `natuna-nui\\:${this.pluginName}`;

        const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

        new Promise(async (resolve, reject) => {
            while (!JQueryReady) await wait(100);

            const html = await this.utils.getContent(`../../../plugins/${this.pluginName}/ui/index.html`);
            const parsedHTML = await this.HTMLParser(html);

            // Append the Parsed HTML
            $("body").prepend(`<section id="${this.nuiWrapperId.replace("\\", "")}" class="nui-wrapper">${parsedHTML}</section>`);

            // Set the Z-Index of the NUI
            const zIndex = $(`#${this.nuiWrapperId} meta[name="nuiIndex"]`).attr("content") || 1;
            $(`#${this.nuiWrapperId}`).css("z-index", parseInt(zIndex));
            return resolve(true);
        });
    }

    CSSParser = (content) => {
        const regex = /url\(("|'|`|)(.*?)("|'|`|)(\))/gm;
        const regexMatched = this.utils.getMatchedRegex(regex, content);

        for (const match of regexMatched) {
            if (match.startsWith(`./`)) {
                const newAttribute = match.replace(".", `../../../plugins/${this.pluginName}/ui`);
                content = content.replace(match, newAttribute);
            }
        }

        content = this.utils.renderCSSWithSelector(content, `#${this.nuiWrapperId}`);

        return content;
    };

    JSParser = (content) => {
        // $("") && document.querySelector()
        const regex1 = /(\$|querySelector)\(("|'|`)(.*?)("|'|`)\)/gm;
        const regexMatched1 = this.utils.getMatchedRegex(regex1, content);

        for (const match of regexMatched1) {
            if (match.startsWith(`#`)) {
                const newAttribute = match.replace("#", `#${this.pluginName}-`);
                content = content.replace(match, newAttribute);
            }
        }

        // document.getElementById()
        const regex2 = /(getElementById)\(("|'|`)(.*?)("|'|`)\)/gm;
        const regexMatched2 = this.utils.getMatchedRegex(regex2, content);

        for (const match of regexMatched2) {
            if (!match.startsWith(`getElementById`) && !match.match("(\"|'|`)")) {
                const string = match.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
                const regex = new RegExp(`getElementById\\(("|'|\`)${string}("|'|\`)\\)`, "gm");
                const newId = `${this.pluginName}-${match}`;

                content = content.replace(regex, `getElementById(\`${newId}\`)`);
            }
        }

        return content;
    };

    HTMLParser = async (content) => {
        // Find 'src' and 'href' attributes
        const regex1 = /(src|href)=("|'|`)(.*?)("|'|`)/gm;
        const regexMatched1 = this.utils.getMatchedRegex(regex1, content);

        for (const match of regexMatched1) {
            if (match.startsWith(`./`)) {
                let file;
                const newUrl = match.replace(".", `../../../plugins/${this.pluginName}/ui`);

                if (match.endsWith(".js") || match.endsWith(".css")) {
                    file = await this.utils.getContent(newUrl);
                    content = content.replace(match, "//:0");
                }

                if (match.endsWith(".js")) {
                    content += "<script>" + this.JSParser(file) + "</script>";
                } else if (match.endsWith(".css")) {
                    content += "<style>" + this.CSSParser(file) + "</style>";
                } else {
                    content = content.replace(match, newUrl);
                }
            }
        }

        // Find 'id' attributes
        const regex2 = /id=("|'|`)(.*?)("|'|`)/gm;
        const regexMatched2 = this.utils.getMatchedRegex(regex2, content);

        for (const match of regexMatched2) {
            if (!match.startsWith(`id=`) && !match.match("(\"|'|`)")) {
                const string = match.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
                const regex = new RegExp(`id=("|'|\`)${string}("|'|\`)`, "gm");
                const newId = `${this.pluginName}-${match}`;

                content = content.replace(regex, `id="${newId}"`);
            }
        }

        return content;
    };

    utils = {
        getContent: (url) => {
            return new Promise((resolve, reject) => {
                $.ajax(url, {
                    dataType: "text",
                    success: function (response) {
                        // Do something with the response
                        resolve(response);
                    },
                });
            });
        },
        getMatchedRegex: (regex, content) => {
            let regexMatched;
            let returnMatch = [];

            while ((regexMatched = regex.exec(content)) !== null) {
                // This is necessary to avoid infinite loops with zero-width matches
                if (regexMatched.index === regex.lastIndex) {
                    regex.lastIndex++;
                }

                for (const match of regexMatched) {
                    returnMatch.push(match);
                }
            }

            return returnMatch;
        },
        renderCSSWithSelector: (css, selector) => {
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
                .replace(/(body|html)/, "");
        },
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

window.on("natuna:nui:debugHTML", () => {
    const text = $("html").html();
    const node = document.createElement("textarea");
    const selection = document.getSelection();

    node.textContent = text;
    document.body.appendChild(node);

    selection.removeAllRanges();
    node.select();
    document.execCommand("copy");

    selection.removeAllRanges();
    document.body.removeChild(node);

    window.sendData("natuna:client:nuiDebugSuccess");
    return true;
});
