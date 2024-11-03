import { Encrypter } from "../../protocols/encrypter";
import { DbAddAccount } from "./db-add-account";

interface SutTypes {
  sut: DbAddAccount;
  encryptStub: Encrypter;
}

const makeEncryptStub = (): Encrypter => {
  class EncryptStub implements Encrypter {
    async encrypt(value: string): Promise<string> {
      return new Promise((resolve) => resolve("hashed_password"));
    }
  }
  return new EncryptStub();
};

const makeSut = (): SutTypes => {
  const encryptStub = makeEncryptStub();
  const sut = new DbAddAccount(encryptStub);
  return {
    sut,
    encryptStub,
  };
};

describe("DbAddAccount Usecase", () => {
  test("Should call Encrypter with correct password", async () => {
    const { sut, encryptStub } = makeSut();
    const encryptSpy = jest.spyOn(encryptStub, "encrypt");
    const accountData = {
      name: "valid_name",
      email: "valid_email@email.com",
      password: "valid_password",
    };
    sut.add(accountData);
    expect(encryptSpy).toHaveBeenCalledWith("valid_password");
  });
});
