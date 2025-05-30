import customConfig from "@mono/eslint-config-custom";

export default [
  {
    files: ["src/**/*.{js,jsx,ts,tsx}"],
    ...customConfig,
  },
];
