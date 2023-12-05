import { prisma } from "@/utils/_prisma";
import { connection } from "@/utils/db";
import { NextResponse } from "next/server";

export async function POST(req) {
  const { customer_name, sap_id, country, state, city } = await req.json();

  try {
    const request = connection.request();
    const result = await request.query(
      `select * from customer where sap_id is not null
    ${customer_name ? `and customer_name like '%${customer_name}%'` : ""}
    ${sap_id ? `and sap_id=${sap_id}` : ""}
    ${country ? `and country='${country}'` : ""}
    ${state ? `and state='${state}'` : ""}
    ${city ? `and city='${city}'` : ""}
    `
    );
    request.cancel();

    return NextResponse.json({
      result: result.recordset,
      message: "Customer list updated!",
    });
  } catch (error) {
    return NextResponse.json({
      message: "Failed to update the customer list!",
    });
  }
}
