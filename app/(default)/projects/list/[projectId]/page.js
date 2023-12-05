import ProjectContainer from "@/components/project/ProjectContainer";
import getProjectById from "@/features/getProjectById";

export default async function Project({ params }) {
  const {
    project,
    quotes,
    sales_org,
    vertical_market,
    channel,
    region,
    state,
    competitors,
    customer,
    project_competitors,
    project_sap_orders
  } = await getProjectById(params.projectId);
  return (
    <ProjectContainer
      project={project}
      quotes={quotes}
      sales_org={sales_org}
      vertical_market={vertical_market}
      channel={channel}
      region={region}
      state={state}
      competitors={competitors}
      customer={customer}
      project_competitors={project_competitors}
      project_sap_orders={project_sap_orders}
    />
  );
}
