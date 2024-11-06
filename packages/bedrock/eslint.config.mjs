import config from "eslint-config/eslint.config.mjs";

export default [
  ...config,
  {
    ignores: [
      "**/src/**/*.js",
      "**/src/**/*.d.ts",
      "**/test/**/*.js",
      "**/test/**/*.d.ts",
    ],
  },
];
