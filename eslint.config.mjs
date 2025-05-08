import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    overrides: [
      {
        files: ["src/generated/*"],
        rules: {
          // Disable all rules for files in src/generated/*
          "no-unused-vars": "off",
          "no-undef": "off",
        },
      },
    ],
  }
];

export default eslintConfig;
