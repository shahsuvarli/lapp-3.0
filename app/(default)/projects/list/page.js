import ListProjects from "@/components/project/ListProjects";
import getProjectList from "@/features/getProjectList";
import React from "react";

export default async function Projects() {
  const { projects, state, vertical_market, region, channel, sales_org } =
    await getProjectList();

  return (
    <ListProjects
      initialProjects={projects}
      state={state}
      vertical_market={vertical_market}
      region={region}
      channel={channel}
      sales_org={sales_org}
    />
  );
}
