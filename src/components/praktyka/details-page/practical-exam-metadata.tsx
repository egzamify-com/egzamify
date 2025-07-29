import { Award, Calendar, Clock, Users } from "lucide-react";

export default function PracticalExamMetadat() {
  return (
    <div className="grid grid-cols-2 gap-4 border-t pt-4 text-sm md:grid-cols-4">
      <div className="flex items-center">
        <Calendar className="mr-2 h-4 w-4" />
        <span>33/33/3333</span>
      </div>
      <div className="flex items-center">
        <Clock className="mr-2 h-4 w-4" />

        <span>5 hours</span>
      </div>
      <div className="flex items-center">
        <Users className="mr-2 h-4 w-4" />
        <span>10 enrolled</span>
      </div>
      <div className="flex items-center">
        <Award className="mr-2 h-4 w-4" />
        <span>10% to pass</span>
      </div>
    </div>
  );
}
