import { formatSqlValue } from "./sql.util";

describe("sql utils", () => {
  it("should format null values", () => {
    expect(formatSqlValue(null)).toBe("null");
  });

  it("should format string values", () => {
    expect(formatSqlValue(`Single quote ', Double quote "`)).toBe(
      `'Single quote '', Double quote ""'`,
    );
  });

  it("should format boolean values", () => {
    expect(formatSqlValue(true)).toBe("true");
    expect(formatSqlValue(false)).toBe("false");
  });

  it("should format integer values", () => {
    expect(formatSqlValue(1)).toBe("1");
  });

  it("should format floating point values", () => {
    expect(formatSqlValue(1.1234)).toBe("1.1234");
  });

  it("should format integer values", () => {
    expect(formatSqlValue(42)).toBe("42");
  });

  it("should error on an invalid type", () => {
    expect(() => formatSqlValue({ key: "nope" })).toThrow(
      "Unsupported type: object",
    );
  });
});
