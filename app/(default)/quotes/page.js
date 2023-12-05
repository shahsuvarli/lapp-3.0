import React from "react";
import getQuotes from "@/features/getQuotes";
import ListQuotes from "@/components/quotes/ListQuotes";

export default async function QuoteList() {
  const {
    state,
    sales_org,
    region,
    dsm,
    account_manager,
    vertical_market,
    quotes,
  } = await getQuotes();

  return (
    <ListQuotes
      defaultQuotes={quotes}
      state={state}
      sales_org={sales_org}
      region={region}
      dsm={dsm}
      account_manager={account_manager}
      vertical_market={vertical_market}
    />
  );
}
