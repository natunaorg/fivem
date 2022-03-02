/**
 * @readonly
 * @typedef {import('./src/server/index').PluginManifest} PluginManifest
 */

"use strict";
const esbuild = require("esbuild");

const isProduction = process.argv.findIndex((argItem) => argItem === "--mode=production") >= 0;
const isWatch = process.argv.findIndex((argItem) => argItem === "--watch") >= 0;

(async () => {
    /**
     * @type {(import("esbuild").BuildOptions & {
     *  label: string
     * })[]}
     */
    const contexts = [
        {
            label: "server",
            platform: "node",
            entryPoints: ["./src/server/index.ts"],
            target: ["node16"],
            external: ["./node_modules/*", "@/package.json", "@/natuna.config.js"],
            format: "cjs",
        },
        {
            label: "client",
            platform: "browser",
            entryPoints: ["./src/client/index.ts"],
            target: ["chrome93"],
            format: "iife",
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

            const analize = await esbuild.analyzeMetafile(result.metafile, {
                color: true,
                verbose: true,
            });

            console.log(analize);
        } catch (error) {
            console.error(`[${label}]: Build failed`, error);
        }
    }
})();
