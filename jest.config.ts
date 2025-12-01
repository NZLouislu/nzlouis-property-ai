import type { JestConfigWithTsJest } from "ts-jest";

const config: JestConfigWithTsJest = {
  testEnvironment: "node",
  preset: "ts-jest/presets/default-esm",
  extensionsToTreatAsEsm: [".ts"],
  verbose: false,
  globals: {
    "ts-jest": {
      useESM: true,
      tsconfig: {
        module: "esnext",
        jsx: "react",
      },
    },
  },
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1",
  },
  testRegex: "(/__tests__/.*|(\\.|/)(test|spec))\\.(jsx?|tsx?)$",
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  transformIgnorePatterns: ["node_modules/(?!(github-projects-md-sync)/)"],
};

export default config;