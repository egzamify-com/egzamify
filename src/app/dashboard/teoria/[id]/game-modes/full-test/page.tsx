import FullTestGame from "~/components/full-test-game";

interface FullTestPageProps {
  params: {
    id: string;
  };
}

export default function FullTestPage({ params }: FullTestPageProps) {
  return <FullTestGame qualificationId={params.id} />;
}
