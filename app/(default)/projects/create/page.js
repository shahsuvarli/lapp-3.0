import React from "react";
import getCreate from "@/features/getCreate";
import CreateProject from "@/components/project/CreateProject";

export default async function Create() {
  const { sales_org, vertical_market, channel, region, state } =
    await getCreate();

  return (
    <CreateProject
      sales_org={sales_org}
      vertical_market={vertical_market}
      channel={channel}
      region={region}
      state={state}
    />
  );
}
