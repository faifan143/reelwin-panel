// GlobalStyles.tsx
import React from "react";

const GlobalStyles: React.FC = () => {
  return (
    <style jsx global>{`
      .tab-button {
        padding: 8px 12px;
        font-size: 14px;
        font-weight: 600;
        color: #6b7280;
        cursor: pointer;
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        border-bottom: 2px solid transparent;
        transition: all 0.3s;
      }

      @media (min-width: 640px) {
        .tab-button {
          padding: 12px 30px;
          font-size: 16px;
          min-width: 140px;
        }
      }

      .tab-button:hover {
        color: #8b5cf6;
        background-color: rgba(139, 92, 246, 0.05);
      }

      .tab-button.active-tab {
        color: #8b5cf6;
        border-bottom-color: #8b5cf6;
        background-color: rgba(139, 92, 246, 0.1);
      }

      .rtl-table .ant-table-thead > tr > th,
      .rtl-table .ant-table-tbody > tr > td {
        text-align: right;
      }

      /* Mobile optimizations */
      @media (max-width: 639px) {
        .ant-table-thead > tr > th {
          padding: 8px 8px !important;
        }

        .ant-table-tbody > tr > td {
          padding: 8px 8px !important;
        }

        .ant-form-item {
          margin-bottom: 16px;
        }

        /* Improve tap targets for mobile */
        .ant-btn {
          min-height: 32px;
          min-width: 32px;
        }
      }
    `}</style>
  );
};

export default GlobalStyles;
