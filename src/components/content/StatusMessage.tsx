export const StatusMessage = ({ type, title, message, error }: StatusMessageProps) => {
  const colors = {
    success: {
      bg: "bg-green-50",
      border: "border-green-200",
      text: "text-green-700",
      iconBg: "bg-green-100",
      iconText: "text-green-600"
    },
    error: {
      bg: "bg-red-50",
      border: "border-red-200",
      text: "text-red-700",
      iconBg: "bg-red-100",
      iconText: "text-red-600"
    },
    loading: {
      bg: "bg-blue-50",
      border: "border-blue-200",
      text: "text-blue-800",
      iconBg: "bg-blue-100",
      iconText: "text-blue-600"
    }
  };

  const icons = {
    success: (
      <svg
        className={`h-6 w-6 ${colors[type].iconText}`}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M5 13l4 4L19 7"
        />
      </svg>
    ),
    error: (
      <svg
        className={`h-6 w-6 ${colors[type].iconText}`}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M6 18L18 6M6 6l12 12"
        />
      </svg>
    ),
    loading: (
      <svg
        className={`animate-pulse ${colors[type].iconText} h-5 w-5`}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fillRule="evenodd"
          d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
          clipRule="evenodd"
        />
      </svg>
    )
  };

  return (
    <div className={`p-4 ${colors[type].bg} border ${colors[type].border} rounded-lg shadow-md ${colors[type].text} flex items-center mt-6 ${type !== 'loading' ? 'animate-fade-in' : ''}`}>
      <div className={`${colors[type].iconBg} rounded-full p-2 mr-3`}>
        {icons[type]}
      </div>
      <div>
        <h4 className="font-bold">{title}</h4>
        <p className="text-sm mt-1">
          {type === 'error' && error?.message ? error.message : message}
        </p>
      </div>
      {type === 'loading' && (
        <div className="progress-bar-container">
          <div className="progress-bar-indeterminate"></div>
        </div>
      )}
    </div>
  );
};
