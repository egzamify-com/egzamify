import BrowseQuestions from "~/components/browse-questions";

interface BrowseQuestionsPageProps {
  params: {
    id: string;
  };
}

export default function BrowseQuestionsPage({
  params,
}: BrowseQuestionsPageProps) {
  return <BrowseQuestions qualificationId={params.id} />;
}
