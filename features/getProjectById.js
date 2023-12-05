import { connection } from "@/utils/db";

export default async function getProjectById(params) {
  const request = connection.request();
  const projectQuery = await request.query(
    `
    select top 1 pr.*,
    created.name created_name, created.surname created_surname,
    modified.name modified_name, modified.surname modified_surname from project pr
    left join employees as created on pr.created_by=created.employee_id
    left join employees as modified on pr.modified_by=modified.employee_id
    where pr.project_id='${params}'
    `
  );

  const project = projectQuery.recordset[0];
  const project_competitors = await request.query(
    `
    select * from project_competitor where project_id=${params} and is_active=1
    `
  );
  const project_sap_orders = await request.query(
    `
    select project_id, sap_order_id from project_sap_order where project_id=${params} and is_active=1
    `
  );
  const quotes = await request.query(
    `
    select quote.*, customer.customer_name, account_manager.account_manager, dsm.dsm from quote
    left join customer on quote.sap_customer_id=customer.sap_id
    left join account_manager on quote.account_manager_id=account_manager.account_manager_id
    left join dsm on quote.dsm_id=dsm.dsm_id
    where quote.project_id=${project.project_id} and quote.is_active=1
    order by quote.quote_id desc, quote.quote_version desc
    `
  );
  const sales_org = await request.query(`select * from sales_org`);
  const vertical_market = await request.query(`select * from vertical_market`);
  const channel = await request.query(`select * from channel`);
  const region = await request.query(
    `select * from region where sales_org_id=${project.sales_org_id} and is_active=1`
  );
  const state = await request.query(
    `select * from state where sales_org_id=${project.sales_org_id}`
  );

  const competitors = await request.query(
    `select * from competitor where sales_org_id=${project.sales_org_id}`
  );

  const customer = await request.query("select * from customer");
  request.cancel();
  return {
    project: JSON.parse(JSON.stringify(project)),
    project_competitors: JSON.parse(
      JSON.stringify(project_competitors.recordset)
    ),
    project_sap_orders: JSON.parse(
      JSON.stringify(project_sap_orders.recordset)
    ),
    quotes: JSON.parse(JSON.stringify(quotes.recordset)),
    sales_org: JSON.parse(JSON.stringify(sales_org.recordset)),
    vertical_market: JSON.parse(JSON.stringify(vertical_market.recordset)),
    channel: JSON.parse(JSON.stringify(channel.recordset)),
    region: JSON.parse(JSON.stringify(region.recordset)),
    state: JSON.parse(JSON.stringify(state.recordset)),
    competitors: JSON.parse(JSON.stringify(competitors.recordset)),
    customer: JSON.parse(JSON.stringify(customer.recordset)),
  };
}
