import RandomQuestionGame from "~/components/teoria/random-question-game";

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
