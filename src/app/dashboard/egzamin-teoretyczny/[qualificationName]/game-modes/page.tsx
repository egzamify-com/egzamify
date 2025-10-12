import GameModes from "~/components/teoria/game-modes"

interface GameModesPageProps {
  params: Promise<{
    qualificationName: string
  }>
}

export default async function GameModesPage({ params }: GameModesPageProps) {
  const { qualificationName } = await params
  return <GameModes qualificationName={qualificationName} />
}
