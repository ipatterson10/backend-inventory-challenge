module.exports = {
  displayName: {
    name: "nabis-coding-exercises",
    color: "yellow",
  },
  preset: "ts-jest",
  testMatch: ["**/+(*.|*-)+(spec|test).+(ts)?(x)"],
  transform: {
    "^.+\\.(ts|html)$": ["ts-jest", { tsconfig: "./tsconfig.build.json" }],
  },
  coverageThreshold: {
    global: {
      branches: 75,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  // moduleFileExtensions: ['ts', 'js', 'html'],
  collectCoverage: true,
  collectCoverageFrom: [
    "**/*.ts?(x)",
    "!**/index.ts?(x)",
    "!**/*.{d,mock,notest,dto,entity,config,conf,mock,input,health,task,benchmark,dev,strategy,constants,guard,middleware}.ts?(x)",
    "!**/node_modules/**",
    "!**/*.spec.ts",
  ],
  coverageReporters: ["cobertura", "clover", "lcov", "text"],
  coverageDirectory: "./coverage",
  transformIgnorePatterns: ["dist", "node_modules"],
  testPathIgnorePatterns: ["dist", "node_modules"],
  coveragePathIgnorePatterns: ["dist", "node_modules"],
  modulePathIgnorePatterns: ["dist", "node_modules"],
};
