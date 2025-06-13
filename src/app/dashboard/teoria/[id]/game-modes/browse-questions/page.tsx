import BrowseQuestions from "~/components/browse-questions";

// interface BrowseQuestionsPageProps {
//   params: {
//     id: string;
//   };
// }

export default async function BrowseQuestionsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const p = await params;
  return <BrowseQuestions qualificationId={p.id} />;
}
