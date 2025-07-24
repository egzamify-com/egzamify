"use client";

import SpinnerLoading from "./SpinnerLoading";

export default function FullScreenDashboardLoading({
  loadingMessage = "Loading chat...",
  loadingDetail = "",
}: {
  loadingMessage?: string;
  loadingDetail?: string;
}) {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-4">
      <SpinnerLoading />
      <h1 className="text-3xl font-bold">{loadingMessage}</h1>
      <p className="max-w-[50%] text-center text-sm">{loadingDetail}</p>
      <div className="flex flex-col items-center justify-center gap-3"></div>
    </div>
  );
}
