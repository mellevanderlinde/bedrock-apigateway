import config from "@repo/eslint-config/eslint.config.mjs";

export default [
  ...config,
  {
    ignores: ["**/src/**/*.js", "**/src/**/*.d.ts"],
  },
];
