# Building
Natuna Framework came in source code form, so you can build it with your own tools. We used EsBuild as our default compiler and it's so fast. Learn more about EsBuild [here](https://esbuild.github.io/)

## Requirements
1. Basic knowledge of Command Prompt
2. Basic knowledge of NodeJS commands

## Package Requirements
We would used a latest version of these packages, so please keep the latest update for these packages.

1. NodeJS - https://nodejs.org/en/download/
2. NPM - https://docs.npmjs.com/downloading-and-installing-node-js-and-npm
3. Yarn - https://classic.yarnpkg.com/en/docs/install/#windows-stable

## Types of Builds

### 1. **Files** <br/>
Builds all files in the `src` folder. <br/>

- **✔️ You need to build the files when:**
    1. After cloning this repository on your local machine (Installation).
    2. After editing any script under `src` folder.
    3. After generating a new Database schema.

- **❌ You DON'T need to build the files when:**
    1. After editing configuration on `package.json`.

To build files, you need to run:
- `npm run build` or `yarn build` to perform a single production build.
- `npm run build:dev` or `yarn build:dev` to perform a development build.
- `npm run dev` or `yarn dev` to perform a watch build, which will automatically rebuild the files when you change them.

### 2. **Database** <br/>
Builds the database schema. This is required after you edit the database migration file so that the new schema will be applied to the database module.

Current database is only support MySQL, and its schema is generated from SQL migration file under `.natuna/database/mysql/migration.sql`. 

To build database, you need to run:
- `npm run db:migrate` or `yarn db:migrate` to perform a a database migration from the migration file.
- `npm run db:create-schema` or `yarn db:create-schema` to generate the new database schema from the migration file.
- `npm run db:setup` or `yarn db:setup` to perform 2 steps above.

## Steps
1. Go to the Natuna Framework folder.
2. Open command prompt and locate to the project folder using `cd` command.
3. Run a build command based on your preference, check the build options above.
4. Wait until it's finished.
5. If there are no error presented at the end, then you good to go.

> If you're ever wonder, yes, EsBuild is generating your whole file mostly under 1 second.