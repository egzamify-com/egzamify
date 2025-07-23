import { api } from "~/trpc/server";
import QualificationsPage from "./QualificationsPage";

export default async function Page() {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <h1 className="text-4xl font-bold">Under contruction :)</h1>
    </div>
  );
  const qualifications = await api.qualifications.getQualificationsList();
  console.log(qualifications);
  return (
    <div>
      <QualificationsPage initialQualifications={qualifications} />
    </div>
  );
}
