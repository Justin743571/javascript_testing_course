import { vi, it, expect, describe, beforeEach } from "vitest";
import {
  getDiscount,
  getPriceInCurrency,
  getShippingInfo,
  isOnline,
  login,
  renderPage,
  signUp,
  submitOrder,
} from "../src/mocking";
import { getExchangeRate } from "../src/libs/currency";
import { getShippingQuote } from "../src/libs/shipping";
import { trackPageView } from "../src/libs/analytics";
import { charge } from "../src/libs/payment";
import { sendEmail } from "../src/libs/email";
import security from "../src/libs/security";

vi.mock("../src/libs/currency");
vi.mock("../src/libs/shipping");
vi.mock("../src/libs/analytics");
vi.mock("../src/libs/payment");
vi.mock("../src/libs/email", async (importOriginal) => {
  const originalModule = await importOriginal();
  return {
    ...originalModule,
    sendEmail: vi.fn(),
  };
});

describe("getPriceInCurrency", () => {
  it("输入目标货币 应该返回price", () => {
    vi.mocked(getExchangeRate).mockReturnValue(1.5);
    const price = getPriceInCurrency(10, "AUD");

    expect(price).toBe(15);
  });
});

describe("getShippingInfo", () => {
  it("如果目的地无法获取 应该返回无法发货", () => {
    vi.mocked(getShippingQuote).mockReturnValue(null);
    const result = getShippingInfo("London");
    expect(result).toMatch(/unavailable/i);
  });
  it("输入目的地能够被获取 返回运费花费和运输时间", () => {
    vi.mocked(getShippingQuote).mockReturnValue({ cost: 20, estimatedDays: 2 });
    const result = getShippingInfo("London");
    expect(result).toMatch("$20");
    expect(result).toMatch(/2 days/i);
  });
});

describe("renderPage", () => {
  it("should return correct content", async () => {
    const result = await renderPage();

    expect(result).toMatch(/content/i);
  });
  it("should call analytic", async () => {
    await renderPage();

    expect(trackPageView).toHaveBeenCalledWith("/home");
  });
});

describe("submitOrder", () => {
  it("如果收费成功 应该返回success", async () => {
    vi.mocked(charge).mockReturnValue({ status: "success" });
    const result = await submitOrder(123, 312);
    expect(charge).toHaveBeenCalled();
    expect(result).toMatchObject({ success: true });
  });
  it("如果收费失败 应该返回error", async () => {
    vi.mocked(charge).mockReturnValue({ status: "failed" });
    const result = await submitOrder(123, 1231);
    expect(result).toMatchObject({ success: false, error: "payment_error" });
  });
});

describe("signUp", () => {
  const email = "1234@domain.com";
  it("如果email无效 返回false", async () => {
    const result = await signUp("a");
    expect(result).toBe(false);
  });
  it("如果email有效 返回true", async () => {
    const result = await signUp(email);
    expect(result).toBe(true);
  });
  it("确保sendEmail函数正常被调用了", async () => {
    await signUp(email);

    expect(sendEmail).toHaveBeenCalledOnce();
    const args = vi.mocked(sendEmail).mock.calls[0];
    expect(args[0]).toBe(email);
    expect(args[1]).toMatch(/welcome/i);
  });
});

describe("login", () => {
  it("确认sendEmail是否被调用和需要code代码", async () => {
    const email = "name@domian.com";
    const spy = vi.spyOn(security, "generateCode");

    await login(email);

    const securityCode = spy.mock.results[0].value.toString();
    expect(sendEmail).toHaveBeenCalledWith(email, securityCode);
  });
});

describe("isOnline", () => {
  it("如果不在开放时间 则返回false", () => {
    vi.setSystemTime("2024-01-01 07:59");
    expect(isOnline()).toBe(false);

    vi.setSystemTime("2024-01-01 20:01");
    expect(isOnline()).toBe(false);
  });
  it("如果在开放时间 则返回true", () => {
    vi.setSystemTime("2024-01-01 08:00");
    expect(isOnline()).toBe(true);

    vi.setSystemTime("2024-01-01 19:59");
    expect(isOnline()).toBe(true);
  });
});

describe("getDiscount", () => {
  it("如果是圣诞节 打八折", () => {
    vi.setSystemTime("2024-12-25 00:01");
    expect(getDiscount()).toBe(0.2);

    vi.setSystemTime("2024-12-25 23:59");
    expect(getDiscount()).toBe(0.2);
  });
  it("如果是圣诞节 不打折", () => {
    vi.setSystemTime("2024-12-24 23:59");
    expect(getDiscount()).toBe(0);

    vi.setSystemTime("2024-12-26 00:01");
    expect(getDiscount()).toBe(0);
  });
});


