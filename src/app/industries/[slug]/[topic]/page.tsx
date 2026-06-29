import {
  createIndustryTopicMetadata,
  createIndustryTopicPage,
  createIndustryTopicStaticParams,
} from "@/lib/site/routes";

export const generateStaticParams = () => createIndustryTopicStaticParams();

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ slug: string; topic: string }>;
}) => {
  const { slug, topic } = await params;
  return createIndustryTopicMetadata(slug, topic);
};

export default createIndustryTopicPage();
