import { connection } from "@/utils/db";
import { NextResponse } from "next/server";

export async function POST(req) {
  const materialData = await req.json();

  const arrayOfIds = materialData.map((item) => item.material_id.toUpperCase());
  const result = [];

  const concatenatedString = `('${materialData
    .map((item) => item.material_id)
    .join("', '")}')`;

  try {
    const request = connection.request();

    const result1 = await request.query(
      `
      select material.*, material_sales_org.uom, material_sales_org.level_5_base_cu, material_sales_org.low_discount, material_sales_org.high_discount, material_sales_org.average_discount, material_sales_org.copper_weight, material_sales_org.cost_full_copper from material

      left join material_sales_org on material_sales_org.material_id=material.material_id and material_sales_org.sales_org_id=material.sales_org_id

      where material.material_id in ${concatenatedString}
    `
    );

    const updatedFoundMaterials = result1.recordset.map((item) => {
      return {
        ...item,
        uom: item.uom || "",
        level_5_base_cu: item.level_5_base_cu || "",
        low_discount: item.low_discount || "",
        high_discount: item.high_discount || "",
        average_discount: item.average_discount || "",
        copper_base_price: item.copper_base_price || "",
        full_base_price: item.full_base_price || "",
        margin_full_copper: item.margin_full_copper || "",
        line_value: item.line_value || "",
        line_cogs: item.line_cogs || "",
        copper_weight: item.copper_weight || "",
        cost_full_copper: item.cost_full_copper || "",
      };
    });

    const idsOfFoundMaterials = updatedFoundMaterials.map((item) =>
      item.material_id.toUpperCase()
    );

    for (const i in arrayOfIds) {
      let value = arrayOfIds[i]; //arrayOfIds = ['X',a','b','d',' ','X','a']
      const index = idsOfFoundMaterials.indexOf(value); //['a','b','c']
      if (index === -1) {
        result.push({ ...materialData[i], found: false }); //
      } else {
        const foundMaterial = {
          ...updatedFoundMaterials[index],
          quantity: materialData[i].quantity,
          line_notes: materialData[i].line_notes,
          discount_percent: materialData[index].discount_percent,
          found: true,
        };
        result.push(foundMaterial);
      }
    }

    const newRes = result.map((item, index) => ({ ...item, id: index }));
    return NextResponse.json({
      data: newRes,
      message: "New materials successfully added!",
    });
  } catch (error) {
    return NextResponse.json(error);
  }
}
