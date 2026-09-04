import { SidebarNav } from "@/components/docs/sidebar";
import { SiteHeader } from "@/components/docs/site-header";

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SiteHeader />
      <div className="mx-auto flex max-w-[90rem] gap-8 px-4 sm:px-6">
        {/* Sticky, independently scrolling sidebar: the page never jumps
            back to the top of the nav when you scroll a long component page. */}
        <aside className="sticky top-14 hidden h-[calc(100dvh-3.5rem)] w-56 shrink-0 overflow-y-auto py-8 lg:block">
          <SidebarNav />
        </aside>
        <main id="main" className="min-w-0 flex-1 py-8 lg:py-12">
          {children}
        </main>
      </div>
    </>
  );
}
