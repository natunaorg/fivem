![Natuna Logo](https://i.ibb.co/PGqZDFh/text.png)

![Github Repository Project Funding](https://img.shields.io/badge/Project%20Funding-%240.0-orange) ![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg) ![Github Repository Issues Tracking](https://img.shields.io/bitbucket/issues-raw/natuna-framework/natuna)

# **Natuna Framework**
#### FiveM TypeScript/JavaScript Bundled Framework with single module engine that runs on the JavaScript runtime. Powered by [NodeJS](https://nodejs.org/en/).  

&nbsp;

##### *© 2022 Natuna Framework by Natuna Indonesia. Natuna Indonesia and its associates are not affiliated with or endorsed by Rockstar North, Take-Two Interactive or other rightsholders. Any trademarks used belong to their respective owners.*

---

## Links:
1. [Getting Started](GETTING_STARTED.md) (Installing, Updating, FAQ, etc.)
2. [Building Documentation](BUILDING.md) (See how to build to framework)
3. [Code Documentation](https://developer.natuna.asia/fivem) (Functions, Variable, Classes, Interface, Type, etc.)
4. [Contributing Guide](CONTRIBUTING.md)
5. [Discord Server](https://discord.gg/kGPHBvXzGM) (Need Help?)
6. [Donation, Additional Informations](#interested-with-this-framework) (Feeling Generous?)
---

## Summary
This project was created with the intention of enlivening the FiveM Javascript community. Most people use other frameworks like ESX or QB-Framework but most of them are written in LUA language, so because of that, I was interested in making something completely different from the community.

**Before You Start,**
This framework is not created for people who do not understand programming languages. There are a few skill requirements including:
1. Command line usage
2. JavaScript/TypeScript
3. Understanding module bundlers (Webpack)
4. Node.JS Package Managers (e.g. [npm](https://www.npmjs.com/) / [yarn](https://yarnpkg.com)
5. Being confident in your learning / reach in order to understand how this framework is working
6. Know to not ask the developer(s) for support if the instructions were clearly stated in the documentation.
7. **Know TO RESPECT OTHER PEOPLE'S HARD WORK & TO NOT STEAL!** 

As you have read above, you will have to do some general programming and requirements above to fully understand what this script has to offer. This script also does not contain like 100% fully featured functions from FiveM, as this framework is aims to provide the bare minimum necessary to help you developing your server.

I also hope this script makes developers more creative in terms of developing their servers. Instead of just installing other plugins and running it, I hope you can also develop the script to create something unique on each server.

This framework is still far from perfect, so if you you could help me developing this framework, that would be great!
---

## Features
Instead of the same thing all over and over again, we aim to give you something different by providing this framework, such as:

### 1 | **Plugin System (Single Resources Module)**
What does this mean? It means that this framework has it own plugin system, instead of having a lot of different resources on your server, Natuna can be extended by creating plugins.

### 2 | **MYSQL Database Wrapper**
Natuna removes the need to manually write queries such as:
```
INSERT INTO table_name(column_1,column_2,column_3) VALUES (value_1,value_2,value_3); 
```
By using our database wrapper, your code can be cleaner & more easily maintained going forward.
```ts
db(tableName).write({
    data: {
        column_1: value_1,
        column_2: value_2,
        column_3: value_3
    }
})
```

### 3 | **IntelliSense Ready**
If you are using Visual Studio Code as your IDE/Code Editor, you will have the added benefit of having IntelliSense, making code quicker and easier to write. Since this framework is built using TypeScript, your editor will guide you along the way to writing new code. 

Learn more about [VSCode IntelliSense on Here](https://code.visualstudio.com/docs/editor/intellisense).

![IntelliSense Example](https://code.visualstudio.com/assets/docs/editor/intellisense/intellisense_icons.png)

*This image is an example, provided from [VSCode](https://code.visualstudio.com/docs/editor/intellisense)*


### 4 | **JSDoc Documentation Ready**
Necessary documentation in the form of JSDoc block for classes and functions across the framework, removing the need to tab between your code & a web browser containing the documentation.

Learn more about [JSDoc](https://jsdoc.app/)

![JSDOC Documentation Example](https://i.im.ge/2021/08/08/0szfm.png)
![JSDOC Documentation Example 2](https://i.im.ge/2021/08/08/0aOQ6.png)

### 5 | **Safety Checks**
TypeScript can help us to write more reliable, bug free software.
As mentioned above with regards to IntelliSense, it also allowed us to provide types, making code easier to write.

Learn more about [Why Should We Use TypeScript?](https://dev.to/mistval/type-safe-typescript-4a6f) to know why using TypeScript is more better and safer.

### 6 | **Command Wrapper**
You may registering command using `RegisterCommand` FiveM native, but for me that is boring. So instead using that, I have created a way more advance and safe command system, why more safe? because all of the commands are registered and validated on server instead of client.

**You might wanna see more detailed about this on the documentation.**

Check the example below
```ts
registerCommand(
    // Command Name
    'hello',
    // Command handler
    (src, args) => {
        return console.log('Hello!');
    },
    // Configuration
    {
        description: "Say Hello"
    }
});
```

Example list of the configuration
```ts
{
    argsRequired?: boolean | number;
    description?: string;
    argsDescription?: Array<{ name: string; help: string }>;
    cooldown?: number;
    consoleOnly?: boolean;
    requirements?: {
        steamIDs?: Array<string>;
        custom?: Function;
    };
    caseInsensitive?: boolean;
    cooldownExclusions?: {
        steamIDs?: Array<string>;
    };
    restricted?: boolean;
}
```

### 7 | **Multi NUI Wrapper**
Wanted to use multi NUI system? NOT A PROBLEM! This framework also contain it own built in NUI system so you don't need to create like 100+ resources for 100 NUI, instead, using 1 resources, this framework, would be enough to handle all of that.

**Of course this system is new and still in development, so there will be a lot of limitations, make sure you already read the documentation for this system**

### 8 | **Structured Folder**
Hate to see unstructured files? same. See how the structure of this framework below:

```
*
+-- src/ (Framework core files)
|   +-- client/ (Client core scripts)
|   +-- server/ (Server core scripts)
|   +-- ui/ (NUI core scripts)
|
+-- plugins/ (Framework plugins files)
|   +-- (YourPluginsFolder)/
|       +-- client/
|       +-- server/
|       +-- ui/
|       +-- manifest.ts [or manifest.json] (Your plugin manifest files)
|
+-- natuna.config.js
+-- (Other files...)
```


### 9 | **Event Wrapper**
If `on`, `onNet`, `emit`, and `emitNet` is not enough for you or too complicated to understand, then we create a nice wrapper for you, even for NUI too. See all the available event functions below:

> **Client Event Function**
```ts
addNUIEventHandler = (name: string, handler: (data: any, callback: Function) => any) => void;
triggerNUIEvent = (name: string, data?: object) => void;

addClientEventHandler =  (name: string | Array<string>, handler: Function) => void;
triggerClientEvent = (name: string | Array<string>, ...args: any) => void;

addClientCallbackEventHandler = (name: string, handler: Function) => void;
triggerClientCallbackEvent = (name: string, callbackHandler: (data: any) => any, ...args: any) => void;

addSharedEventHandler = (name: string | Array<string>, handler: Function) => void;
triggerSharedEvent = (name: string | Array<string>, ...args: any) => void;

addSharedCallbackEventHandler = (name: string, handler: Function) => void;
triggerSharedCallbackEvent = (name: string, callbackHandler: (data: any) => any, ...args: any) => void;
```

> **Server Event Functions**
```ts
addServerEventHandler = (name: string | Array<string>, handler: Function) => void;
triggerServerEvent = (name: string | Array<string>, ...args: any) => void;

addServerCallbackEventHandler = (name: string, handler: Function) => void;
triggerServerCallbackEvent = (name: string, callbackHandler: Function, ...args: any) => void;

addSharedEventHandler = (name: string | Array<string>, handler: Function) => void;
triggerSharedEvent = (name: string | Array<string>, ...args: any) => void;

addSharedCallbackEventHandler = (name: string, handler: Function) => void;
triggerSharedCallbackEvent = (name: string, callbackHandler: (data: any) => any, ...args: any) => void;
```
> **NUI Event Functions**
```ts
// Array of event list
window.events = any[]

// Trigger an event to another NUI
window.emit = (name: string, data?: {}) => void;

// Listen events from other NUI `window.emit` or from client `triggerNUIEvent`
window.on = (name: string, handler: (data) => any) => number; // Return the event index

// Remove an event listener
window.removeListener = (name: string, eventIndex: number) => void;

// Emit an event to client. Listen the event on client with `addNUIEventHandler`
window.sendData = (name: string, data?: {}) => void;
```

### 10 | **And Many Other Features In the Future!**
Expect more from us in the future! We would give you something different and something more great above your expectation.

---

## Interested with this framework?
Buckle up! Let's go to [Installation Documentation](GETTING_STARTED.md) to setup this framework on your server.

\
**We're Fully Open Sourced!**

You can be a part of our big journey in the future, please create and develop this framework by doing Fork and Pull Requests on this repository.

You can also contribute even if only by providing suggestions or reporting problems with this framework in the [issues](https://github.com/natuna-framework/fivem/issues) section of this repository, or in the support link listed in the help section.

See Our [Contributing Guide](CONTRIBUTING.md)

\
**Need Help?**

If you have tried your best in overcoming every problem but to no avail, don't hesitate to discuss with us at the link below:

- [Discord Server](https://discord.gg/kGPHBvXzGM)

\
**Feeling Generous?**

This project is 100% free to use. Either you just wanted to use it or modified it, it's up to yourself. You don't even need license key, subscription or whatsoever that related to money.

If you want to help us, the core developers, in finance, or help the infrastructure of this project to cover monthly expenses and so on, you can become our donor via the link below:

- [Ko-fi](https://ko-fi.com/raflymln)
- [Paypal](https://www.paypal.com/paypalme/mraflymaulana)

Please understand that sponsors will receive special content from us as a token of our gratitude, however, we will continue to run this project as an open source project without any mandatory fees.
