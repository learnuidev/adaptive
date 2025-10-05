import { useListUserWebsitesQuery } from "@/modules/user-websites/use-list-user-websites-query";
import { useParams } from "@tanstack/react-router";

export const useGetCurrentWebsite = () => {
  const params = useParams({ strict: false }) as { websiteId?: string };
  const websiteId = params?.websiteId;
  const { data: websites } = useListUserWebsitesQuery();

  const currentWebsite = websites?.find((website) => website.id === websiteId);

  return currentWebsite;
};
