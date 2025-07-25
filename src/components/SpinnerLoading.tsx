import { Loader2 } from "lucide-react";

export default function SpinnerLoading({ size = 32 }: { size?: number }) {
  return <Loader2 className="animate-spin" size={size} />;
}
