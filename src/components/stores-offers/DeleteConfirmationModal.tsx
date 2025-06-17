import { Button } from "./Button";
import { Modal } from "./Modal";
import { translations } from "./translations";

// Delete Confirmation Modal
export const DeleteConfirmationModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    itemName: string;
    itemType: 'category' | 'store' | 'offer' | 'store_category';
    isDeleting: boolean;
}> = ({ isOpen, onClose, onConfirm, itemName, itemType, isDeleting }) => {
    const getTypeTranslation = (type: string) => {
        switch (type) {
            case 'category':
                return translations.categoriesTitle || 'الفئة';
            case 'store':
                return translations.storesTitle || 'المتجر';
            case 'offer':
                return translations.offersTitle || 'العرض';
            case 'store_category':
                return 'فئة المتجر';
            default:
                return 'العنصر';
        }
    };

    const typeTranslation = getTypeTranslation(itemType);

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={translations.confirmDelete || 'تأكيد الحذف'}
        >
            <div className="text-right">
                <p className="text-red-600 font-medium mb-2">
                    {translations.deleteWarning || 'تحذير: هذا الإجراء لا يمكن التراجع عنه'}
                </p>
                <p className="mb-6">
                    {translations.sureDelete || 'هل أنت متأكد من حذف'} {typeTranslation} "{itemName}"؟
                </p>
                <div className="flex justify-end gap-3 gap-reverse">
                    <Button
                        variant="secondary"
                        onClick={onClose}
                        disabled={isDeleting}
                    >
                        {translations.cancel || 'إلغاء'}
                    </Button>
                    <Button
                        variant="danger"
                        onClick={onConfirm}
                        disabled={isDeleting}
                    >
                        {isDeleting ? 'جاري الحذف...' : (translations.confirm || 'تأكيد')}
                    </Button>
                </div>
            </div>
        </Modal>
    );
};