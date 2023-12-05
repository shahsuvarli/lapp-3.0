import { prisma } from "@/utils/_prisma";
import { NextResponse } from "next/server";

export async function POST(req) {
  const {
    sales_org_id,
    project_name,
    region,
    vertical_market,
    status,
    won_lost,
    value_from,
    value_to,
    cost_from,
    cost_to,
    customer_name,
    sap_id,
    country,
    account_manager,
    dsm,
    date_from,
    date_to,
  } = await req.json();

  const result = await prisma.quote.findMany({
    orderBy: { id: "desc" },
    where: {
      AND: [
        { is_active: true },
        sales_org_id
          ? { Project: { Sales_Org: { sales_org_id: Number(sales_org_id) } } }
          : {},
        project_name
          ? { Project: { project_name: { contains: project_name } } }
          : {},
        region ? { Project: { region: Number(region) } } : {},
        vertical_market
          ? { Project: { vertical_market: Number(vertical_market) } }
          : {},
        status ? { Project: { status } } : {},
        won_lost ? { Project: { won_lost } } : {},
        value_from ? { quote_value: { gte: Number(value_from) } } : {},
        value_to ? { quote_value: { lte: Number(value_to) } } : {},
        cost_from ? { quote_cost: { gte: Number(cost_from) } } : {},
        cost_to ? { quote_cost: { lte: Number(cost_to) } } : {},
        customer_name
          ? { Customer: { customer_name: { contains: customer_name } } }
          : {},
        sap_id ? { Customer: { sap_id: Number(sap_id) } } : {},
        country ? { Customer: { country } } : {},
        account_manager
          ? {
              Project: {
                account_manager: Number(account_manager),
              },
            }
          : {},
        dsm ? { DSM: { dsm_id: Number(dsm) } } : {},
        date_from ? { created_date: { gte: new Date(date_from) } } : {},
        date_to ? { created_date: { lte: new Date(date_to) } } : {},
      ],
    },
    include: {
      Project: {
        include: {
          Sales_Org: true,
          State: true,
          Region: true,
          Vertical_Market: true,
        },
      },
      Customer: true,
    },
  });

  return NextResponse.json(result);
}
