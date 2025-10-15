const { Builder, By, until } = require("selenium-webdriver");
const { expect } = require("chai");
require("chromedriver");

describe("Fridgella Login E2E Test", function () {
  let driver;
  this.timeout(60000);

  before(async () => {
    driver = await new Builder().forBrowser("chrome").build();
  });

  after(async () => {
    if (driver) await driver.quit();
  });

  it("should open homepage", async () => {
    await driver.get("http://localhost:5173");
    const title = await driver.getTitle();
    expect(title).to.include("React");
  });

  it("should login successfully", async () => {
    // Wait for Email input to appear
    const emailInput = await driver.wait(
      until.elementLocated(By.css('input[type="email"]')),
      20000
    );
    await emailInput.sendKeys("test@example.com");

    // Wait for Password input
    const passwordInput = await driver.wait(
      until.elementLocated(By.css('input[type="password"]')),
      10000
    );
    await passwordInput.sendKeys("Password@123");

    // Wait for Login button
    const loginBtn = await driver.wait(
      until.elementLocated(By.xpath("//button[contains(., 'Sign In to Dashboard')]")),
      20000
    );
    await driver.wait(until.elementIsVisible(loginBtn), 5000);

    await loginBtn.click();

    // Wait for navigation to dashboard
    await driver.wait(until.urlContains("/dashboard"), 10000);
    const currentUrl = await driver.getCurrentUrl();
    expect(currentUrl).to.include("/dashboard");
  });
});
