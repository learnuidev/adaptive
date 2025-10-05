import { useState } from "react";
import { documentation } from "@/data/documentation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Search, Book, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Documentation() {
  const [selectedCategory, setSelectedCategory] = useState(documentation[0].category);
  const [selectedItem, setSelectedItem] = useState(documentation[0].items[0]);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredDocs = documentation.map(category => ({
    ...category,
    items: category.items.filter(item =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => category.items.length > 0);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 glass border-b border-white/10 bg-card/95 backdrop-blur-md">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Book className="h-6 w-6 text-primary" />
              <h1 className="text-2xl font-bold">Adaptive Documentation</h1>
            </div>
            <Button asChild variant="outline" className="glass border-white/10">
              <a href="/">Back to App</a>
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8">
          {/* Sidebar */}
          <aside className="space-y-4">
            <div className="glass border-white/10 bg-card/50 backdrop-blur-md p-4 rounded-lg">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search docs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 glass border-white/10"
                />
              </div>
            </div>

            <ScrollArea className="h-[calc(100vh-250px)]">
              <nav className="space-y-2">
                {filteredDocs.map((category) => (
                  <div key={category.category} className="space-y-1">
                    <h3 className="font-semibold text-sm text-muted-foreground px-3 py-2">
                      {category.category}
                    </h3>
                    {category.items.map((item) => (
                      <Button
                        key={item.title}
                        variant="ghost"
                        className={cn(
                          "w-full justify-start text-left hover:bg-white/5",
                          selectedItem.title === item.title && "bg-white/10"
                        )}
                        onClick={() => {
                          setSelectedCategory(category.category);
                          setSelectedItem(item);
                        }}
                      >
                        <ChevronRight className="h-4 w-4 mr-2 opacity-50" />
                        <span className="truncate">{item.title}</span>
                      </Button>
                    ))}
                  </div>
                ))}
              </nav>
            </ScrollArea>
          </aside>

          {/* Main Content */}
          <main className="glass border-white/10 bg-card/50 backdrop-blur-md rounded-lg p-8">
            <article className="prose prose-invert max-w-none">
              <div className="mb-6">
                <p className="text-sm text-muted-foreground mb-2">{selectedCategory}</p>
                <h1 className="text-4xl font-bold mb-4">{selectedItem.title}</h1>
                <p className="text-xl text-muted-foreground">{selectedItem.description}</p>
              </div>
              
              <Separator className="my-8 bg-white/10" />
              
              <div 
                className="documentation-content"
                dangerouslySetInnerHTML={{ 
                  __html: selectedItem.content
                    .replace(/^# (.+)$/gm, '<h1 class="text-3xl font-bold mt-8 mb-4">$1</h1>')
                    .replace(/^## (.+)$/gm, '<h2 class="text-2xl font-semibold mt-6 mb-3">$1</h2>')
                    .replace(/^### (.+)$/gm, '<h3 class="text-xl font-medium mt-4 mb-2">$1</h3>')
                    .replace(/```(\w+)?\n([\s\S]*?)```/g, '<pre class="glass border-white/10 bg-card/95 backdrop-blur-md p-4 rounded-lg overflow-x-auto my-4"><code class="text-sm">$2</code></pre>')
                    .replace(/`([^`]+)`/g, '<code class="glass border-white/10 bg-card/95 px-2 py-1 rounded text-sm">$1</code>')
                    .replace(/^\- (.+)$/gm, '<li class="ml-4 mb-2">$1</li>')
                    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
                    .replace(/\n\n/g, '<br/><br/>')
                }}
              />
            </article>
          </main>
        </div>
      </div>
    </div>
  );
}
