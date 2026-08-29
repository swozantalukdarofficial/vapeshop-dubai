import fs from 'fs';

let content = fs.readFileSync('src/components/sections/PageBlocks.tsx', 'utf8');

// Update imports
if (!content.includes('ChevronDown')) {
  content = content.replace(
    'import { Clock, Mail, MapPin, Phone } from "lucide-react";',
    'import { Clock, Mail, MapPin, Phone, ChevronDown, ChevronUp } from "lucide-react";'
  );
}

const oldBlock = `export const RichTextSection: React.FC<{ settings: RichTextSettings }> = ({
  settings,
}) => {
  const [expanded, setExpanded] = React.useState(false);
  const isCollapsible = settings.collapsible === true;

  if (!settings.heading && !settings.body.trim()) return null;

  return (
    <div className="w-full bg-card border border-border/60 rounded-[2rem] p-5 sm:p-7 lg:p-8 shadow-md relative">
      <div className={settings.width === "narrow" ? "max-w-4xl mx-auto" : "w-full"}>
        {settings.heading && (
          <h2 className="text-2xl sm:text-3xl font-serif font-black text-foreground tracking-tight mb-4">
            {settings.heading}
          </h2>
        )}
        <div className={\`relative \${isCollapsible && !expanded ? "max-h-[200px] overflow-hidden" : ""}\`}>
          <div className="space-y-1 pb-2">{renderBody(settings.body)}</div>
          {isCollapsible && !expanded && (
            <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-card to-transparent pointer-events-none" />
          )}
        </div>
        {isCollapsible && (
          <div className="mt-4 flex justify-center">
            <button
              onClick={() => setExpanded(!expanded)}
              className="inline-flex h-9 items-center justify-center rounded-full bg-secondary px-6 py-2 text-sm font-medium text-secondary-foreground shadow-sm transition-colors hover:bg-secondary/80 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              {expanded ? "Read Less" : "Read More"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};`;

const newBlock = `export const RichTextSection: React.FC<{ settings: RichTextSettings }> = ({
  settings,
}) => {
  const [expanded, setExpanded] = React.useState(false);
  const isCollapsible = settings.collapsible === true;

  if (!settings.heading && !settings.body.trim()) return null;

  return (
    <div className="w-full relative group">
      {/* Subtle Premium Glow behind the card */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5 rounded-[2.5rem] blur-2xl opacity-50 transition-opacity duration-700 group-hover:opacity-100" />
      
      <div className="relative w-full bg-card/60 backdrop-blur-3xl border border-border/50 rounded-[2.5rem] p-6 sm:p-10 lg:p-12 shadow-2xl overflow-hidden">
        
        {/* Subtle grid pattern for futuristic touch */}
        <div className="absolute inset-0 bg-grid-black/[0.02] dark:bg-grid-white/[0.02] bg-[length:32px_32px] pointer-events-none" />

        <div className={\`relative z-10 \${settings.width === "narrow" ? "max-w-4xl mx-auto" : "w-full"}\`}>
          {settings.heading && (
            <div className="flex items-center justify-center gap-3 mb-8">
              <div className="h-px w-8 bg-gradient-to-r from-transparent to-primary/50" />
              <h2 className="text-3xl sm:text-4xl font-serif font-black text-foreground tracking-tight text-center">
                {settings.heading}
              </h2>
              <div className="h-px w-8 bg-gradient-to-l from-transparent to-primary/50" />
            </div>
          )}
          
          <div className={\`relative transition-all duration-700 ease-in-out \${isCollapsible && !expanded ? "max-h-[220px] overflow-hidden" : ""}\`}>
            <div className="space-y-2 pb-4 text-base sm:text-lg">{renderBody(settings.body)}</div>
            
            {/* Elegant fade for collapsed state */}
            {isCollapsible && !expanded && (
              <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-card via-card/80 to-transparent pointer-events-none" />
            )}
          </div>
          
          {isCollapsible && (
            <div className="mt-8 flex justify-center relative z-20">
              <button
                onClick={() => setExpanded(!expanded)}
                className="group/btn relative inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-primary to-orange-500 px-8 py-3 text-sm font-bold text-white shadow-lg shadow-primary/25 transition-all duration-300 hover:shadow-primary/40 hover:-translate-y-0.5 active:translate-y-0"
              >
                <div className="absolute inset-0 rounded-full bg-white/20 opacity-0 transition-opacity group-hover/btn:opacity-100" />
                {expanded ? (
                  <>
                    <span>Read Less</span>
                    <ChevronUp className="w-4 h-4 transition-transform group-hover/btn:-translate-y-0.5" />
                  </>
                ) : (
                  <>
                    <span>Read More</span>
                    <ChevronDown className="w-4 h-4 transition-transform group-hover/btn:translate-y-0.5" />
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};`;

if (!content.includes('bg-card border border-border/60 rounded-[2rem] p-5 sm:p-7 lg:p-8 shadow-md relative')) {
  console.log("Could not find the target block.");
} else {
  content = content.replace(oldBlock, newBlock);
  fs.writeFileSync('src/components/sections/PageBlocks.tsx', content, 'utf8');
  console.log("SUCCESS: Replaced RichTextSection with premium futuristic version");
}
