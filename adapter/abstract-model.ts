import type { Connection } from "mysql2/promise";

export class AbstractModel {
  connection: Connection | undefined;

  setConnection(connection: Connection) {
    this.connection = connection;
  }
}