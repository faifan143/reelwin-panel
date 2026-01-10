import { Gift, Package, QrCode, X } from "lucide-react";
import React, { useState } from "react";
import TheHuntTab from "../the-hunt/TheHuntTab";
import GemsTab from "./tabs/GemsTab";
import QrCodeTab from "./tabs/QrCodeTab";
import VersionsTab from "./tabs/VersionsTab";
import CreateHuntModal from "../the-hunt/CreateHuntModal";
import BulkOncePdfModal from "./tabs/qr/BulkOncePdfModal";
import QrCodeForm from "./tabs/qr/QrCodeForm";
import QrCodeDetails from "./tabs/qr/QrCodeDetails";
import { QrCodeWithScans, CreateVersionDto } from "./types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createVersion } from "./api";

const GemsVersionsManager: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    "gems" | "qr-codes" | "the-hunt" | "versions"
  >("gems");

  // Modal states - moved from tabs to page level
  // QR Code modals
  const [isQrCreateModalOpen, setIsQrCreateModalOpen] = useState(false);
  const [isQrDetailsModalOpen, setIsQrDetailsModalOpen] = useState(false);
  const [isQrBulkModalOpen, setIsQrBulkModalOpen] = useState(false);
  const [selectedQrCode, setSelectedQrCode] = useState<QrCodeWithScans | null>(null);

  // The Hunt modal
  const [isHuntCreateModalOpen, setIsHuntCreateModalOpen] = useState(false);

  // Versions modal
  const [isVersionModalOpen, setIsVersionModalOpen] = useState(false);
  const [versionFormData, setVersionFormData] = useState<CreateVersionDto>({
    version: '',
    isRequired: false,
  });
  const queryClient = useQueryClient();

  const createVersionMutation = useMutation({
    mutationFn: createVersion,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['latest-version'] });
      setVersionFormData({ version: '', isRequired: false });
      setIsVersionModalOpen(false);
    },
  });

  const handleVersionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createVersionMutation.mutate(versionFormData);
  };

  const handleVersionInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setVersionFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  // Gems success modal
  const [isGemSuccessModalOpen, setIsGemSuccessModalOpen] = useState(false);
  const [generatedGem, setGeneratedGem] = useState<any>(null);

  // Handlers for opening modals
  const handleOpenQrCreate = () => setIsQrCreateModalOpen(true);
  const handleOpenQrDetails = (qrCode: QrCodeWithScans) => {
    setSelectedQrCode(qrCode);
    setIsQrDetailsModalOpen(true);
  };
  const handleOpenQrBulk = () => setIsQrBulkModalOpen(true);
  const handleCloseQrModals = () => {
    setIsQrCreateModalOpen(false);
    setIsQrDetailsModalOpen(false);
    setIsQrBulkModalOpen(false);
    setSelectedQrCode(null);
  };

  const handleOpenHuntCreate = () => setIsHuntCreateModalOpen(true);
  const handleCloseHuntCreate = () => setIsHuntCreateModalOpen(false);

  const handleOpenVersionModal = () => setIsVersionModalOpen(true);
  const handleCloseVersionModal = () => setIsVersionModalOpen(false);

  const handleOpenGemSuccess = (gem: any) => {
    setGeneratedGem(gem);
    setIsGemSuccessModalOpen(true);
  };
  const handleCloseGemSuccess = () => {
    setIsGemSuccessModalOpen(false);
    setGeneratedGem(null);
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950" dir="rtl">
      <div className="w-full bg-slate-800/40 backdrop-blur-xl  border border-slate-700/50 shadow-2xl overflow-hidden">
        {/* Tabs Header - Dark Theme */}
        <div className="border-b border-slate-700/50 bg-slate-800/30">
          <div className="flex overflow-x-auto">
            <button
              type="button"
              className={`px-6 py-4 border-b-2 font-semibold text-sm flex items-center gap-2 transition-all whitespace-nowrap ${
                activeTab === "gems"
                  ? "border-blue-500 text-blue-400 bg-blue-500/10"
                  : "border-transparent text-slate-400 hover:text-slate-300 hover:border-slate-600 hover:bg-slate-700/30"
              }`}
              onClick={() => setActiveTab("gems")}
            >
              <Gift size={18} className="text-inherit" />
              الجواهر
            </button>
            <button
              type="button"
              className={`px-6 py-4 border-b-2 font-semibold text-sm flex items-center gap-2 transition-all whitespace-nowrap ${
                activeTab === "qr-codes"
                  ? "border-blue-500 text-blue-400 bg-blue-500/10"
                  : "border-transparent text-slate-400 hover:text-slate-300 hover:border-slate-600 hover:bg-slate-700/30"
              }`}
              onClick={() => setActiveTab("qr-codes")}
            >
              <QrCode size={18} className="text-inherit" />
              رموز QR
            </button>
            <button
              type="button"
              className={`px-6 py-4 border-b-2 font-semibold text-sm flex items-center gap-2 transition-all whitespace-nowrap ${
                activeTab === "the-hunt"
                  ? "border-blue-500 text-blue-400 bg-blue-500/10"
                  : "border-transparent text-slate-400 hover:text-slate-300 hover:border-slate-600 hover:bg-slate-700/30"
              }`}
              onClick={() => setActiveTab("the-hunt")}
            >
              <QrCode size={18} className="text-inherit" />
              الرحلة
            </button>
            <button
              type="button"
              className={`px-6 py-4 border-b-2 font-semibold text-sm flex items-center gap-2 transition-all whitespace-nowrap ${
                activeTab === "versions"
                  ? "border-blue-500 text-blue-400 bg-blue-500/10"
                  : "border-transparent text-slate-400 hover:text-slate-300 hover:border-slate-600 hover:bg-slate-700/30"
              }`}
              onClick={() => setActiveTab("versions")}
            >
              <Package size={18} className="text-inherit" />
              الإصدارات
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-4 sm:p-6 bg-transparent min-h-[600px]">
          {activeTab === "gems" && (
            <GemsTab onGemSuccess={(gem) => {
              setGeneratedGem(gem);
              setIsGemSuccessModalOpen(true);
            }} />
          )}
          {activeTab === "qr-codes" && (
            <QrCodeTab
              onOpenCreate={handleOpenQrCreate}
              onOpenDetails={handleOpenQrDetails}
              onOpenBulk={handleOpenQrBulk}
            />
          )}
          {activeTab === "the-hunt" && <TheHuntTab onOpenCreate={handleOpenHuntCreate} />}
          {activeTab === "versions" && (
            <VersionsTab 
              onOpenCreate={handleOpenVersionModal}
              onCloseCreate={handleCloseVersionModal}
              formData={versionFormData}
              onFormDataChange={setVersionFormData}
              onSubmit={handleVersionSubmit}
              isSubmitting={createVersionMutation.isPending}
            />
          )}
        </div>
      </div>

      {/* Modals - Rendered at page level */}
      {/* QR Code Create Modal */}
      {isQrCreateModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-800 rounded-2xl shadow-2xl w-full max-w-2xl border border-slate-700/50 max-h-[80vh] flex flex-col">
            <div className="flex-shrink-0 px-6 pt-6 pb-4 border-b border-slate-700/50">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold text-white">إنشاء رمز QR جديد</h3>
                <button
                  onClick={handleCloseQrModals}
                  className="text-slate-400 hover:text-white bg-slate-700/50 rounded-lg p-2 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto no-scrollbar px-6 py-6">
              <QrCodeForm onClose={handleCloseQrModals} />
            </div>
          </div>
        </div>
      )}

      {/* QR Code Details Modal */}
      {isQrDetailsModalOpen && selectedQrCode && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-800 rounded-2xl shadow-2xl w-full max-w-4xl border border-slate-700/50 max-h-[80vh] flex flex-col">
            <div className="flex-shrink-0 px-6 pt-6 pb-4 border-b border-slate-700/50">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold text-white">تفاصيل رمز QR</h3>
                <button
                  onClick={handleCloseQrModals}
                  className="text-slate-400 hover:text-white bg-slate-700/50 rounded-lg p-2 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto no-scrollbar px-6 py-6">
              <QrCodeDetails
                qrCode={selectedQrCode}
                onClose={handleCloseQrModals}
              />
            </div>
          </div>
        </div>
      )}

      {/* QR Code Bulk PDF Modal */}
      {isQrBulkModalOpen && <BulkOncePdfModal onClose={handleCloseQrModals} />}

      {/* The Hunt Create Modal */}
      {isHuntCreateModalOpen && <CreateHuntModal onClose={handleCloseHuntCreate} />}

      {/* Versions Create Modal */}
      {isVersionModalOpen && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-800 rounded-2xl shadow-2xl w-full max-w-md border border-slate-700/50 max-h-[80vh] flex flex-col">
            <div className="flex-shrink-0 p-4 border-b border-slate-700/50 flex justify-between items-center">
              <button
                onClick={handleCloseVersionModal}
                className="text-slate-400 hover:text-white bg-slate-700/50 rounded-lg p-2 transition-colors"
              >
                <X size={20} />
              </button>
              <h3 className="text-lg font-bold text-right text-white">إصدار جديد</h3>
            </div>
            <div className="flex-1 overflow-y-auto no-scrollbar">
              <form onSubmit={handleVersionSubmit} className="p-4">
                <div className="mb-4">
                  <label className="block text-sm font-medium text-slate-200 mb-2 text-right">
                    الإصدار
                  </label>
                  <input
                    type="text"
                    name="version"
                    value={versionFormData.version}
                    onChange={handleVersionInputChange}
                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-right"
                    placeholder="مثال: 1.0.0"
                    required
                  />
                </div>
                <div className="mb-6 flex items-center justify-end">
                  <input
                    type="checkbox"
                    id="isRequired"
                    name="isRequired"
                    checked={versionFormData.isRequired}
                    onChange={handleVersionInputChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-600 rounded bg-slate-700/50"
                  />
                  <label htmlFor="isRequired" className="mr-2 block text-sm text-slate-200">
                    تحديث إجباري
                  </label>
                </div>
                <div className="flex justify-start gap-3">
                  <button
                    type="submit"
                    disabled={createVersionMutation.isPending}
                    className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white border-0 transition-all shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {createVersionMutation.isPending ? 'جاري الإضافة...' : 'إضافة'}
                  </button>
                  <button
                    type="button"
                    onClick={handleCloseVersionModal}
                    className="flex-1 px-4 py-3 rounded-xl bg-slate-700/50 hover:bg-slate-700/70 text-slate-200 border border-slate-600/50 transition-all font-semibold"
                  >
                    إلغاء
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Gems Success Modal */}
      {isGemSuccessModalOpen && generatedGem && (
        <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity" aria-hidden="true" onClick={handleCloseGemSuccess}></div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-slate-800 rounded-2xl text-right overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full border border-slate-700/50 max-h-[80vh] flex flex-col">
              <div className="flex-shrink-0 relative">
                <div className="absolute top-0 left-0 pt-4 pl-4">
                  <button
                    type="button"
                    className="bg-slate-700/50 rounded-lg p-2 text-slate-400 hover:text-white hover:bg-slate-700 focus:outline-none transition-colors"
                    onClick={handleCloseGemSuccess}
                  >
                    <span className="sr-only">إغلاق</span>
                    <X size={20} />
                  </button>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto no-scrollbar bg-slate-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-14 w-14 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 sm:mx-0 shadow-lg shadow-green-500/20">
                    <Gift className="h-7 w-7 text-white" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:mr-4 sm:text-right">
                    <h3 className="text-xl leading-6 font-bold text-white mb-4" id="modal-title">
                      تم إنشاء الجوهرة بنجاح
                    </h3>
                    <div className="mt-4 space-y-3">
                      <div className="p-3 bg-slate-700/50 rounded-xl border border-slate-600/50">
                        <p className="text-sm text-slate-300">
                          <span className="font-medium text-blue-400">المحتوى:</span> {generatedGem.contentTitle}
                        </p>
                      </div>
                      <div className="p-3 bg-slate-700/50 rounded-xl border border-slate-600/50">
                        <p className="text-sm text-slate-300">
                          <span className="font-medium text-blue-400">النقاط:</span> {generatedGem.points}
                        </p>
                      </div>
                      <p className="text-sm text-slate-400 mt-4 p-3 bg-blue-500/10 rounded-xl border border-blue-500/20">
                        سيتم منح هذه الجوهرة لأول مستخدم يشاهد هذا المحتوى.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex-shrink-0 bg-slate-700/30 px-4 py-3 sm:px-6 sm:flex sm:flex-row border-t border-slate-700/50">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-xl border border-transparent shadow-lg px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-base font-semibold text-white hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto shadow-blue-500/20 transition-all"
                  onClick={handleCloseGemSuccess}
                >
                  موافق
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GemsVersionsManager;
