import { EmailValidatorAdapter } from "./email-validator-adapter";
import validator from "validator";

jest.mock("validator", () => ({
  isEmail(): boolean {
    return true;
  },
}));

describe("EmailValidator Adapter", () => {
  test("Should return false if validator return false", async () => {
    const sut = new EmailValidatorAdapter();
    jest.spyOn(validator, "isEmail").mockReturnValueOnce(false);
    const isValid = sut.isValid("invalid_email@email.com");
    expect(isValid).toBe(false);
  });
  test("Should return true if validator return true", async () => {
    const sut = new EmailValidatorAdapter();
    const isValid = sut.isValid("valid_email@email.com");
    expect(isValid).toBe(true);
  });
});
