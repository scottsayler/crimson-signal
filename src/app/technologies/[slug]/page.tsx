import {
  createSectionMetadata,
  createSectionPage,
  createSectionStaticParams,
} from "@/lib/site/routes";

export const generateStaticParams = () => createSectionStaticParams("technologies");

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  const { slug } = await params;
  return createSectionMetadata("technologies", slug);
};

export default createSectionPage("technologies");
