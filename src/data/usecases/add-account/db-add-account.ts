import { AccountModel } from "../../../domain/models/account-model";
import {
  AddAccount,
  AddAccountModel,
} from "../../../domain/usecases/add-account";
import { Encrypter } from "../../protocols/encrypter";

export class DbAddAccount implements AddAccount {
  constructor(private readonly encrypter: Encrypter) {}
  async add(account: AddAccountModel): Promise<AccountModel> {
    const passwordHashed = await this.encrypter.encrypt(account.password);
    return null;
  }
}
