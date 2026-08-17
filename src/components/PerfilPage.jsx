export function PerfilPage({ nombre, correo, telefono, rol, onClose }) {
  return (
    <section 
      className="fixed inset-0 z-50 bg-transparent flex items-center  p-4"
      onClick={onClose}
    >
      <div 
       className="absolute right-4 top-18 bg-gradient-to-b from-accent/20 via-black/90 to-black border border-accent/60 rounded-lg p-6 max-w-sm w-full shadow-2xl text-white"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-bold mb-4 text-primary">Mi perfil</h2>

        <div className="flex flex-col gap-2 text-sm">
          <p><strong>Nombre:</strong> {nombre}</p>
          <p><strong>Correo:</strong> {correo}</p>
          <p><strong>Teléfono:</strong> {telefono}</p>
          <p><strong>Rol:</strong> {rol}</p>
        </div>
      </div>
    </section>
  );
}