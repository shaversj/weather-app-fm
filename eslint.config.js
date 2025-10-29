import pluginRouter from "@tanstack/eslint-plugin-router";
import tseslint from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import perfectionist from "eslint-plugin-perfectionist";

export default [
    ...pluginRouter.configs["flat/recommended"],
    perfectionist.configs["recommended-natural"],
    {
        files: ["**/*.{ts,tsx}"],
        languageOptions: {
            parser: tsParser,
            parserOptions: {
                ecmaVersion: "latest",
                project: "./tsconfig.json",
                sourceType: "module",
            },
        },
        plugins: {
            "@typescript-eslint": tseslint,
        },
        rules: {
            ...tseslint.configs.recommended.rules,
            "@typescript-eslint/only-throw-error": [
                "error",
                {
                    allow: [
                        {
                            from: "package",
                            name: "Redirect",
                            package: "@tanstack/router-core",
                        },
                    ],
                },
            ],
        },
    },
];
