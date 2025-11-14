import Markdown from "marked-react"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism"
import { cn } from "~/lib/utils"

const CustomCodeRenderer = (snippet: string, lang: string) => {
  // marked-react passes the code block content as 'snippet' and the language as 'lang'
  // The 'lang' comes from the info string in the fence (e.g., ```php)

  // Fallback to a plain text if no language is specified
  const language = lang || "plaintext"

  // We use the <SyntaxHighlighter> component here
  return (
    <SyntaxHighlighter
      style={oneDark} // Apply your chosen style
      language={language}
      showLineNumbers={false} // Optional: display line numbers
      PreTag="pre" // Optional: Render the outer container as a div instead of <pre>
    >
      {snippet}
    </SyntaxHighlighter>
  )
}

// Create the renderer object to override the default 'code' element rendering
const customRenderer = {
  code: CustomCodeRenderer,
}

const MarkdownRenderer = ({
  markdownText,
  textSize,
}: {
  markdownText: string
  textSize: "prose-md" | "prose-lg"
}) => {
  return (
    <div className={cn("prose dark:prose-invert max-w-none", textSize)}>
      <Markdown
        value={markdownText}
        renderer={customRenderer}
        // Important: marked-react expects the language prefix to be 'language-' by default,
        // which matches react-syntax-highlighter's convention.
        // langPrefix="language-"
      />
    </div>
  )
}

export default MarkdownRenderer
