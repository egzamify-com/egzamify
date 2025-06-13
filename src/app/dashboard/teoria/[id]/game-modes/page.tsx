import GameModes from "~/components/game-modes";

// interface GameModesPageProps {
//   params: {
//     id: string;
//   };
// }

export default async function GameModesPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const p = await params;
  const qualificationName = `Kwalifikacja ${p.id}`;

  return <GameModes qualificationName={qualificationName} />;
}
