module.exports = {
    parser: "@typescript-eslint/parser",
    parserOptions: {
        project: "tsconfig.json",
        tsconfigRootDir: __dirname,
        sourceType: "module",
    },
    plugins: ["@typescript-eslint/eslint-plugin", "import"],
    extends: [
        "plugin:@typescript-eslint/eslint-recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:@typescript-eslint/recommended-requiring-type-checking",
        "plugin:import/typescript",
        "prettier",
    ],
    root: true,
    env: {
        node: true,
        jest: true,
    },
    ignorePatterns: [".eslintrc.js"],
    rules: {
        "max-len": [
            "error",
            120,
            {
                ignoreUrls: true,
                ignoreStrings: true,
                ignoreComments: true,
            },
        ],
        semi: ["error", "always"],
        "comma-dangle": ["error", "always-multiline"],
        radix: ["error", "as-needed"],
        "object-curly-newline": "off",
        "no-useless-constructor": 0,
        "arrow-body-style": "off",
        "@typescript-eslint/no-unsafe-return": 0,
        "no-async-promise-executor": 0,
        "@typescript-eslint/await-thenable": 0,
        "@typescript-eslint/unbound-method": 0,
        "@typescript-eslint/no-misused-promises": 0,
        "@typescript-eslint/no-unsafe-member-access": 0,
        "@typescript-eslint/no-unsafe-assignment": 0,
        "@typescript-eslint/no-unsafe-call": 0,
        "@typescript-eslint/no-redundant-type-constituents": 0,
        "@typescript-eslint/interface-name-prefix": "off",
        "@typescript-eslint/explicit-function-return-type": "off",
        "@typescript-eslint/explicit-module-boundary-types": "off",
        "@typescript-eslint/restrict-template-expressions": "off",
        "import/no-extraneous-dependencies": "off",
        "@typescript-eslint/no-floating-promises": "off",
        "no-plusplus": ["error", { allowForLoopAfterthoughts: true }],
        "no-await-in-loop": "off",
        "dot-notation": "off",
        "@typescript-eslint/no-shadow": ["error"],
        "no-shadow": "off",
        "linebreak-style": "off",
        quotes: ["error", "double", { avoidEscape: true }],
        indent: [
            "error",
            4,
            {
                ignoredNodes: ["PropertyDefinition[decorators]", "ConditionalExpression", "MemberExpression"],
                SwitchCase: 1,
            },
        ],
        "import/prefer-default-export": "off",
        "import/no-unresolved": "off",
        "class-methods-use-this": "off",
        "no-return-await": "off",
        "@typescript-eslint/require-await": "off",
        "no-useless-catch": "off",
        "consistent-return": ["error", { treatUndefinedAsUnspecified: false }],
        "no-else-return": "off",
        "max-classes-per-file": ["error", { ignoreExpressions: true, max: 5 }],
        "operator-linebreak": ["error", "after", { overrides: { "?": "before", ":": "before" } }],
        "lines-between-class-members": ["error", "always", { exceptAfterSingleLine: true }],
        "import/order": [
            "error",
            {
                groups: [
                    "builtin", // Built-in imports (come from NodeJS)
                    "external", // External imports
                    "internal", // Absolute imports
                    ["sibling", "parent"], // Relative imports
                    "index", // index imports
                    "unknown", // unknown
                ],
                alphabetize: {
                    order: "asc", // sort in ascending order
                    caseInsensitive: true, // ignore case
                },
                pathGroups: [
                    {
                        pattern: "react",
                        group: "external",
                        position: "before",
                    },
                    {
                        pattern: "@**/**",
                        group: "external",
                        position: "after",
                    },
                ],
                pathGroupsExcludedImportTypes: ["react"],
            },
        ],
    },
};
