import BrowseQuestions from "~/components/teoria/browse-questions";

interface BrowseQuestionsPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function BrowseQuestionsPage({
  params,
}: BrowseQuestionsPageProps) {
  const { id } = await params;
  return <BrowseQuestions qualificationId={id} />;
}
