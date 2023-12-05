import sql from "mssql";
import { config } from "./config";

export const connection = await sql.connect(config).then((resolve) => {
  return resolve;
});
