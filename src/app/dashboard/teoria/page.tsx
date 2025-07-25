import FullScreenError from "~/components/full-screen-error";
import { api } from "~/trpc/server";
import QualificationsPage from "./QualificationsPage";

export default async function Page() {
  return <FullScreenError errorMessage="Under construction" />;
  const qualifications = await api.qualifications.getQualificationsList();
  console.log(qualifications);
  return (
    <div>
      <QualificationsPage initialQualifications={qualifications} />
    </div>
  );
}
