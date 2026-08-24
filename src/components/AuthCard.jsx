import { Card, CardTitle, CardDescription } from "@/components/ui/card";

export function AuthCard({ title, subtitle, children, className = "", onClick }) {
  return (
    <div onClick={onClick} className={`min-h-[calc(100vh-64px)] flex items-center justify-center px-4 py-10 ${className}`}>
      <div onClick={(e) => e.stopPropagation()} className="w-full max-w-sm">
        <div className="h-1 rounded-t-full bg-gradient-to-r from-accent via-secondary to-hover" />
        <Card>
          <CardTitle>{title}</CardTitle>
          {subtitle && <CardDescription>{subtitle}</CardDescription>}
          {children}
        </Card>
      </div>
    </div>
  );
}
