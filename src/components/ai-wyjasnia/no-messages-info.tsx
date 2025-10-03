import { Bot } from "lucide-react"

export default function NoMessages() {
  return (
    <div className="text-muted-foreground flex h-full items-center justify-center">
      <div className="text-center">
        <Bot className="mx-auto mb-4 h-12 w-12 opacity-50" />
        <p>Zacznij rozmowe z asystentem AI!</p>
      </div>
    </div>
  )
}
