![Natuna Logo](https://i.ibb.co/PGqZDFh/text.png)

![Github Repository Project Funding](https://img.shields.io/badge/Project%20Funding-%240.0-orange) ![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg) ![Github Repository Issues Tracking](https://img.shields.io/bitbucket/issues-raw/natuna-framework/natuna)

# **Natuna Framework**
#### FiveM Typescript/Javascript Bundled Framework with single module engine that runs on Javascript runtime. Powered with NodeJS.  

&nbsp;

##### *© 2021 Natuna Framework by Natuna Indonesia. Natuna Indonesia and its associates are not affiliated with or endorsed by Rockstar North,Take-Two Interactive or other rightsholders. Any trademarks used belong to their respective owners.*

---

## Links:
1. [Wiki](https://github.com/natuna-framework/fivem/wiki) (Guides, Additional Documentations)
2. [Building Documentation](BUILDING.md) (See how to build to framework)
3. [Code Documentation](https://developer.natuna.asia/fivem) (Functions, Variable, Classes, Interface, Type, etc.)
4. [Contributing Guide](CONTRIBUTING.md)
5. [Discord Server](https://discord.gg/kGPHBvXzGM) (Need Help?)
6. [Donation, Additional Informations](#interested-with-this-framework) (Feeling Generous?)
---

## Summary
This project was created with the intention of enlivening the FiveM Javascript community. Most people use other frameworks like ESX or QB-Framework but most of them are written in LUA language, so because of that, I was interested in making something completely different from the community.

**Before You Start,**
This framework is not created for people who do not understand programming languages. This framework was created for programmers who at least master the basics of the following:
1. Know how to operating/using command line as well as running commands inside it.
2. Know how to use Typescript / Javascript and how it works.
3. Know how to use script builder/compiler such as Webpack, and how it works.
4. Know how to use package manager such as NPM, YARN, and how it works.
5. Know how to self-starting and self-learning the framework.
6. Know to not ask the Developer(s) for support if the instructions were clearly stated in the Documentation.
7. Know how the framework code works
8. **Know how TO RESPECT OTHER PEOPLE WORKS AND NOT STEALING IT.** 

As you have read above, you will have to do some general programming and requirements above to fully understand what this script has to offer. This script also does not contain like 100% fully featured function from FiveM, as this framework is aims to provide the bare minimum necessary to help you developing your server.

I also hope this script makes developers more creative in terms of developing their servers. Instead of just installing other plugins and running it, i hope you can also develop the script to create something unique on each server.

This framework is still far from perfect, so if you you could help me developing this framework, that would be more good.

---

## Features
Instead of the same thing all over and over again. We give you something a lot of different on this framework, such as:

### 1 | **Plugin System (Single Resources Module)**
What does this means? It means that this framework have it own plugins system, so instead using a lot of resources on your server, with the plugin system on this framework, you could just use a multi plugins on a single resources.

### 2 | **MYSQL Database Wrapper**
If you tired of using a boring old SQL query such as something like
```
INSERT INTO table_name(column_1,column_2,column_3) VALUES (value_1,value_2,value_3); 
```
Well you could try using our built in wrapper so you can insert data to database like
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
If you are using Visual Studio Code as your IDE/Code Editor, then it'd be a great news for you! Since this framework is built using Typescript, so everytime you type something, there would show some content assist, learn more about [VSCode IntelliSense on Here](https://code.visualstudio.com/docs/editor/intellisense).

![IntelliSense Example](https://code.visualstudio.com/assets/docs/editor/intellisense/intellisense_icons.png)

*This image is an example, provided from [VSCode](https://code.visualstudio.com/docs/editor/intellisense)*

### 4 | **JSDOC Documentation Ready**
I also have provided all necessary documentation for every usable function on the framework script so you don't even need to go to the documentation page to see what is the function about, and the example of how to use it.

![JSDOC Documentation Example](https://i.im.ge/2021/08/08/0szfm.png)
![JSDOC Documentation Example 2](https://i.im.ge/2021/08/08/0aOQ6.png)

### 5 | **Safety Checks**
You should read [Why Should We Use TypeScript?](https://dev.to/mistval/type-safe-typescript-4a6f) to know why using Typescript is more better and safe

### 6 | **Command Wrapper**
You may registering command using `RegisterCommand` FiveM native, but for me that is boring. So instead using that, i had created way more advance and safe command system, why more safe? because all of the commands are registered and validated on server instead of client.

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

**Of course this system is new and still on development, so there will be a lot of limitations, make sure you already ready the documentation for this system**

### 8 | **Structured Folder**
Hate to see unstructured files? same. See how the structure of this framework below

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
If `on`, `onNet`, `emit`, and `emitNet` is not enough for you or too complicated to understand, then we create a nice wrapper for you, even for NUI too. See all the available event function below:

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
Buckle up! Let's go to [Natuna Framework Wiki](https://github.com/natuna-framework/fivem/wiki) to setup this framework on your server.

\
**We're Fully Open Sourced!**

You can be a part of our big journey in the future, please create and develop this framework by doing Fork and Pull Requests on this repository.

You can also contribute even if only by providing suggestions or reporting problems with this framework in the Issues section of this repository or in the support link listed in the help section.

[See Our Contributing Guide](CONTRIBUTING.md)

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

