import { createConnection } from "typeorm";
import { User } from "./entity/User";

describe("db tests", (): void => {
  it("create user", async (): Promise<void> => {
    const connection = await createConnection();
    const user = new User();
    user.firstName = "Timber";
    user.lastName = "Saw";
    user.age = 25;
    await connection.manager.save(user);
  });
});
