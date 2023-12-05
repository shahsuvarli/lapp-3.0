import { connection } from "@/utils/db";
import { NextResponse } from "next/server";

export async function POST(req) {
  const { project_id, user_id } = await req.json();

  const request = connection.request();

  await request.query(
    `
      update project set is_active=0, deleted_by=${user_id}, deleted_date=getdate() where project_id=${project_id} and is_active=1

      update quote set is_active=0, deleted_by=${user_id}, deleted_date=getdate() where project_id=${project_id}

      update material_quoted set is_active=0 where permanent_quote_id in (select distinct quote_id
        from quote
        where project_id=${project_id})
    `
  );

  request.cancel();

  try {
    return NextResponse.json({
      message: "Project was deleted successfully!",
    });
  } catch (error) {
    return NextResponse.json({
      message: "Failed to delete the project!",
    });
  }
}
