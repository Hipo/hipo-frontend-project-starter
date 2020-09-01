module.exports = {
  roots: ["./src/"],
  transform: {
    // use ts-jest for TypeScript files
    "^.+\\.tsx?$": "ts-jest"
  },
  testRegex: "(/__tests__/.*|(\\.|/)(test|spec))\\.tsx?$",
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],

  // Setup Enzyme
  snapshotSerializers: ["enzyme-to-json/serializer"],
  setupFilesAfterEnv: ["./src/core/setupEnzyme.ts"],

  globals: {
    "ts-jest": {
      babelConfig: true
    },
    BUILD_TYPE: "test",
    TARGET_ENV_TYPE: "test"
  }
};
