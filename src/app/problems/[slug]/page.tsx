import {
  createSectionMetadata,
  createSectionPage,
  createSectionStaticParams,
} from "@/lib/site/routes";

export const generateStaticParams = () => createSectionStaticParams("problems");

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  const { slug } = await params;
  return createSectionMetadata("problems", slug);
};

export default createSectionPage("problems");
