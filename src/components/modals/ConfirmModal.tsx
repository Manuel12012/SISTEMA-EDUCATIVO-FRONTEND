type Props = {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title?: string;
    description?: string;
  };
  
  const ConfirmModal = ({
    isOpen,
    onClose,
    onConfirm,
    title = "¿Estás seguro?",
    description = "Esta acción no se puede deshacer",
  }: Props) => {
    if (!isOpen) return null;
  
    return (
      <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-6 w-80 shadow-lg">
          <h2 className="text-lg font-semibold mb-2">{title}</h2>
          <p className="text-gray-500 mb-4">{description}</p>
  
          <div className="flex justify-end gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded bg-gray-200"
            >
              Cancelar
            </button>
  
            <button
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className="px-4 py-2 rounded bg-red-500 text-white"
            >
              Confirmar
            </button>
          </div>
        </div>
      </div>
    );
  };
  
  export default ConfirmModal;