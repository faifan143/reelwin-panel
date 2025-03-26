{
  /* Processing View with Fixed Progress Bar */
}
// Add this component to your project

export default function ProcessingView() {
  return (
    <div className="bg-white rounded-xl shadow-xl overflow-hidden border border-gray-200">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 px-8 py-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center mr-3">
              <span className="text-white text-xl font-bold">R</span>
            </div>
            <h2 className="text-2xl font-bold text-white">إضافة محتوى جديد</h2>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* File Preview */}
        <div className="bg-white p-4 rounded-lg shadow-sm mb-8">
          <div className="text-lg text-gray-700 mb-3 font-bold">
            ١ فيديو مختار
          </div>
          <div className="relative rounded-lg overflow-hidden shadow-md border border-gray-200">
            <div className="aspect-video bg-gray-100 overflow-hidden">
              <video className="w-full h-full object-cover" controls>
                <source src="/video/placeholder.mp4" type="video/mp4" />
              </video>
            </div>
            <div className="p-2 bg-white/90 text-xs truncate border-t text-left">
              reel3.mp4
            </div>
          </div>
        </div>

        {/* Info Message */}
        <div className="bg-blue-50 rounded-lg p-4 mb-8 flex items-center">
          <div className="flex-shrink-0 bg-blue-100 rounded-full p-2 mr-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-blue-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <div>
            <p className="text-blue-800 font-medium text-right">
              يجب إضافة صورة أو فيديو واحد على الأقل. يمكنك إضافة عدة صور
              وفيديوهات معاً.
            </p>
          </div>
        </div>

        {/* Processing Status */}
        <div className="bg-gray-100 rounded-lg p-6 shadow-md">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center">
              <div className="bg-blue-100 p-2 rounded-full mr-3">
                <svg
                  className="animate-spin text-blue-600 h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-800">
                جاري إنشاء المحتوى...
              </h3>
            </div>
            <span className="text-blue-700 font-bold">70%</span>
          </div>

          {/* Fixed Progress Bar */}
          <div className="w-full bg-blue-100 rounded-full h-3 overflow-hidden">
            <div
              className="bg-blue-600 h-3 rounded-full transition-all duration-300"
              style={{ width: "70%" }}
            ></div>
          </div>

          <p className="text-gray-600 mt-4 text-sm">
            يتم الآن معالجة المحتوى الخاص بك. قد يستغرق ذلك بين بضع ثوانٍ إلى 5
            دقائق... يرجى الانتظار.
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-50 px-8 py-4 border-t text-center text-gray-500 text-sm">
        جميع الحقوق محفوظة © 2025 ReelWin
      </div>
    </div>
  );
}
