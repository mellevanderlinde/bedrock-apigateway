import config from "eslint-config/eslint.config.mjs";

export default [...config, { ignores: ["**/cdk.out/**"] }];
