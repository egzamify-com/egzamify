import RandomQuestionGame from "~/components/teoria/random-question-game"

export default async function RandomQuestionPage({
  params,
}: {
  params: Promise<{
    qualificationName: string
  }>
}) {
  const { qualificationName } = await params
  return <RandomQuestionGame qualificationName={qualificationName} />
}
