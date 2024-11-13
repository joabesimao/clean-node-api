import { Collection } from "mongodb";
import { LogMongoRepository } from "./log";
import { MongoHelper } from "../helpers/mongo-helper";

const makeSut = (): LogMongoRepository => {
  return new LogMongoRepository();
};

describe("Log Mongo Repository", () => {
  let logErrorsCollection: Collection;
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL);
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });

  beforeEach(async () => {
    logErrorsCollection = await MongoHelper.getCollection("errors");
    await logErrorsCollection.deleteMany({});
  });

  test("Should create an error log on success", async () => {
    const sut = makeSut()
    await sut.log("any_error");
    const count = await logErrorsCollection.countDocuments();
    expect(count).toBe(1);
  });
});
