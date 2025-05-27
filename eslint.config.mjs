import antfu from "@antfu/eslint-config";

export default antfu({
  typescript: true,
  rules: { "no-new": "off" },
  ignores: ["**/cdk.out"],
  stylistic: { semi: true, quotes: "double" },
});
