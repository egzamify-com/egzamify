import GameModes from "~/components/game-modes";

interface GameModesPageProps {
  params: {
    id: string;
  };
}

export default function GameModesPage({ params }: GameModesPageProps) {
  return <GameModes qualificationId={params.id} />;
}
