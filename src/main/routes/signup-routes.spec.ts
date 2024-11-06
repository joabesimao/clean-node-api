import request from "supertest";
import { MongoHelper } from "../../infra/db/mongo-db/helpers/mongo-helper";
import app from "../config/app";

describe("Signup Routes ", () => {
  beforeAll(async () => {
    await MongoHelper.connect(global.__MONGO_URI__);
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });

  beforeEach(async () => {
    const accountCollection = MongoHelper.getCollection("accounts");
    await accountCollection.deleteMany({});
  });
  test("Should return an account on success", async () => {
    await request(app)
      .post("/api/signup")
      .send({
        name: "Joabe",
        email: "joabe.simao@gmail.com",
        pasword: "123",
        passwordConfirmation: "123",
      })
      .expect(200);
  });
});
