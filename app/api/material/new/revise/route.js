import { prisma } from "@/utils/_prisma";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
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

    // get the most recent quote
    const mostRecentQuote = await prisma.quote.findFirst({
      where: { quote_id: Number(quote.quote_id) },
      orderBy: { quote_version: "desc" },
    });

    // get the most recent quote version and increase it by 1
    const newlyCreatedVersion = Number(mostRecentQuote.quote_version) + 1;

    // replace with current quote data
    const {
      quote_id,
      project_id,
      sap_quote_id,
      sap_customer_id,
      created_by,
      modified_by,
      created_date,
      modified_date,
      account_manager_id,
      dsm_id,
      copper_rate,
      notes,
    } = quote;

    const newQuoteData = {
      quote_id,
      project_id,
      sap_quote_id,
      sap_customer_id,
      quote_version: newlyCreatedVersion,
      created_by,
      modified_by,
      created_date,
      modified_date,
      account_manager_id,
      dsm_id,
      copper_rate,
      notes,
    };

    // create quote with new version
    const newQuote = await prisma.quote.create({
      data: newQuoteData,
    });

    // get material_quoted data with current version
    const quoteMaterials = await prisma.material_Quoted.findMany({
      where: {
        permanent_quote_id: Number(quote.quote_id),
        quote_version: Number(quote.quote_version),
        is_active: true,
      },
    });

    // combine with newly added data
    const combinedMaterialsQuoted = [...quoteMaterials, ...newDataArray];

    // announce variables to use later
    let value = 0,
      cogs = 0,
      margin = 0;

    // update all versions to the new one
    const updatedMaterials = combinedMaterialsQuoted.map((item) => {
      value = Number(item.line_value) + value;
      cogs = Number(item.line_cogs) + cogs;
      margin = Number(item.discount_percent) + margin;

      const { id, is_manual_overwrite, quote_version, ...rest } = item;
      return {
        ...rest,
        quote_version: newQuote.quote_version,
      };
    });

    margin = margin / updatedMaterials.length;

    // update the quote with new value, cost, margin values
    await prisma.quote.update({
      where: { id: Number(newQuote.id) },
      data: { quote_value: value, quote_cost: cogs, quote_margin: margin },
    });

    // create many updated materials
    await prisma.material_Quoted.createMany({
      data: updatedMaterials,
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

    return NextResponse.json(newQuote);
  } catch (error) {
    throw new Error(error);
  }
}
