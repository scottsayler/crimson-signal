import {
  createSectionMetadata,
  createSectionPage,
  createSectionStaticParams,
} from "@/lib/site/routes";

export const generateStaticParams = () => createSectionStaticParams("comparisons");

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  const { slug } = await params;
  return createSectionMetadata("comparisons", slug);
};

export default createSectionPage("comparisons");
