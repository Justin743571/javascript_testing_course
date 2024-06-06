import { describe, test, it, expect } from "vitest";
import { fizzBuzz, jiecheng, max } from "../src/intro";

describe("max", () => {
  it("如果第一个参数大，应该返回第一个参数", () => {
    expect(max(2, 1)).toBe(2);
  });
  it("如果第二个参数大，应该返回第二个参数", () => {
    expect(max(1, 2)).toBe(2);
  });
  it("两个参数相同应该返回第一个参数", () => {
    expect(max(1, 1)).toBe(1);
  });
});

describe("fizzBuzz", () => {
  it("如果参数n只可以被3和5整除,返回FizzBuzz", () => {
    expect(fizzBuzz(15)).toBe("FizzBuzz");
  });
  it("如果参数n只可以被3整除,返回Fizz", () => {
    expect(fizzBuzz(9)).toBe("Fizz");
  });
  it("如果参数n只可以被5整除,返回Buzz", () => {
    expect(fizzBuzz(5)).toBe("Buzz");
  });
  it("如果不能被3和5整除,返回一个字符串", () => {
    expect(fizzBuzz(1)).toBe("1");
  });
});


describe("jiecheng",()=>{
    it("如果0的阶乘等于1,返回一",()=>{
        expect(jiecheng(0)).toBe(1)
    })
    it("如果一个数是一个正整数大于0,则返回它的阶乘值",() =>{
        expect(jiecheng(1)).toBe(1)
    })
    it("如果一个数是一个正整数大于0,则返回它的阶乘值",() =>{
        expect(jiecheng(4)).toBe(24)
    })
    it("如果一个数是一个负数,则返回undefined",() =>{
        expect(jiecheng(-1)).toBeUndefined()
    })
})