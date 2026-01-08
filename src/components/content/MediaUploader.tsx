import { ChangeEvent, useRef } from "react";
import { MediaUploaderProps } from "./type";
import { Upload } from "lucide-react";

export const MediaUploader = ({
  label,
  icon,
  fileType,
  accept,
  colorScheme,
  files,
  onFilesChange,
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
      <label className="block font-semibold text-slate-200 mb-3 flex items-center">
        {icon}
        {label} *
      </label>
      <div className="flex flex-col space-y-4">
        <label
          className={`flex items-center justify-center p-8 bg-slate-800/50 border-2 border-dashed border-slate-600 rounded-xl cursor-pointer hover:border-blue-500 hover:bg-slate-700/50 group transition-all duration-300`}
        >
          <div className="flex flex-col items-center text-center">
            <div
              className={`${colorScheme.bg} rounded-full p-4 mb-4 group-hover:scale-110 transition-transform`}
            >
              <Upload className={`h-7 w-7 ${colorScheme.text}`} />
            </div>
            <span className={`text-slate-200 font-semibold mb-2 text-lg`}>
              اضغط أو اسحب لإضافة {fileType}
            </span>
            <span className="text-slate-400 text-sm">
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
