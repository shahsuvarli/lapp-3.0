import { connection } from "@/utils/db";
import { NextResponse } from "next/server";

export async function POST(req) {
  const { quote_id, quote_version } = await req.json();

  try {
    const request = connection.request();
    const result = await request.query(
      `
      select material_quoted.*, material_sales_org.uom, material.stock_6100, material.stock_6120, material.stock_6130, material.stock_6140,
      material.description, material.product_family, material_sales_org.level_5_base_cu, material_sales_org.low_discount, material_sales_org.high_discount, material_sales_org.average_discount, material_sales_org.copper_weight, material_sales_org.cost_full_copper

      from material_quoted

      left join material on material_quoted.material_id=material.material_id
      left join material_sales_org on material_sales_org.material_id=material_quoted.material_id 
 
      where permanent_quote_id=${quote_id} and quote_version=${quote_version} and is_active=1
    `
    );

    const new_result = result.recordset.map((item) => {
      return {
        id: item.id,
        material_id: item.material_id,
        quantity: item.quantity,
        uom: item.uom,
        stock_6100: item.stock_6100,
        stock_6120: item.stock_6120,
        stock_6130: item.stock_6130,
        stock_6140: item.stock_6140,
        description: item.description,
        product_family: item.product_family,
        level_5_base_cu: item.level_5_base_cu,
        low_discount: item.low_discount,
        high_discount: item.high_discount,
        average_discount: item.average_discount,
        line_notes: item.line_notes || "",
        discount_percent: item.discount_percent || "",
        copper_base_price: item.copper_base_price || "",
        full_base_price: item.full_base_price || "",
        margin_full_copper: item.margin_full_copper || "",
        line_value: item.line_value || "",
        line_cogs: item.line_cogs || "",
        copper_weight: item.copper_weight || "",
        cost_full_copper: item.cost_full_copper || "",
      };
    });

    return NextResponse.json({
      data: new_result,
      message: "Material list updated successfully!",
    });
  } catch (error) {
    return NextResponse.json({ message: "Failed to get material list!" });
  }
}
