import { connection } from "@/utils/db";
import { NextResponse } from "next/server";

export async function POST(req) {
  const {
    project_id,
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
    created_date,
    modified_by,
  } = await req.json();

  try {
    const request = connection.request();
    await request.query(
      `
    update project
    set modified_date=getdate(), modified_by=${modified_by}, project_name='${project_name}', ranking=${ranking}, general_contractor=${
        general_contractor ? `'${general_contractor}'` : null
      }, 
    electrical_contractor=${
      electrical_contractor ? `'${electrical_contractor}'` : null
    }, state=${state}, region=${region}, vertical_market=${vertical_market}, 
    status='${status}', won_lost='${won_lost}', channel=${channel}, created_date='${created_date}', notes=${
        notes ? `'${notes}'` : null
      }
    where project_id=${project_id}
    `
    );
    request.cancel();

    return NextResponse.json({
      message: "Project updated successfully!",
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json({
      message: "Project failed to update!",
    });
  }
}
