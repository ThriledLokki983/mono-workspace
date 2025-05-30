import customConfig from "@mono-workspace/eslint-config-custom";

export default [
  {
    files: ["src/**/*.{js,jsx,ts,tsx}"],
    ...customConfig,
  },
];
