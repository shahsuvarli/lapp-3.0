import { connection } from "@/utils/db";

export default async function getQuotes() {
  const request = connection.request();

  const quotes = await request.query(
    `
      select top 10 quote.*, sales_org.sales_org, project.project_name, project.status, project.won_lost, project.electrical_contractor, state.state_long_name, customer.customer_name, customer.sap_id customer_sap_id, customer.city customer_city, customer.state customer_state, customer.country customer_country, account_manager.account_manager, dsm.dsm, region.region_name, vertical_market.vertical_market_name, emp_created.name emp_name, emp_created.surname emp_surname from quote

      left join project on project.project_id=quote.project_id
      left join sales_org on sales_org.sales_org_id=project.sales_org_id
      left join state on state.state_id=project.state
      left join region on region.region_id=project.region
      left join vertical_market on vertical_market.vertical_market_id=project.vertical_market
      left join customer on customer.sap_id=quote.sap_customer_id
      left join account_manager on account_manager.account_manager_id=quote.account_manager_id
      left join dsm on dsm.dsm_id=quote.dsm_id
      left join employees emp_created on emp_created.employee_id=quote.created_by

      where quote.is_active=1

      order by id desc
    `
  );

  const dsm = await request.query(`select * from dsm`);
  const region = await request.query(`select * from region`);
  const vertical_market = await request.query(`select * from vertical_market`);
  const state = await request.query(`select * from state`);
  const sales_org = await request.query(`select * from sales_org`);
  const account_manager = await request.query(`select * from account_manager`);

  return {
    quotes: JSON.parse(JSON.stringify(quotes.recordset)),
    state: JSON.parse(JSON.stringify(state.recordset)),
    sales_org: JSON.parse(JSON.stringify(sales_org.recordset)),
    account_manager: JSON.parse(JSON.stringify(account_manager.recordset)),
    region: JSON.parse(JSON.stringify(region.recordset)),
    dsm: JSON.parse(JSON.stringify(dsm.recordset)),
    vertical_market: JSON.parse(JSON.stringify(vertical_market.recordset)),
    state: JSON.parse(JSON.stringify(state.recordset)),
  };
}
