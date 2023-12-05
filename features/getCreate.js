import { connection } from "@/utils/db";

export default async function getCreate() {
  const request = connection.request();
  const sales_org = await request.query("select * from sales_org");
  const vertical_market = await request.query("select * from vertical_market");
  const channel = await request.query("select * from channel");
  const region = await request.query("select * from region");
  const state = await request.query("select * from state");
  request.cancel();

  return {
    sales_org: JSON.parse(JSON.stringify(sales_org.recordset)),
    vertical_market: JSON.parse(JSON.stringify(vertical_market.recordset)),
    channel: JSON.parse(JSON.stringify(channel.recordset)),
    region: JSON.parse(JSON.stringify(region.recordset)),
    state: JSON.parse(JSON.stringify(state.recordset)),
  };
}
