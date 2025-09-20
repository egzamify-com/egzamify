import GameModes from "~/components/teoria/game-modes";

interface GameModesPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function GameModesPage({ params }: GameModesPageProps) {
  const { id } = await params;
  return <GameModes qualificationId={id} />;
}
