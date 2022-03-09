# Natuna FiveM Framework

<img src="https://i.ibb.co/PGqZDFh/text.png" align="right" width="350px" />

### FiveM® TypeScript based framework with single resources handler system that runs on the JavaScript & NodeJS runtime.

![Github Repository Project Funding](https://img.shields.io/badge/Project%20Funding-%240.0-orange) ![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg) ![Github Repository Issues Tracking](https://img.shields.io/bitbucket/issues-raw/natuna-framework/natuna)

###### © 2022 Natuna Framework by [Runes](https://runes.asia). Runes and its associates are not affiliated with or endorsed by Rockstar North, Take-Two Interactive or other rightsholders. Any trademarks used belong to their respective owners.

## Links:

1. [Getting Started](docs/GETTING_STARTED.md) (Installing, Updating, FAQ, etc.)
2. [Building Documentation](docs/BUILDING.md) (See how to build to framework)
3. [Code Documentation](https://developer.natuna.asia/fivem) (Functions, Variable, Classes, Interface, Type, etc.)
4. [Contributing Guide](docs/CONTRIBUTING.md)
5. [Discord Server](https://discord.gg/kGPHBvXzGM) (Need Help?)
6. [Donation, Additional Informations](#interested-with-this-framework) (Feeling Generous?)

## Summary

This project was created with the intention of enlivening the FiveM Javascript community. Most people use other frameworks like ESX or QB-Framework but most of them are written in LUA language, so because of that, I was interested in making something completely different from the community.

<details>
<summary><b>Before You Start, Read This</b></summary>

This framework is not created for people who do not understand programming languages. There are a few skill requirements including:

1. Command line usage
2. JavaScript/TypeScript
3. Understanding module bundlers (Webpack)
4. Node.JS Package Managers (e.g. [npm](https://www.npmjs.com/) / [yarn](https://yarnpkg.com))
5. Being confident in your learning / reach in order to understand how this framework is working
6. Know to not ask the developer(s) for support if the instructions were clearly stated in the documentation.
7.  **KNOW HOW TO RESPECT OTHER PEOPLE'S HARD WORK & TO NOT STEAL!**

This framework is still far from perfect, so if you you could help me developing this framework, that would be great!

</details>

## Features

Instead of the same thing all over and over again, we aim to give you something different by providing this framework, such as:

<details>
<summary>1. Single Handler System Based</summary>

With Natuna, all ticks, event, variables are handled with this framework itself.

<img height="300" src="https://cdn.discordapp.com/attachments/872029309185966100/950069231645519902/unknown.png" />
<img height="300" src="https://cdn.discordapp.com/attachments/872029309185966100/950069231972671528/unknown.png" />

</details>

<details>
<summary>2. Typescript is Better</summary>

1. **IntelliSense Ready** <br/>
	Learn more about [VSCode IntelliSense on Here](https://code.visualstudio.com/docs/editor/intellisense).
	<img src="https://code.visualstudio.com/assets/docs/editor/intellisense/intellisense_icons.png" width="500" />
	
2. **JSDoc Ready** <br/>
	Learn more about [JSDoc](https://jsdoc.app/).
	<img src="https://i.im.ge/2021/08/08/0aOQ6.png" width="500" />
	
3. **Safety Checks** <br/>
	Learn more about [why should we use TypeScript](https://dev.to/mistval/type-safe-typescript-4a6f).
	<img src="https://i.stack.imgur.com/Y2VvL.png" width="500" />

</details>

<details>
<summary>3. Wrapper</summary>

1. **Database Wrapper** <br/>
	You don't need to write old traditional query language to do get or update things on your database.
	```ts
	db.tableName.create({
		data: {
			column_1:  value_1,
			column_2:  value_2,
			column_3:  value_3
		}
	})
	```
	
2. **Command Wrapper** <br/>
	You may registering command using `RegisterCommand` FiveM native, but for us, that is boring.
	```ts
	registerCommand(
		// Name
		'hello',
		// Handler
		(src, args) => {
			return  console.log('Hello!');
		},
		// Configuration
		{
			description:  "Say Hello"
		}
	});
	```
	
3. **Multi NUI Wrapper** <br/>
	Wanted to use multi NUI system? NOT A PROBLEM! This framework also contain it own built in NUI system so you don't need to create like 100+ resources for 100 NUI, instead, using 1 resources, this framework, would be enough to handle all of that.

4. **Event Wrapper** <br/>
	Natuna wrap all events to be handled on single event loop. 
	<img src="https://cdn.discordapp.com/attachments/820869715047743489/950691984249585714/unknown.png" width="500" />

</details>

<details>
<summary>4. <b>And Many Other Features In the Future!</b></summary>

Expect more from us in the future! We would give you something different and something more great above your expectation.

</details>

## Interested with this framework?

Buckle up! Let's go to [Installation Documentation](docs/GETTING_STARTED.md) to setup this framework on your server.


1. **We're Fully Open Sourced!**

You can be a part of our big journey in the future, please create and develop this framework by doing Fork and Pull Requests on this repository.

You can also contribute even if only by providing suggestions or reporting problems with this framework in the [issues](https://github.com/natuna-framework/fivem/issues) section of this repository, or in the support link listed in the help section.

See Our [Contributing Guide](CONTRIBUTING.md)

2. **Need Help?**

If you have tried your best in overcoming every problem but to no avail, don't hesitate to discuss with us at our [Discord Server](https://discord.gg/kGPHBvXzGM).

3. **Feeling Generous?**

This project is 100% free to use. Either you just wanted to use it or modified it, it's up to yourself. You don't even need license key, subscription or whatsoever that related to money.

If you want to help us, the core developers, in finance, or help the infrastructure of this project to cover monthly expenses and so on, you can become our donor via the link below:

- [Ko-fi](https://ko-fi.com/raflymln)
- [Paypal](https://www.paypal.com/paypalme/mraflymaulana)

Please understand that sponsors will receive special content from us as a token of our gratitude, however, we will continue to run this project as an open source project without any mandatory fees.