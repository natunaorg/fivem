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
1. **Clone this repository to your local machine** <br/>
    Make sure you put it on FiveM resources folder and rename it to `natuna` or something else, also don't forget to add this resource to `server.cfg` file.

    > We suggest you to clone this repository using `git` instead of downloading this repository as a .zip or .tar since it'd help you update this framework more easily using `git pull` command later.

2. **Open command prompt and locate to this resource folder** <br/>
    Use `cd` command to locate to the cloned folder on your local machine.

4. **Edit the configuration file at `package.json`** <br/>
    You can change almost everything, but Natuna Framework configuration is located under `natuna` variable.
    
5. **Copy the `.env.example` file to `.env`** <br/>
    Copy or just rename it, you choose.

6. **Edit the `.env` file** <br/>
    Env file is used to store your secret keys, database credentials, etc.

7. **Install all dependencies** <br/>
    Use `npm install` or `yarn` command to install all dependencies.

8. **Migrate and generate the database schema** <br/>
    Run the database migration first before generating the schema.
    To read and learn about this, please go to [BUILDING.md](BUILDING.md).

9. **Build the files** <br/>
    **Run the steps 8 first before running this step.**
    To read and learn about building this files, please go to [BUILDING.md](BUILDING.md).

10. **Start your FiveM server** <br/>
    When you starting the server, you will found out a message saying

    - `Couldn't start resource natuna.` and
    - `Running build tasks on natuna - it'll restart once completed`

    It happens because FiveM is installing the project dependencies into FiveM local node_modules folder. Just wait until it's finished.

## Updating
Everytime this resource is starting, you would find a log on console saying whether your version of this resource are outdated or not. If your version was outdated, please update your version using `git pull` command on this resource folder.

## Frequently Asked Questions

1. **Why is my character not spawning after i join my server?** <br/>

    That because this framework currently has no built-in character maker/selector. Since this framework still on development, you should start making your own and we hope you can contribute to this current project.

2. **Why is there isn't anything?** <br/>

    This project is completely a base system, known as framework. It's not a game. It's a base system that you can use to build your own game. So you need to add a plugin to this framework to make your game.

    Currently this framework is still in development, so the plugin is still in development.

3. **How do i create a plugin or ui?** <br/>

    Coming soon~
