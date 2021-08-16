# Getting Started
Interested using and developing this framework? Let's begin...
1. [Installing](#installing-it)
2. [Updating](#updating)
3. [Frequently Asked Questions](#frequently-asked-questions)

---

## Installing It
### - Requirements
1. Basic knowledge of Command Prompt
2. Basic knowledge of Git commands
2. Basic knowledge of MYSQL/SQL database

### - Steps
1. **Clone this repository to your local machine** \
    Make sure you put it on FiveM resources folder and rename it to `natuna` or something else, also don't forget to add this resource to `server.cfg` file.

    > I suggest you to clone instead of downloading this repository since it'd help you update this framework more easily using `git pull` command.

2. **Open command prompt and locate to this resource folder** \
    Use `cd` command to locate to the cloned folder on your local machine.

3. **Build the files** \
    To read and learn about building this files, please go to [BUILDING.md](BUILDING.md).

4. **Edit the configuration file at `natuna.config.js`**
    All the information for every single setting are included and documented on the file. Please read it before you change it.

5. **Create a new Database** \
    Make sure the name are the same with the one on the configuration file.

6. **Import `natuna.sql` into the database** \
    Make sure everything was imported properly.

    > Our SQL was generated properly, we have tested it before releasing it. If you found any error while importing the SQL, please find the solutions on Google first before asking to us

7. **Start your FiveM server** \
    When you starting the server, you will found out a message saying

    - `Couldn't start resource natuna.` and
    - `Running build tasks on natuna - it'll restart once completed`

    Which means you have to wait it build process on FiveM until complete. Wait until the build process is completed and `Started resource natuna` text is logged to the console.

8. **Rebuild the files** \
    Once the build process on the FiveM is completed, you much rebuild the files by doing the same as steps number 3.

    > Why must rebuild the files? Because the FiveM webpack build is different than the webpack on this resource, resulting to an error on the compiled files.

9. **Restart the resource** \
    Once the build is completed, you can restart either only this resource or the whole FiveM server process. After the server starting you would find a big text saying "Natuna". If there're no any error from the resource, then you're good to go.

---

## Updating
Everytime this resource is starting, you would find a log on console saying whether your version of this resource are outdated or not. If your version was outdated, please update your version using `git pull` command on this resource folder.

---

## Frequently Asked Questions

1. **Why is my character not spawning after i join my server?** \
    That because this framework currently has no built-in character maker/selector. Since this framework still on development, you should start making your own and we hope you can contribute to this current project.

2. **How do i create a plugin?** \
    Please check the example plugin on `/plugins` folder, i've documented how to do that on there.

    Project structure:
    ```
    (Your Plugin Name)
        + client/
        |       +-- (...)
        |
        + server/
        |       +-- (...)
        |
        + ui/
        |       +-- (...)
        |
        + manifest.ts / manifest.json
    ```