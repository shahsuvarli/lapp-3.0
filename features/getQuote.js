import { connection } from "@/utils/db";

export default async function getQuote(id) {
  const request = connection.request();

  const customer = await request.query(`select * from customer`);

  const quote = await request.query(
    `
    select quote.*, customer.customer_name, customer.country customer_country, customer.city customer_city, customer.state customer_state, 
    em_created.name created_name, em_created.surname created_surname, em_modified.name modified_name, em_modified.surname modified_surname
    from quote
    
    left join customer on customer.sap_id=quote.sap_customer_id
    left join employees em_created on em_created.employee_id=quote.created_by
    left join employees em_modified on em_modified.employee_id=quote.modified_by
    left join account_manager on account_manager.account_manager_id = quote.account_manager_id
    left join dsm on dsm.dsm_id=quote.dsm_id

    where quote.id=${id}
    `
  );

  const project = await request.query(
    `select * from project where project_id=${quote.recordset[0].project_id}`
  );

  const sales_org = await request.query(`select * from sales_org`);

  const account_manager = await request.query(
    `select * from account_manager where sales_org_id=${project.recordset[0].sales_org_id}`
  );

  const dsm = await request.query(
    `select * from dsm where sales_org_id=${project.recordset[0].sales_org_id}`
  );

  const materials = await request.query(
    `
    select material_quoted.*, material_sales_org.uom, material.stock_6100, material.stock_6120, material.stock_6130, material.stock_6140,
    material.description, material.product_family, material_sales_org.level_5_base_cu, material_sales_org.low_discount, material_sales_org.high_discount, material_sales_org.average_discount, material_sales_org.copper_weight, material_sales_org.cost_full_copper

    from material_quoted
      
      left join material on material.material_id=material_quoted.material_id
      left join material_sales_org on material_sales_org.material_id=material.material_id

      where material_quoted.permanent_quote_id=${quote.recordset[0].quote_id}
      and material_quoted.quote_version=${quote.recordset[0].quote_version}
      and material_quoted.is_active=1
    `
  );

  return {
    customer: JSON.parse(JSON.stringify(customer.recordset)),
    quote: JSON.parse(JSON.stringify(quote.recordset[0])),
    project: JSON.parse(JSON.stringify(project.recordset)),
    sales_org: JSON.parse(JSON.stringify(sales_org.recordset)),
    account_manager: JSON.parse(JSON.stringify(account_manager.recordset)),
    dsm: JSON.parse(JSON.stringify(dsm.recordset)),
    materials: JSON.parse(JSON.stringify(materials.recordset)),
  };
}
