export default function AnimatedDotsLoading() {
  return (
    <div className="flex justify-center">
      <div className="flex gap-2">
        <div className="bg-primary h-3 w-3 animate-bounce rounded-full [animation-delay:-0.3s]"></div>
        <div className="bg-primary h-3 w-3 animate-bounce rounded-full [animation-delay:-0.15s]"></div>
        <div className="bg-primary h-3 w-3 animate-bounce rounded-full"></div>
      </div>
    </div>
  )
}
