import RandomQuestionGame from "~/components/teoria/random-question-game";

interface RandomQuestionPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function RandomQuestionPage({
  params,
}: RandomQuestionPageProps) {
  const { id } = await params;
  return <RandomQuestionGame qualificationId={id} />;
}
