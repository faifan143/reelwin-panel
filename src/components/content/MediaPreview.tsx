export 
const MediaPreview = ({ files, removeFile, isVideo = false }: MediaPreviewProps) => (
  <div className="mt-4">
    <div className={`p-2 ${isVideo ? 'bg-purple-50' : 'bg-blue-50'} rounded-lg mb-2 flex items-center`}>
      <span className={`${isVideo ? 'text-purple-700' : 'text-blue-700'} font-semibold ml-2`}>
        {files.length} {isVideo ? 'فيديو' : 'صورة'} مختار{isVideo ? '' : 'ة'}
      </span>
    </div>
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      {files.map((file, index) => (
        <div
          key={index}
          className="relative group rounded-lg overflow-hidden shadow-md border border-gray-200 transition-all duration-300 hover:shadow-lg hover:scale-105"
        >
          <div className={`${isVideo ? 'aspect-video' : 'aspect-square'} bg-gray-100 overflow-hidden`}>
            {isVideo ? (
              <video
                src={URL.createObjectURL(file)}
                className="w-full h-full object-cover"
                controls
              />
            ) : (
              <img
                src={URL.createObjectURL(file)}
                alt={`Preview ${index}`}
                className="w-full h-full object-cover"
              />
            )}
          </div>
          <div className={isVideo ? "absolute top-2 right-2" : "absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2"}>
            <button
              type="button"
              onClick={() => removeFile(index)}
              className={`${isVideo ? "" : "self-end"} bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600 transition-colors`}
            >
              <XCircle size={18} />
            </button>
            {!isVideo && <p className="text-xs text-white truncate mt-1 px-1">{file.name}</p>}
          </div>
          {isVideo && (
            <div className="p-2 bg-white/90 text-xs truncate border-t">
              {file.name}
            </div>
          )}
        </div>
      ))}
    </div>
  </div>
);
