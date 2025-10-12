import FullTestGame from "~/components/teoria/full-test-game";

interface FullTestPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function FullTestPage({ params }: FullTestPageProps) {
  const { id } = await params;
  return <FullTestGame qualificationId={id} />;
}
