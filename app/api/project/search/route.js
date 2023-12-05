import { connection } from "@/utils/db";
import { NextResponse } from "next/server";

export async function POST(req) {
  const {
    sales_org_id,
    project_name,
    ranking,
    general_contractor,
    electrical_contractor,
    region,
    state,
    vertical_market,
    won_lost,
    status,
    channel,
    notes,
    date_from,
    date_to,
  } = await req.json();

  try {
    const request = connection.request();
    const result = await request.query(`
  SELECT
  project.*, so.sales_org, re.region_name, ch.channel_name, vm.vertical_market_name, st.state_long_name, em_cr.name cr_name, em_cr.surname cr_surname, em_mo.name mo_name, em_mo.surname mo_surname
  
FROM project

    LEFT JOIN sales_org so ON project.sales_org_id=so.sales_org_id
    LEFT JOIN region re ON project.region=re.region_id
    LEFT JOIN channel ch ON project.channel=ch.channel_id
    LEFT JOIN vertical_market vm ON project.vertical_market=vm.vertical_market_id
    LEFT JOIN state st ON project.state=st.state_id
    LEFT JOIN employees em_cr ON project.created_by=em_cr.employee_id
    LEFT JOIN employees em_mo ON project.modified_by=em_mo.employee_id

  WHERE project.is_active=1 ${
    project_name ? `AND project.project_name LIKE '%${project_name}%'` : ""
  }
  ${sales_org_id ? `AND project.sales_org_id=${sales_org_id}` : ""}
  ${ranking ? `AND project.ranking=${ranking}` : ""}
  ${
    general_contractor
      ? `AND project.general_contractor LIKE '%${general_contractor}%'`
      : ""
  }
  ${
    electrical_contractor
      ? `AND project.electrical_contractor LIKE '%${electrical_contractor}%'`
      : ""
  }
  ${region ? `AND project.region=${region}` : ""}
  ${state ? `AND project.state=${state}` : ""}
  ${vertical_market ? `AND project.vertical_market=${vertical_market}` : ""}
  ${won_lost ? `AND project.won_lost='${won_lost}'` : ""}
  ${status ? `AND project.status='${status}'` : ""}
  ${channel ? `AND project.channel='${channel}'` : ""}
  ${notes ? `AND project.notes like '%${notes}%'` : ""}
  ${date_from ? `AND project.created_date>='${date_from}'` : ""}
  ${date_to ? `AND project.created_date<='${date_to}'` : ""}

  ORDER BY project.project_id DESC
  `);

    return NextResponse.json({
      data: result.recordset,
      message: "Project list updated successfully!",
    });
  } catch (error) {
    return NextResponse.json({ message: "Failed to update the project list!" });
  }
}
