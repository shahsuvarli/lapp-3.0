import { connection } from "@/utils/db";
import { NextResponse } from "next/server";

export async function POST(req) {
  const {
    sales_org_id,
    project_name,
    region,
    vertical_market,
    status,
    won_lost,
    value_from,
    value_to,
    cost_from,
    cost_to,
    customer_name,
    sap_id,
    country,
    account_manager,
    dsm,
    date_from,
    date_to,
  } = await req.json();

  try {
    const request = connection.request();

    const result = await request.query(
      ` 
      select quote.*, project.project_name, state.state_long_name, project.status, project.won_lost, customer.customer_name,
      customer.sap_id customer_sap_id, customer.country customer_country, customer.city customer_city, customer.state customer_state,
      project.electrical_contractor, account_manager.account_manager, dsm.dsm, region.region_name, vertical_market.vertical_market_name,
       sales_org.sales_org, employees.name emp_name, employees.surname emp_surname
       
       from quote

      left join project on project.project_id=quote.project_id
      left join sales_org on sales_org.sales_org_id=project.sales_org_id
      left join state on state.state_id=project.state
      left join region on region.region_id=project.region
      left join vertical_market on vertical_market.vertical_market_id=project.vertical_market
      left join customer on customer.sap_id=quote.sap_customer_id
      left join account_manager on account_manager.account_manager_id=quote.account_manager_id
      left join dsm on dsm.dsm_id=quote.dsm_id
      left join employees on employees.employee_id=quote.created_by

      where quote.is_active=1 ${
        sales_org_id ? `and sales_org.sales_org_id=${sales_org_id}` : ""
      }  ${
        project_name ? `and project.project_name like '%${project_name}%'` : ""
      }  ${region ? `and region.region_id=${region}` : ""} ${
        vertical_market
          ? `and vertical_market.vertical_market_id=${vertical_market}`
          : ""
      } ${status ? `and project.status='${status}'` : ""} ${
        won_lost ? `and project.won_lost='${won_lost}'` : ""
      } ${value_from ? `and quote.quote_value>=${value_from}` : ""} 
    ${value_to ? `and quote.quote_value<=${value_to}` : ""} 
    ${cost_from ? `and quote.quote_cost>=${cost_from}` : ""} 
    ${cost_to ? `and quote.quote_cost<=${cost_to}` : ""} 
    ${
      customer_name
        ? `and customer.customer_name like '%${customer_name}%'`
        : ""
    } 
    ${sap_id ? `and customer.sap_id=${sap_id}` : ""} 
    ${country ? `and customer.country='${country}'` : ""} 
    ${account_manager ? `and project.account_manager=${account_manager}` : ""} 
    ${dsm ? `and dsm.dsm_id=${dsm}` : ""} 
    ${date_from ? `and quote.created_date>='${date_from}'` : ""} 
    ${date_to ? `and quote.created_date<='${date_to}'` : ""} 

    order by id desc
  `
    );

    return NextResponse.json({
      data: result.recordset,
      message: "Quote list updated successfully!",
    });
  } catch (error) {
    return NextResponse.json({ message: "Failed to update the quote list!" });
  }
}
