import { Card, CardHeader, CardTitle, CardDescription, CardContent, Badge } from '@/lib/ui';
import { ExternalLink } from 'lucide-react';
import type { Article } from '@/pages/Home';

function relTime(iso: string): string {
  const s = Math.floor((Date.now() - Date.parse(iso)) / 1000);
  if (s < 60) return s + 's ago';
  if (s < 3600) return Math.floor(s / 60) + 'm ago';
  if (s < 86400) return Math.floor(s / 3600) + 'h ago';
  return Math.floor(s / 86400) + 'd ago';
}

interface Props {
  label: string;
  icon: React.ReactNode;
  articles: Article[];
}

export function NewsThemeSection({ label, icon, articles }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {icon}
          {label}
        </CardTitle>
        <CardDescription>{articles.length} headline{articles.length === 1 ? '' : 's'} in the last 24 hours</CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        {articles.length === 0 ? (
          <div className="px-6 pb-6 text-small text-muted-foreground">No headlines for this theme right now.</div>
        ) : (
          <ul className="divide-y divide-border">
            {articles.map((a) => (
              <li key={a.url} className="px-6 py-3">
                <a
                  href={a.url}
                  target="_blank"
                  rel="noreferrer"
                  className="group flex flex-col gap-1 transition-colors duration-150 ease-out"
                >
                  <span className="text-body text-foreground group-hover:text-primary transition-colors duration-150 flex items-start gap-2">
                    <span className="flex-1">{a.title}</span>
                    <ExternalLink size={14} className="mt-1 shrink-0 text-muted-foreground group-hover:text-primary" />
                  </span>
                  <span className="flex items-center gap-2 text-micro text-muted-foreground">
                    <Badge variant="outline">{a.domain}</Badge>
                    <span>{relTime(a.seendate)}</span>
                  </span>
                </a>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
