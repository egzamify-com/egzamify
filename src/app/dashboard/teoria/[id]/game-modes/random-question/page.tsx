import RandomQuestionGame from "~/components/random-question-game";

// interface RandomQuestionPageProps {
//   params: {
//     id: string;
//   };
// }

export default async function RandomQuestionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const p = await params;

  return <RandomQuestionGame qualificationId={p.id} />;
}
