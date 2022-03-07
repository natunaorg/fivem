"use strict";
const esbuild = require("esbuild");
const path = require("path");

const isProduction = process.argv.findIndex((argItem) => argItem === "--mode=production") >= 0;
const isWatch = process.argv.findIndex((argItem) => argItem === "--watch") >= 0;

(async () => {
    /**
     * @type {(import("esbuild").BuildOptions & { label: string })[]}
     */
    const contexts = [
        {
            label: "client",
            platform: "browser",
            entryPoints: ["./src/client/index.ts"],
            target: ["chrome93"],
            format: "iife",
        },
        {
            label: "server",
            platform: "node",
            entryPoints: ["./src/server/index.ts"],
            target: ["node16"],
            external: [],
            inject: [],
            format: "cjs",
            sourcemap: true,
            define: {
                require: "requireTo",
            },
            plugins: [
                {
                    name: "ts-paths",
                    setup: (build) => {
                        build.onResolve({ filter: /@citizenfx/ }, (args) => {
                            return { namespace: "ignore", path: "." };
                        });

                        build.onResolve({ filter: /.*/ }, (args) => {
                            if (!args.path.match(/^@(server|client|shared)/) && args.kind === "import-statement") {
                                let modulePath;

                                // @/ means the root of the project
                                if (args.path.startsWith("@/")) {
                                    modulePath = path.join(...process.cwd().split(path.sep), args.path.replace(/^@\//, ""));
                                } else {
                                    modulePath = require.resolve(args.path);

                                    // require.resolve return the index.js file, while i'm here
                                    // just trying to add the root path to the node_modules path

                                    // [require.resolve] => D:\Servers\NatunaIndonesia\txData\CFX\resources\[local]\natuna\node_modules\mysql2\index.js
                                    // [code below] => D:\Servers\NatunaIndonesia\txData\CFX\resources\[local]\natuna\node_modules\mysql2
                                    if (path.isAbsolute(modulePath)) {
                                        modulePath = path.join(...process.cwd().split(path.sep), "node_modules", args.path);
                                    }
                                }

                                return {
                                    path: modulePath,
                                    external: true,
                                };
                            }
                        });

                        build.onLoad({ filter: /.*/, namespace: "ignore" }, (args) => {
                            return {
                                contents: "",
                            };
                        });
                    },
                },
            ],
        },
    ];

    for (const context of contexts) {
        // Remove Additional Option Conflicts
        const label = context.label;
        delete context.label;

        try {
            const result = await esbuild.build({
                bundle: true,
                assetNames: `[name].[ext]`,
                outdir: "dist/" + label,
                minify: isProduction,
                sourcemap: true,
                metafile: true,
                watch: isWatch
                    ? {
                          onRebuild: (err, res) => {
                              if (err) {
                                  return console.error(`[${label}]: Rebuild failed`, err);
                              }

                              console.log(`[${label}]: Rebuild succeeded, warnings:`, res.warnings);
                          },
                      }
                    : false,
                ...context,
            });

            if (isProduction) {
                const analize = await esbuild.analyzeMetafile(result.metafile, {
                    color: true,
                    verbose: true,
                });

                console.log(analize);
            }
        } catch (error) {
            console.error(`[${label}]: Build failed`, error);
        }
    }
})();
