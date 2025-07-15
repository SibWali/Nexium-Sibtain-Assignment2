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
    rules: {
      // Basic TypeScript rules
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-require-imports": "off",
      "@typescript-eslint/no-unused-vars": ["warn", { 
        argsIgnorePattern: "^_",
        varsIgnorePattern: "^_" 
      }],
      
      // Expression and syntax rules
      "@typescript-eslint/no-unused-expressions": ["error", {
        allowShortCircuit: true,
        allowTernary: true,
        allowTaggedTemplates: true
      }],
      
      // Type system improvements
      "@typescript-eslint/no-unnecessary-type-constraint": "error",
      "@typescript-eslint/no-wrapper-object-types": "error",
      "@typescript-eslint/no-this-alias": "error",
      "@typescript-eslint/ban-types": [
        "error",
        {
          types: {
            "{}": {
              message: "Use 'object' or Record<string, unknown> instead",
              fixWith: "object"
            },
            "Function": {
              message: "Use specific function type like () => void instead"
            },
            "BigInt": {
              message: "Use the primitive 'bigint' instead"
            }
          }
        }
      ],
      
      // Empty object/interfaces
      "@typescript-eslint/no-empty-object-type": "error"
    }
  },
  {
    // Ignore build and generated files
    ignores: [
      "**/.next/**",
      "**/node_modules/**",
      "**/dist/**",
      "**/out/**"
    ]
  }
];

export default eslintConfig;