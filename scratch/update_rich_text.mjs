import fs from 'fs';

let content = fs.readFileSync('src/components/sections/PageBlocks.tsx', 'utf8');

const oldBlock = `export interface RichTextSettings {
  heading: string;
  body: string;
  width: "narrow" | "wide";
}

/**
 * Renders plain text as paragraphs and bullet lists.
 *
 * Deliberately not HTML: merchant copy is inserted as text nodes, so nothing
 * typed into the admin can inject markup or script into the storefront.
 * Blank lines separate blocks; lines starting with "- " become list items.
 */
function renderBody(body: string): React.ReactNode[] {
  return body
    .split(/\\n\\s*\\n/)
    .map((block) => block.trim())
    .filter(Boolean)
    .map((block, idx) => {
      const lines = block.split("\\n").map((l) => l.trim());
      const isList = lines.every((line) => line.startsWith("- "));

      if (isList) {
        return (
          <ul key={idx} className="space-y-2 pl-1">
            {lines.map((line, i) => (
              <li key={i} className="flex gap-2.5 text-sm sm:text-base text-muted-foreground leading-relaxed">
                <span className="mt-[0.55em] h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                <span>{line.slice(2)}</span>
              </li>
            ))}
          </ul>
        );
      }

      return (
        <p key={idx} className="text-sm sm:text-base text-muted-foreground leading-relaxed">
          {block}
        </p>
      );
    });
}

export const RichTextSection: React.FC<{ settings: RichTextSettings }> = ({
  settings,
}) => {
  if (!settings.heading && !settings.body.trim()) return null;

  return (
    <div className="w-full bg-card border border-border/60 rounded-[2rem] p-5 sm:p-7 lg:p-8 shadow-md">
      <div className={settings.width === "narrow" ? "max-w-3xl" : "w-full"}>
        {settings.heading && (
          <h2 className="text-2xl sm:text-3xl font-serif font-black text-foreground tracking-tight mb-4">
            {settings.heading}
          </h2>
        )}
        <div className="space-y-4">{renderBody(settings.body)}</div>
      </div>
    </div>
  );
};`;

const newBlock = `export interface RichTextSettings {
  heading: string;
  body: string;
  width: "narrow" | "wide";
  collapsible?: boolean;
}

function parseInline(text: string) {
  const parts = text.split(/(\\*\\*.*?\\*\\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={i} className="font-bold text-foreground">{part.slice(2, -2)}</strong>;
    }
    return part;
  });
}

/**
 * Renders plain text as paragraphs and bullet lists.
 * Supports "### " for subheadings and "**text**" for bold.
 */
function renderBody(body: string): React.ReactNode[] {
  return body
    .split(/\\n\\s*\\n/)
    .map((block) => block.trim())
    .filter(Boolean)
    .map((block, idx) => {
      const lines = block.split("\\n").map((l) => l.trim());
      
      if (lines.length === 1 && lines[0].startsWith("### ")) {
        return (
          <h3 key={idx} className="text-lg sm:text-xl font-bold text-foreground mt-8 mb-3 uppercase tracking-wide">
            {parseInline(lines[0].slice(4))}
          </h3>
        );
      }

      const isList = lines.every((line) => line.startsWith("- "));

      if (isList) {
        return (
          <ul key={idx} className="space-y-2 pl-1 mb-4">
            {lines.map((line, i) => (
              <li key={i} className="flex gap-2.5 text-sm sm:text-base text-muted-foreground leading-relaxed">
                <span className="mt-[0.55em] h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                <span>{parseInline(line.slice(2))}</span>
              </li>
            ))}
          </ul>
        );
      }

      return (
        <p key={idx} className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-4">
          {parseInline(block)}
        </p>
      );
    });
}

export const RichTextSection: React.FC<{ settings: RichTextSettings }> = ({
  settings,
}) => {
  const [expanded, setExpanded] = React.useState(false);
  const isCollapsible = settings.collapsible === true;

  if (!settings.heading && !settings.body.trim()) return null;

  return (
    <div className="w-full bg-card border border-border/60 rounded-[2rem] p-5 sm:p-7 lg:p-8 shadow-md relative">
      <div className={settings.width === "narrow" ? "max-w-3xl" : "w-full"}>
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

if (!content.includes('width: "narrow" | "wide";\n}')) {
  console.log("Could not find the target block.");
} else {
  content = content.replace(oldBlock, newBlock);
  fs.writeFileSync('src/components/sections/PageBlocks.tsx', content, 'utf8');
  console.log("SUCCESS: Replaced RichTextSection");
}
