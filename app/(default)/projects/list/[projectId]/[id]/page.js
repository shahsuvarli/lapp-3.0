import getQuote from "@/features/getQuote";
import QuoteContainer from "@/components/quotes/QuoteContainer";

export default async function Quote({ params }) {
  const {
    quote,
    project,
    materials,
    sales_org,
    account_manager,
    dsm,
    customer,
  } = await getQuote(params.id);
  return (
    <QuoteContainer
      quote={quote}
      project={project}
      materials={materials}
      sales_org={sales_org}
      account_manager={account_manager}
      dsm={dsm}
      customer={customer}
    />
  );
}
