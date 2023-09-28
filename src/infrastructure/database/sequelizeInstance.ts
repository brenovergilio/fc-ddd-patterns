import { Sequelize } from "sequelize-typescript";

const inMemorySequelizeInstance = new Sequelize({
  dialect: "sqlite",
  storage: ":memory:",
  logging: false,
  sync: { force: true },
});

export { inMemorySequelizeInstance };