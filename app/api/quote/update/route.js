import { connection } from "@/utils/db";
import { NextResponse } from "next/server";

export async function POST(req) {
  const {
    values: {
      id,
      sap_customer_id,
      account_manager_id,
      dsm_id,
      copper_rate,
      sap_quote_id,
      notes,
    },
    user_id,
  } = await req.json();

  try {
    const request = connection.request();
    await request.query(
      `
        update quote 
        set modified_date=getdate(), modified_by=${user_id}, sap_customer_id=${sap_customer_id}, account_manager_id=${account_manager_id},
        dsm_id=${dsm_id}, copper_rate=${copper_rate}, sap_quote_id=${sap_quote_id}, notes=${
        notes ? `'${notes}'` : null
      }
        where id=${id}
      `
    );
    request.cancel();

    return NextResponse.json({
      message: "Quote updated successfully!",
    });
  } catch (error) {
    return NextResponse.json({ error });
  }
}
