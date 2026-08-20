import js from "@eslint/js";
import eslintConfigPrettier from "eslint-config-prettier";
import globals from "globals";
import tseslint from "typescript-eslint";

export default tseslint.config(
    {
        ignores: [
            "node_modules/**",
            "dist/**",
            "out/**",
            "coverage/**",
            "public/**",
            "storage/app/**",
            "storage/cache/**",
            "storage/framework/**",
            "bun.lock",
            "*.tsbuildinfo",
            "src/stubs/**"
        ]
    },

    js.configs.recommended,
    ...tseslint.configs.recommended,

    // All TypeScript (server code + resources/views), no React-specific rules
    {
        files: ["**/*.{ts,tsx}"],
        languageOptions: {
            ecmaVersion: "latest",
            sourceType: "module",
            parserOptions: {
                ecmaFeatures: {
                    experimentalDecorators: true
                }
            },
            globals: {
                ...globals.node,
                ...globals.browser,
                Bun: "readonly"
            }
        },
        rules: {
            "no-unused-vars": "off",
            "@typescript-eslint/no-unused-vars": [
                "warn",
                {
                    argsIgnorePattern: "^_",
                    varsIgnorePattern: "^_"
                }
            ],
            "@typescript-eslint/no-explicit-any": "off",
            "@typescript-eslint/no-empty-object-type": "off",
            "@typescript-eslint/no-inferrable-types": "off",
            "@typescript-eslint/no-require-imports": "off",
            "no-console": "off"
        }
    },

    // Prettier must be last: turns off stylistic rules that conflict with formatting
    eslintConfigPrettier
);
