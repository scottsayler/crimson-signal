import {
  createSectionMetadata,
  createSectionPage,
  createSectionStaticParams,
} from "@/lib/site/routes";

export const generateStaticParams = () => createSectionStaticParams("tools");

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  const { slug } = await params;
  return createSectionMetadata("tools", slug);
};

export default createSectionPage("tools");
