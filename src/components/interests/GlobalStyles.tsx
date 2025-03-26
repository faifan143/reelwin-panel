// GlobalStyles.tsx
import React from "react";

const GlobalStyles: React.FC = () => {
  return (
    <style jsx global>{`
      .custom-message-rtl {
        direction: rtl;
        text-align: right;
      }

      .ant-select-selection-item,
      .ant-select-item-option-content {
        text-align: right;
      }

      .ant-modal-close {
        right: auto;
        left: 17px;
      }

      .ant-form-item-label {
        text-align: right;
      }

      /* Fix InputNumber in RTL */
      .ant-input-number {
        direction: ltr;
      }

      .ant-input-number-handler-wrap {
        direction: ltr;
      }

      /* Add hover effects to table rows */
      .ant-table-tbody > tr.ant-table-row:hover > td {
        background-color: rgba(59, 130, 246, 0.05);
      }

      /* Improve table head styling */
      .ant-table-thead > tr > th {
        background-color: #f0f9ff;
        color: #1e40af;
        font-weight: bold;
      }

      /* Make the scrollbar pretty */
      ::-webkit-scrollbar {
        width: 8px;
        height: 8px;
      }

      ::-webkit-scrollbar-track {
        background: #f1f1f1;
        border-radius: 10px;
      }

      ::-webkit-scrollbar-thumb {
        background: #bfdbfe;
        border-radius: 10px;
      }

      ::-webkit-scrollbar-thumb:hover {
        background: #93c5fd;
      }

      /* Mobile optimizations */
      @media (max-width: 639px) {
        .ant-form-item {
          margin-bottom: 16px;
        }

        /* Improve tap targets for mobile */
        .ant-btn {
          min-height: 36px;
          min-width: 36px;
        }

        /* Make form elements more touch-friendly */
        .ant-input,
        .ant-input-number,
        .ant-select-selector {
          height: 40px !important;
        }

        .ant-select-selector {
          padding: 4px 11px !important;
        }
      }
    `}</style>
  );
};

export default GlobalStyles;
