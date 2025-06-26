import CodeEditor from "@/components/code-editor"

export default function CodeEditorPage() {
  return (
    <main className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Online Code Editor</h1>
      <p className="text-muted-foreground mb-8 text-center max-w-2xl mx-auto">
        A lightweight code editor with syntax highlighting for JavaScript, HTML, CSS, JSON, and Markdown.
      </p>
      <CodeEditor />
    </main>
  )
}
