/* global $ */

// ⛔ You might wanna see the 'dumping.html' file to learn how the files built.

/**
 * We don't use classic document.addEventListener on here, but we're using events just like normally.
 * - Learn about the list of events on https://developer.natuna.asia/fivem/modules/NUI.html
 */
window.on("copytext", (data) => {
    const node = document.createElement("textarea");
    const selection = document.getSelection();

    node.textContent = data.text;
    document.body.appendChild(node);

    selection.removeAllRanges();
    node.select();
    document.execCommand("copy");

    selection.removeAllRanges();
    document.body.removeChild(node);
});

/**
 * JQUERY TIME!
 * ---
 *
 * Like i said, there's a lot of limitations for this one.
 * You need to use id to specify a query selector instead of class because that would trigger other class on the other plugin
 *
 * See the example below:
 */
$("#someDiv").html("<h1>Hello World!</h1>"); // This is Right ✔️, it would generated as $("#example-uniqueDiv")
$(".container").html("<h1>Hello World!</h1>"); // This is WRONG ❌, it would trigger all DOM with container class across all plugins.

/**
 * There're also a limitations when you creating a function.
 * Since script would be apply globally, i suggest you to wrap a function inside a class instead of declaring it globally.
 */
new (class {
    constructor() {
        // Any functions or variable or things written on here, would only apply locally on this class so it would not conflict with other function on another plugin
        // Do some works here...
    }
})();
