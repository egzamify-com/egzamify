import { api } from "~/trpc/server";
import QualificationsPage from "./QualificationsPage";

export default async function Page() {
  const qualifications = await api.qualifications.getQualificationsList();
  console.log(qualifications);
  return (
    <div>
      <QualificationsPage initialQualifications={qualifications} />
    </div>
  );
}
