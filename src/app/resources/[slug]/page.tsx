import {
  createSectionMetadata,
  createSectionPage,
  createSectionStaticParams,
} from "@/lib/site/routes";

export const generateStaticParams = () => createSectionStaticParams("resources");

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  const { slug } = await params;
  return createSectionMetadata("resources", slug);
};

export default createSectionPage("resources");
