import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import InteractiveCodeEditor from "@/components/interactive-code-editor"

export default function EditorPage() {
  return (
    <div className="min-h-screen bg-black">
      <div className="container mx-auto py-4 px-4 flex justify-between items-center border-b border-zinc-800">
        <div className="flex items-center">
          <span className="text-white/70 text-sm">Untitled-1.js</span>
        </div>
        <div className="flex items-center gap-4">
          <Select defaultValue="javascript">
            <SelectTrigger className="w-[180px] bg-zinc-800 border-zinc-700">
              <SelectValue placeholder="Language" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="javascript">JavaScript</SelectItem>
              <SelectItem value="typescript">TypeScript</SelectItem>
              <SelectItem value="html">HTML</SelectItem>
              <SelectItem value="css">CSS</SelectItem>
              <SelectItem value="python">Python</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" className="text-white/70 border-zinc-700">
            Save
          </Button>
        </div>
      </div>
      <main className="container mx-auto py-6 px-4">
        <InteractiveCodeEditor />
      </main>
    </div>
  )
}
