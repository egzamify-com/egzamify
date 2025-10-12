import FullTestGame from "~/components/teoria/full-test-game"

export default async function FullTestPage({
  params,
}: {
  params: Promise<{
    qualificationName: string
  }>
}) {
  const { qualificationName } = await params
  return <FullTestGame qualificationName={qualificationName} />
}
