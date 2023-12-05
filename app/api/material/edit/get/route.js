import { prisma } from "@/utils/_prisma";
import { connection } from "@/utils/db";
import { NextResponse } from "next/server";

export async function POST(req) {
  const { quote_id, version } = await req.json();

  // const request = connection.request();
  // const result1 = await request.query(
  //   `
  //     select * from material_quoted

  //     left join material on material_quoted.material_id=material.material_id
  //     left join material_sales_org on material_sales_org.material_id=material_quoted.material_id and 
  //     where material_quoted.permanent_quote_id=${quote_id} and material_quoted.quote_version=${version} and material_quoted.is_active=1


  //   `
  // );

  const result = await prisma.material_Quoted.findMany({
    where: {
      AND: [
        { permanent_quote_id: Number(quote_id) },
        { quote_version: Number(version) },
        { is_active: true },
      ],
    },
    include: { Material: { include: { Material_Sales_Org: true } } },
  });

  const new_result = result.map((item) => {
    const sales_org = item.Material.Material_Sales_Org[0];
    const material = item.Material;
    return {
      id: item.id,
      material_id: item.material_id,
      quantity: item.quantity,
      uom: sales_org.uom,
      stock_6100: material.stock_6100,
      stock_6120: material.stock_6120,
      stock_6130: material.stock_6130,
      stock_6140: material.stock_6140,
      description: material.description,
      product_family: material.product_family,
      level_5_base_cu: sales_org.level_5_base_cu,
      low_discount: sales_org.low_discount,
      high_discount: sales_org.high_discount,
      average_discount: sales_org.average_discount,
      line_notes: item.line_notes || "",
      discount_percent: item.discount_percent || "",
      copper_base_price: item.copper_base_price || "",
      full_base_price: item.full_base_price || "",
      margin_full_copper: item.margin_full_copper || "",
      line_value: item.line_value || "",
      line_cogs: item.line_cogs || "",
      copper_weight: sales_org.copper_weight || "",
      cost_full_copper: sales_org.cost_full_copper || "",
    };
  });

  return NextResponse.json(new_result);
}
