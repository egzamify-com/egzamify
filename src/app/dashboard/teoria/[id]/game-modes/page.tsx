import GameModes from "~/components/teoria/game-modes";

interface GameModesPageProps {
  params: {
    id: string;
  };
}

export default function GameModesPage({ params }: GameModesPageProps) {
  return <GameModes qualificationId={params.id} />;
}
