import {
  calculateDiscount,
  canDrive,
  getCoupons,
  isPriceInRange,
  isValidUsername,
  Stack,
  validateUserInput,
} from "../src/core";
import { it, expect, describe, beforeEach } from "vitest";

describe("getCoupons", () => {
  it("应该返回一系列数组coupons对象", () => {
    const coupons = getCoupons();
    expect(Array.isArray(coupons)).toBeTruthy();
    expect(coupons.length).toBeGreaterThan(0);
  });
  it("应该返回有效优惠价对象属性code的数组", () => {
    const coupons = getCoupons();
    coupons.forEach((coupon) => {
      expect(coupon).toHaveProperty("code");
      expect(typeof coupon.code).toBe("string");
      expect(coupon.code).toBeTruthy();
    });
  });
  it("应该返回有效优惠价对象属性discount的数组", () => {
    const coupons = getCoupons();
    coupons.forEach((coupon) => {
      expect(coupon).toHaveProperty("discount");
      expect(typeof coupon.discount).toBe("number");
      expect(coupon.discount).toBeGreaterThan(0);
      expect(coupon.discount).toBeLessThan(1);
    });
  });
});

describe("calculateDiscount", () => {
  it("输入有效参数返回打折后的价格", () => {
    expect(calculateDiscount(10, "SAVE10")).toBe(9);
    expect(calculateDiscount(10, "SAVE20")).toBe(8);
  });
  it("需要处理无效输入参数price", () => {
    expect(calculateDiscount("10", "SAVE10")).toMatch(/invalid/i);
    expect(calculateDiscount(-10, "SAVE10")).toMatch(/invalid/i);
  });
  it("需要处理无效输入参数discount", () => {
    expect(calculateDiscount(10, 10)).toMatch(/invalid/i);
    expect(calculateDiscount(10, "invalid")).toBe(10);
  });
});

describe("validateUserInput", () => {
  it("如果为有效参数 应该返回success", () => {
    expect(validateUserInput("mosh", 20)).toMatch(/success/i);
  });
  it("处理无效username参数", () => {
    expect(validateUserInput(10, 20)).toMatch(/invalid/i);
    expect(validateUserInput("a", 20)).toMatch(/invalid/i);
  });
  it("处理无效age参数", () => {
    expect(validateUserInput("mosh", "18")).toMatch(/invalid/i);
    expect(validateUserInput("mosh", 16)).toMatch(/invalid/i);
  });
  it("如果用户名和年龄都无效 应该返回一个error", () => {
    expect(validateUserInput("", 0)).toMatch(/invalid username/i);
    expect(validateUserInput("", 0)).toMatch(/invalid age/i);
  });
});

describe("isPriceInRange", () => {
  it.each([
    { price: -10, scenario: "price<min", result: false },
    { price: 0, scenario: "price=min", result: true },
    { price: 50, scenario: "min<price<max", result: true },
    { price: 100, scenario: "price=max", result: true },
    { price: 200, scenario: "price>max", result: false },
  ])("如果$scenario return $result", ({ price, result }) => {
    expect(isPriceInRange(price, 0, 100)).toBe(result);
  });
});

describe("isValidUsername", () => {
  const minLength = 5;
  const maxLength = 15;
  it("如果username字符串长度在规定范围内 应该返回true", () => {
    expect(isValidUsername("a".repeat(minLength + 1))).toBe(true);
  });
  it("如果username字符串长度等于最大或最小 应该返回true", () => {
    expect(isValidUsername("a".repeat(minLength))).toBe(true);
    expect(isValidUsername("a".repeat(maxLength))).toBe(true);
  });
  it("如果username字符串长度不在规定范围 应该返回false", () => {
    expect(isValidUsername("a".repeat(maxLength + 1))).toBe(false);
    expect(isValidUsername("a".repeat(minLength - 1))).toBe(false);
  });
  it("如果username输入为无效参数 应该返回false", () => {
    expect(isValidUsername(null)).toBe(false);
    expect(isValidUsername(undefined)).toBe(false);
    expect(isValidUsername(5)).toBe(false);
  });
});

describe("canDrive", () => {
  it("如果没有这个countryCode 应该返回Invalid", () => {
    expect(canDrive(18, "ddd")).toMatch(/invalid/i);
  }),
    it.each([
      { age: 15, country: "US", result: false },
      { age: 16, country: "US", result: true },
      { age: 17, country: "US", result: true },
      { age: 16, country: "UK", result: false },
      { age: 17, country: "UK", result: true },
      { age: 18, country: "UK", result: true },
    ])("对于 $age, $country 应该return $result", ({ age, country, result }) => {
      expect(canDrive(age, country)).toBe(result);
    });
});

describe("Stack", () => {
  let stack;
  beforeEach(() => {
    stack = new Stack();
  });
  it("push应该添加一个item在这个Stack", () => {
    stack.push(1);

    expect(stack.size()).toBe(1);
  });

  it("在栈中删除最顶上一个item", () => {
    stack.push(1);
    stack.push(2);

    const poppedItem = stack.pop();

    expect(poppedItem).toBe(2);
    expect(stack.size()).toBe(1);
  });

  it("如果stack为空 pop应该丢出一个error", () => {
    expect(() => stack.pop()).toThrow(/empty/i);
  });

  it("应该返回最顶上的item,如果stack不为空", () => {
    stack.push(1);
    stack.push(2);

    const peekedItme = stack.peek();

    expect(peekedItme).toBe(2);
    expect(stack.size()).toBe(2);
  });

  it("如果stack为空 peek应该丢出一个error", () => {
    expect(() => stack.peek()).toThrow(/empty/i);
  });

  it("如果stack为空 isEmpty应该返回true", () => {
    expect(stack.isEmpty()).toBe(true);
  });
  it("如果stack不为空 isEmpty应该返回false", () => {
    stack.push(1);
    expect(stack.isEmpty()).toBe(false);
  });
  it("size应该返回栈的长度", () => {
    stack.push(1)
    stack.push(2)
    expect(stack.size()).toBe(2);
  });
  it("clear应该清空栈中所有items", () => {
    stack.push(1);
    stack.push(2);

    stack.clear();

    expect(stack.size()).toBe(0);
  });
});
