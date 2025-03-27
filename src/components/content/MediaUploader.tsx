
const MediaUploader = ({ 
  label, 
  icon, 
  fileType, 
  accept, 
  colorScheme, 
  files, 
  onFilesChange 
}: MediaUploaderProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      onFilesChange([...files, ...newFiles]);

      // Reset input to allow selecting the same file again
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <div className="mb-8">
      <label className="block font-semibold text-gray-700 mb-3 flex items-center">
        {icon}
        {label} *
      </label>
      <div className="flex flex-col space-y-4">
        <label className={`flex items-center justify-center p-6 ${colorScheme.gradient} border-2 border-dashed ${colorScheme.border} rounded-xl cursor-pointer ${colorScheme.hover} group transition-all duration-300`}>
          <div className="flex flex-col items-center text-center">
            <div className={`${colorScheme.bg} rounded-full p-3 mb-3 group-hover:bg-${colorScheme.hover} transition-colors`}>
              <Upload className={`h-6 w-6 ${colorScheme.text}`} />
            </div>
            <span className={`${colorScheme.text} font-semibold mb-1`}>
              اضغط أو اسحب لإضافة {fileType}
            </span>
            <span className="text-gray-500 text-sm">
              {accept} حتى {fileType === "صور" ? "10MB" : "100MB"}
            </span>
          </div>
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept={accept === "PNG, JPG أو JPEG" ? "image/*" : "video/*"}
            onChange={handleFileChange}
            multiple
          />
        </label>
      </div>
    </div>
  );
};
