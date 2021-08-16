# Building
Natuna Framework are made using webpack which compiles all file together in 1 files. This, of course, made the script processing time more fast and if you do the build method with Production method, it would make the compiled script more optimized.

---

## Notes

- ### **✔️ You need to build the files when:**
    1. After cloning this repository on your local machine (Installation).
    2. After editing a client or server scripts or scripts under client and server folder.
    3. After editing a Typescript files.



- ### **❌ You DON'T need to build the files when:**
    1. After editing non-typescript files (Javascript [.js], HTML [.html], etc)
    2. After editing UI files or files under UI folder.
    3. After editing the `natuna.config.js` file (Why? Because this files are included on the core with FiveM NodeJS export-import method).

---

## Requirements
1. Basic knowledge of Command Prompt
2. Basic knowledge of NodeJS commands

---

## Package Requirements
We would used a latest version of these packages, so please keep the latest update for these packages.

1. NodeJS - https://nodejs.org/en/download/
2. NPM - https://docs.npmjs.com/downloading-and-installing-node-js-and-npm
3. Yarn - https://classic.yarnpkg.com/en/docs/install/#windows-stable

---

## Build Options
There is 2 build options,

1. **Watch options** \
    It would track any changes on your script and would build the script immediately after a change appears on your script.

    I suggest you to use this method if you were developing something.

    Command:
    ```
    yarn watch
    ```

2. **Production options** \
    This would only run single build operation on your script and the result would be more stable. However the build process would take more time than the watch options but the results would be minified and stable.

    I suggest you to use this method if you wanted to use your script after finished the development.

    Command:
    ```
    yarn build
    ```

---

## Steps
1. Go to the Natuna Framework folder.
2. Open command prompt and locate to that folder using `cd` command.
3. Run a build command based on your preference, check the build options above.
4. Wait until it's finished.
5. If there are no error presented at the end, then you good to go.