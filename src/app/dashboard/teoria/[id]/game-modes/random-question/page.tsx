import RandomQuestionGame from "~/components/random-question-game";

interface RandomQuestionPageProps {
  params: {
    id: string;
  };
}

export default function RandomQuestionPage({
  params,
}: RandomQuestionPageProps) {
  return <RandomQuestionGame qualificationId={params.id} />;
}
