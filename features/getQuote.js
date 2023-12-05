import { prisma } from "@/utils/_prisma";

export default async function getQuote(id) {
  const customer = await prisma.customer.findMany();

  const quote = await prisma.quote.findFirst({
    where: { id: Number(id) },
    include: {
      Customer: true,
      Employees_Quote_created_byToEmployees: true,
      Employees_Quote_modified_byToEmployees: true,
      Account_Manager: true,
      DSM: true,
    },
  });

  const project = await prisma.project.findFirst({
    where: { project_id: quote.project_id },
  });

  const sales_org = await prisma.sales_Org.findMany();
  const account_manager = await prisma.account_Manager.findMany({
    where: { sales_org_id: project.sales_org_id },
  });
  const dsm = await prisma.dSM.findMany({
    where: { sales_org_id: project.sales_org_id },
  });

  const materials = await prisma.material_Quoted.findMany({
    where: {
      permanent_quote_id: quote.quote_id,
      quote_version: quote.quote_version,
      is_active: true,
    },
    include: {
      Material: {
        include: {
          Material_Sales_Org: true,
        },
      },
    },
  });
  return {
    customer: JSON.parse(JSON.stringify(customer)),
    quote: JSON.parse(JSON.stringify(quote)),
    project: JSON.parse(JSON.stringify(project)),
    sales_org: JSON.parse(JSON.stringify(sales_org)),
    account_manager: JSON.parse(JSON.stringify(account_manager)),
    dsm: JSON.parse(JSON.stringify(dsm)),
    materials: JSON.parse(JSON.stringify(materials)),
  };
}
