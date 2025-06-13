import FullTestGame from "~/components/full-test-game";

// interface FullTestPageProps {
//   params: {
//     id: string;
//   };
// }

export default async function FullTestPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const p = await params;
  return <FullTestGame qualificationId={p.id} />;
}
