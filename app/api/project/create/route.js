import { connection } from "@/utils/db";
import { NextResponse } from "next/server";

export async function POST(req) {
  const {
    values: {
      sales_org_id,
      project_name,
      ranking,
      general_contractor,
      electrical_contractor,
      state,
      region,
      vertical_market,
      status,
      won_lost,
      channel,
      notes,
    },
    user_id,
  } = await req.json();

  try {
    const request = connection.request();

    await request.query(
      `
      insert into project(sales_org_id, project_name, ranking, general_contractor, electrical_contractor, state, region, vertical_market, status, won_lost, channel, created_date, notes, created_by, modified_by, modified_date)

      values(${sales_org_id}, '${project_name}', ${ranking}, ${
        general_contractor ? `${general_contractor}` : null
      }, ${
        electrical_contractor ? `${electrical_contractor}` : null
      }, ${state}, ${region}, ${vertical_market}, '${status}', '${won_lost}', ${channel}, getdate(), ${
        notes ? `${notes}` : null
      }, ${user_id}, ${user_id}, getdate())
    `
    );

    request.cancel();

    return NextResponse.json({
      message: "Project was created successfully!",
    });
  } catch (error) {
    return NextResponse.json({
      message: "Failed to create a project!!",
    });
  }
}
