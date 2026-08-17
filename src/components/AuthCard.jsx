export function AuthCard({ title, subtitle, children ,className = "", onClick}) {
  return (
    <div  onClick={onClick} className={`min-h-[calc(100vh-64px)] flex items-center justify-center px-4 py-10 ${className}`}>
      <div   onClick={(e) => e.stopPropagation()} className="w-full max-w-sm">
        <div className="h-1 rounded-t-full bg-gradient-to-r from-accent via-secondary to-hover" />
        <div className="bg-card/90 border border-white/10 rounded-b-xl p-8 shadow-[0_0_40px_-10px_var(--color-secondary)]">
          <h2 className="font-display text-2xl font-bold mb-1 bg-gradient-to-r from-accent to-secondary bg-clip-text text-transparent">
            {title}
          </h2>
          {subtitle && <p className="text-muted text-sm mb-6">{subtitle}</p>}
          {children}
        </div>
      </div>
    </div>
  );
}
