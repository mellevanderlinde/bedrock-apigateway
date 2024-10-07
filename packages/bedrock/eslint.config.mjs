import { eslintConfig } from "@repo/eslint-config/eslint.config.mjs";

export default [
  ...eslintConfig,
  {
    ignores: ["**/src/**/*.js", "**/src/**/*.d.ts"],
  },
];
