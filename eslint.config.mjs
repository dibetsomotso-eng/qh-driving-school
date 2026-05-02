import nextConfig from "eslint-config-next";

export default [
  ...nextConfig,
  {
    rules: {
      // React Compiler rules are opt-in and produce false positives on
      // valid patterns in Firebase hooks and shadcn/ui generated files.
      "react-hooks/set-state-in-effect": "off",
      "react-hooks/purity": "off",
      "react-hooks/incompatible-library": "off",
      "react-hooks/use-memo": "off",
      // Font warning is valid for App Router — suppress for root layout.
      "@next/next/no-page-custom-font": "off",
    },
  },
];
