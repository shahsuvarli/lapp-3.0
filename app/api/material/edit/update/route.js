import { prisma } from "@/utils/_prisma";
import { NextResponse } from "next/server";

export async function POST(req) {
  const data = await req.json();
  const newMaterials = data.values;
  const quote = data.quote;

  const newDataArray = newMaterials.map((item) => {
    return {
      material_id: item.material_id,
      quantity: item.quantity,
      line_notes: item.line_notes || null,
      discount_percent: item.discount_percent || null,
      copper_base_price: item.copper_base_price || null,
      full_base_price: item.full_base_price || null,
      margin_full_copper: item.margin_full_copper || null,
      line_value: item.line_value || null,
      line_cogs: item.line_cogs || null,
      permanent_quote_id: quote.quote_id,
      quote_version: quote.quote_version,
    };
  });

  try {
    await prisma.material_Quoted.updateMany({
      where: {
        permanent_quote_id: Number(quote.quote_id),
        quote_version: Number(quote.quote_version),
        is_active: true,
      },
      data: { is_active: false },
    });

    if (newDataArray.length) {
      await prisma.material_Quoted.createMany({
        data: newDataArray,
      });
    }

    const allMaterials = await prisma.material_Quoted.findMany({
      where: {
        permanent_quote_id: Number(quote.quote_id),
        quote_version: Number(quote.quote_version),
        is_active: true,
      },
    });

    let value = 0,
      cogs = 0,
      margin = 0;

    allMaterials.map(({ line_cogs, line_value, discount_percent }) => {
      value = Number(line_value) + value;
      cogs = Number(line_cogs) + cogs;
      margin = Number(discount_percent) + margin;
    });

    margin = margin / allMaterials.length;

    await prisma.quote.update({
      where: { id: Number(quote.id) },
      data: { quote_value: value, quote_cost: cogs, quote_margin: margin },
    });

    const distinctQuotes = await prisma.quote.findMany({
      where: { project_id: Number(quote.project_id), is_active: true },
      distinct: ["quote_id"],
      orderBy: [
        {
          quote_id: "desc",
        },
        {
          quote_version: "desc",
        },
      ],
    });

    let project_value = 0,
      project_cogs = 0,
      project_margin = 0;

    distinctQuotes.map(({ quote_value, quote_cost, quote_margin }) => {
      project_value = Number(quote_value) + project_value;
      project_cogs = Number(quote_cost) + project_cogs;
      project_margin = Number(quote_margin) + project_margin;
    });

    project_margin = project_margin / distinctQuotes.length;

    await prisma.project.update({
      where: { project_id: Number(quote.project_id) },
      data: {
        total_value: project_value,
        total_cost: project_cogs,
        total_margin: project_margin,
      },
    });

    return NextResponse.json(true);
  } catch (error) {
    throw new Error(error);
  }
}
