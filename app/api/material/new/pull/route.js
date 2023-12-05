import { prisma } from "@/utils/_prisma";
import { NextResponse } from "next/server";

export async function POST(req) {
  const materialData = await req.json();
  const arrayOfIds = materialData.map((item) => item.material_id.toUpperCase());
  const result = [];

  const foundMaterials = await prisma.material.findMany({
    where: { material_id: { in: arrayOfIds } },
    include: { Material_Sales_Org: true },
  });
  const updatedFoundMaterials = foundMaterials.map((item) => {
    const materialSalesOrg = item.Material_Sales_Org.find(
      (item) => (item.sales_org_id = 6100)
    );
    delete item.Material_Sales_Org;
    return {
      ...item,
      uom: materialSalesOrg.uom || "",
      level_5_base_cu: Number(materialSalesOrg.level_5_base_cu) || "",
      low_discount: Number(materialSalesOrg.low_discount) || "",
      high_discount: Number(materialSalesOrg.high_discount) || "",
      average_discount: Number(materialSalesOrg.average_discount) || "",
      copper_base_price: Number(materialSalesOrg.copper_base_price) || "",
      full_base_price: Number(materialSalesOrg.full_base_price) || "",
      margin_full_copper: Number(materialSalesOrg.margin_full_copper) || "",
      line_value: Number(materialSalesOrg.line_value) || "",
      line_cogs: Number(materialSalesOrg.line_cogs) || "",
      copper_weight: Number(materialSalesOrg.copper_weight) || "",
      cost_full_copper: Number(materialSalesOrg.cost_full_copper) || "",
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
  return NextResponse.json(newRes);
}
