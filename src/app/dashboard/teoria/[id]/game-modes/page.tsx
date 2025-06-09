import GameModes from "~/components/game-modes";

interface GameModesPageProps {
  params: {
    id: string;
  };
}

export default function GameModesPage({ params }: GameModesPageProps) {
  const qualificationName = `Kwalifikacja ${params.id}`;

  return <GameModes qualificationName={qualificationName} />;
}
