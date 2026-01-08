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

      /* Dark Table Styling */
      .dark-table .ant-table {
        background: transparent;
        color: #f8fafc;
      }

      .dark-table .ant-table-thead > tr > th {
        background: rgba(30, 41, 59, 0.5);
        border-bottom: 1px solid rgba(71, 85, 105, 0.5);
        color: #e2e8f0;
        font-weight: 600;
        padding: 16px;
      }

      .dark-table .ant-table-tbody > tr {
        background: transparent;
        transition: all 0.3s ease;
      }

      .dark-table .ant-table-tbody > tr > td {
        border-bottom: 1px solid rgba(71, 85, 105, 0.3);
        color: #f8fafc;
        padding: 16px;
      }

      .dark-table .ant-table-tbody > tr.ant-table-row:hover > td {
        background-color: rgba(30, 41, 59, 0.5);
      }

      .dark-table .ant-empty-description {
        color: #94a3b8;
      }

      /* Dark Pagination */
      .dark-pagination .ant-pagination-item {
        background: rgba(30, 41, 59, 0.5);
        border: 1px solid rgba(71, 85, 105, 0.5);
      }

      .dark-pagination .ant-pagination-item a {
        color: #e2e8f0;
      }

      .dark-pagination .ant-pagination-item-active {
        background: #3b82f6;
        border-color: #3b82f6;
      }

      .dark-pagination .ant-pagination-item-active a {
        color: #ffffff;
      }

      .dark-pagination .ant-pagination-prev button,
      .dark-pagination .ant-pagination-next button {
        color: #e2e8f0;
        background: rgba(30, 41, 59, 0.5);
        border: 1px solid rgba(71, 85, 105, 0.5);
      }

      .dark-pagination .ant-pagination-disabled button {
        color: #475569;
      }

      .dark-pagination .ant-select-selector {
        background: rgba(30, 41, 59, 0.5) !important;
        border-color: rgba(71, 85, 105, 0.5) !important;
        color: #e2e8f0 !important;
      }

      .dark-pagination .ant-select-arrow {
        color: #e2e8f0;
      }

      .dark-pagination .ant-pagination-options-quick-jumper input {
        background: rgba(30, 41, 59, 0.5);
        border-color: rgba(71, 85, 105, 0.5);
        color: #e2e8f0;
      }

      /* Dark Popconfirm */
      .dark-popconfirm .ant-popover-inner {
        background: #1e293b;
        border: 1px solid rgba(71, 85, 105, 0.5);
      }

      .dark-popconfirm .ant-popover-arrow::before,
      .dark-popconfirm .ant-popover-arrow::after {
        background: #1e293b;
      }

      .dark-popconfirm .ant-popover-message-title {
        color: #f8fafc;
      }

      .dark-popconfirm .ant-popover-inner-content {
        color: #cbd5e1;
      }

      .dark-popconfirm .ant-btn-default {
        background: rgba(71, 85, 105, 0.5);
        border-color: rgba(71, 85, 105, 0.5);
        color: #e2e8f0;
      }

      .dark-popconfirm .ant-btn-default:hover {
        background: rgba(71, 85, 105, 0.7);
        border-color: rgba(71, 85, 105, 0.7);
        color: #f8fafc;
      }

      /* Dark Modal Styling */
      .dark-modal .ant-modal-content {
        background: #1e293b;
        border: 1px solid rgba(71, 85, 105, 0.5);
        box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
      }

      .dark-modal .ant-modal-header {
        background: #1e293b;
        border-bottom: 1px solid rgba(71, 85, 105, 0.5);
      }

      .dark-modal .ant-modal-title {
        color: #f8fafc;
      }

      .dark-modal .ant-modal-close {
        color: #94a3b8;
      }

      .dark-modal .ant-modal-close:hover {
        color: #f8fafc;
      }

      .dark-modal .ant-modal-body {
        background: #1e293b;
      }

      /* Dark Form Input */
      .dark-input {
        background: rgba(30, 41, 59, 0.5) !important;
        border-color: rgba(71, 85, 105, 0.5) !important;
        color: #f8fafc !important;
      }

      .dark-input::placeholder {
        color: #64748b !important;
      }

      .dark-input:hover,
      .dark-input:focus {
        border-color: #3b82f6 !important;
        background: rgba(30, 41, 59, 0.7) !important;
      }

      .dark-input .ant-input-suffix {
        color: #94a3b8;
      }

      /* Dark Select */
      .dark-select .ant-select-selector {
        background: rgba(30, 41, 59, 0.5) !important;
        border-color: rgba(71, 85, 105, 0.5) !important;
        color: #f8fafc !important;
      }

      .dark-select .ant-select-arrow {
        color: #94a3b8;
      }

      .dark-select:hover .ant-select-selector {
        border-color: #3b82f6 !important;
      }

      .dark-select.ant-select-focused .ant-select-selector {
        border-color: #3b82f6 !important;
        box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2) !important;
      }

      /* Dark Select Dropdown */
      .ant-select-dropdown {
        background: #1e293b !important;
        border: 1px solid rgba(71, 85, 105, 0.5);
      }

      .ant-select-item {
        color: #f8fafc !important;
      }

      .ant-select-item-option-selected {
        background: rgba(59, 130, 246, 0.2) !important;
      }

      .ant-select-item-option-active {
        background: rgba(59, 130, 246, 0.1) !important;
      }

      /* Dark InputNumber */
      .dark-input-number {
        background: rgba(30, 41, 59, 0.5) !important;
        border-color: rgba(71, 85, 105, 0.5) !important;
      }

      .dark-input-number .ant-input-number-input {
        color: #f8fafc !important;
        background: transparent !important;
      }

      .dark-input-number:hover {
        border-color: #3b82f6 !important;
      }

      .dark-input-number.ant-input-number-focused {
        border-color: #3b82f6 !important;
        box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2) !important;
      }

      .dark-input-number .ant-input-number-handler {
        border-left-color: rgba(71, 85, 105, 0.5);
        color: #94a3b8;
      }

      .dark-input-number .ant-input-number-handler:hover {
        background: rgba(71, 85, 105, 0.3);
      }

      /* Dark Button Cancel */
      .dark-button-cancel {
        background: rgba(71, 85, 105, 0.3) !important;
        border-color: rgba(71, 85, 105, 0.5) !important;
        color: #e2e8f0 !important;
      }

      .dark-button-cancel:hover {
        background: rgba(71, 85, 105, 0.5) !important;
        border-color: rgba(71, 85, 105, 0.7) !important;
        color: #f8fafc !important;
      }

      /* Dark Form Item */
      .dark-modal .ant-form-item-label > label {
        color: #e2e8f0;
      }

      .dark-modal .ant-form-item-explain-error {
        color: #fca5a5;
      }

      /* Make the scrollbar pretty - Dark Theme */
      ::-webkit-scrollbar {
        width: 8px;
        height: 8px;
      }

      ::-webkit-scrollbar-track {
        background: #1e293b;
        border-radius: 10px;
      }

      ::-webkit-scrollbar-thumb {
        background: #475569;
        border-radius: 10px;
      }

      ::-webkit-scrollbar-thumb:hover {
        background: #64748b;
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
