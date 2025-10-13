import BrowseQuestions from "~/components/teoria/browse-questions"

export default async function BrowseQuestionsPage({
  params,
}: {
  params: Promise<{
    qualificationName: string
  }>
}) {
  const { qualificationName } = await params
  return <BrowseQuestions qualificationName={qualificationName} />
}
