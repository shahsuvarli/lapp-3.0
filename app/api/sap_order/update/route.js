import { connection } from "@/utils/db";
import { NextResponse } from "next/server";

export async function POST(req) {
  const {
    sap_order_1,
    sap_order_2,
    sap_order_3,
    sap_order_4,
    sap_order_5,
    sap_order_6,
    project_id,
    user_id,
  } = await req.json();

  const sap_orders = [
    sap_order_1,
    sap_order_2,
    sap_order_3,
    sap_order_4,
    sap_order_5,
    sap_order_6,
  ].filter(Number);

  const formattedArray = sap_orders.map((id) => `(${project_id}, ${id})`);
  const values = formattedArray.join(",");
  const insert_query = sap_orders.length
    ? `insert into project_sap_order(project_id, sap_order_id) values ${values}`
    : "";

  try {
    const request = connection.request();
    await request.query(
      `
    update project_sap_order set is_active=0, deleted_by=${user_id}, deleted_date=getdate()
    where is_active=1 and project_id=${project_id}

    ${insert_query}
    `
    );
    request.cancel();

    return NextResponse.json({
      message: "SAP orders updated successfully!",
    });
  } catch (error) {
    return NextResponse.json({
      message: "SAP orders failed to update!",
    });
  }
}
