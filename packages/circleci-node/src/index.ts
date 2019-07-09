import "reflect-metadata";
import { createConnection, getConnectionOptions } from "typeorm";
import { User } from "./entity/User";

const createTypeormConn = async () => {
  const connectionOptions = await getConnectionOptions(process.env.NODE_ENV);
  return process.env.NODE_ENV === "production"
    ? createConnection({
        ...connectionOptions,
        url: process.env.DATABASE_URL,
      } as any)
    : createConnection({ ...connectionOptions });
};
createTypeormConn()
  .then(async connection => {
    console.log("Inserting a new user into the database...");
    const user = new User();
    user.firstName = "Timber9";
    user.lastName = "Saw";
    user.age = 25;
    await connection.manager.save(user);
    console.log("Saved a new user with id: " + user.id);

    console.log("Loading users from the database...");
    const users = await connection.manager.find(User);
    console.log("Loaded users: ", users);

    console.log("Here you can setup and run express/koa/any other framework.");
    console.log("test change again");
  })
  .catch(error => console.log(error));
