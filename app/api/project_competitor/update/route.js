import { connection } from "@/utils/db";
import { NextResponse } from "next/server";

export async function POST(req) {
  const { project_id, ids, user_id } = await req.json();

  const formattedArray = ids.map((id) => `(${project_id}, ${id})`);
  const values = formattedArray.join(",");
  const insert_query = ids.length
    ? `insert into project_competitor(project_id, competitor_id) values ${values}`
    : "";

  try {
    const request = connection.request();
    await request.query(
      `
        update project_competitor set is_active=0, deleted_by=${user_id}, deleted_date=getdate()
        where is_active=1 and project_id=${project_id}

        ${insert_query}
    `
    );
    request.cancel();

    return NextResponse.json({
      message: "Competitors updated successfully!",
    });
  } catch (error) {
    return NextResponse.json({
      message: "Competitors failed to update!",
    });
  }
}
