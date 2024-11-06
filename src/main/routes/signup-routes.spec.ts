import request from "supertest";
import app from "../config/app";

describe("Signup Routes ", () => {
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
