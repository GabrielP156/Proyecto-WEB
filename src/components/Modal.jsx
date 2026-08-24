import { Dialog, DialogContent, DialogClose } from "@/components/ui/dialog";

export function Modal({ onClose, children, maxWidth = "max-w-lg", maxHeight = "max-h-[85vh]" }) {
  return (
    <Dialog open onOpenChange={(open) => !open && onClose?.()}>
      <DialogContent className={`w-[calc(100%-2rem)] ${maxWidth} ${maxHeight} p-0 outline-none`}>
        <div className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-pink-500 rounded-2xl blur-md opacity-60" />
          <div className={`relative bg-neutral-900/90 border border-cyan-500/30 rounded-2xl p-6 overflow-y-auto ${maxHeight}`}>
            <DialogClose asChild>
              <button
                type="button"
                className="absolute top-3 right-3 text-white bg-black/60 hover:bg-fuchsia-600 w-8 h-8 rounded-full flex items-center justify-center"
              >
                ✕
              </button>
            </DialogClose>
            {children}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
