import next from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const config = [
  { ignores: [".next/**", "out/**", "node_modules/**", "next-env.d.ts", "**/.omc/**"] },

  ...next,
  ...nextTs,

  {
    files: ["**/*.ts", "**/*.tsx"],
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],
    },
  },

  // Tokens only: ban style={{}} whose values are all static literals, so colours
  // and spacing go through the theme utilities. Inline style stays available for
  // runtime values (e.g. a bar width computed from data).
  {
    files: ["**/*.tsx", "**/*.jsx"],
    rules: {
      "no-restricted-syntax": [
        "error",
        {
          // `:has()` must use descendant selectors: esquery does not support a
          // leading child combinator inside `:has(> ...)`.
          selector:
            "JSXAttribute[name.name='style'] > JSXExpressionContainer > ObjectExpression" +
            ":has(Property)" +
            ":not(:has(SpreadElement))" +
            ":not(:has(Property > *.value:not(Literal)))",
          message:
            "Avoid style={{}} for static values: use the theme utilities. Inline style is only for runtime values.",
        },
      ],
    },
  },
];

export default config;
