import CreateProject from "@/components/project/CreateProject";
import getCreate from "@/features/getCreate";

export default async function Home() {
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
