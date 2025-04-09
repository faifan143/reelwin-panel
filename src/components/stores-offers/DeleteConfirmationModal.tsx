import { Button } from "./Button";
import { Modal } from "./Modal";
import { translations } from "./translations";

// Delete Confirmation Modal
export const DeleteConfirmationModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    itemName: string;
    itemType: 'category' | 'store' | 'offer';
    isDeleting: boolean;
}> = ({ isOpen, onClose, onConfirm, itemName, itemType, isDeleting }) => {
    const typeTranslation =
        itemType === 'category'
            ? translations.categoriesTitle
            : itemType === 'store'
                ? translations.storesTitle
                : translations.offersTitle;

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={translations.confirmDelete}
        >
            <div className="text-right">
                <p className="text-red-600 font-medium mb-2">
                    {translations.deleteWarning}
                </p>
                <p className="mb-6">
                    {translations.sureDelete} {typeTranslation} "{itemName}"؟
                </p>
                <div className="flex justify-end gap-3 gap-reverse">
                    <Button
                        variant="secondary"
                        onClick={onClose}
                        disabled={isDeleting}
                    >
                        {translations.cancel}
                    </Button>
                    <Button
                        variant="danger"
                        onClick={onConfirm}
                        disabled={isDeleting}
                    >
                        {isDeleting ? '...' : translations.confirm}
                    </Button>
                </div>
            </div>
        </Modal>
    );
};