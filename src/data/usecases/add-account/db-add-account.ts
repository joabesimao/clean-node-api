import {
  AccountModel,
  AddAccount,
  AddAccountModel,
  Encrypter,
  AddAccountRepository,
} from "./db-add-account-protocols";

export class DbAddAccount implements AddAccount {
  constructor(
    private readonly encrypter: Encrypter,
    private readonly addAccountRepository: AddAccountRepository
  ) {}
  async add(account: AddAccountModel): Promise<AccountModel> {
    const passwordHashed = await this.encrypter.encrypt(account.password);
    const result = await this.addAccountRepository.add(
      Object.assign({}, account, { password: passwordHashed })
    );
    return result;
  }
}
