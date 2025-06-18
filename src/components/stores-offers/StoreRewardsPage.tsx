"use client"
import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { RewardStatus, UserReward } from '../rewards-managment/types';
import { getStoreRewardRequests, updateStoreRewardRequestStatus } from './storeRewardsApi';
import { useStoreAuth } from './StoreAuthContext';
import { Button, Card, Select, Table, Tag, message } from 'antd';

const statusOptions = [
  { label: 'قيد الانتظار', value: RewardStatus.PENDING },
  { label: 'تم التنفيذ', value: RewardStatus.FULFILLED },
  { label: 'مرفوض', value: RewardStatus.CANCELLED },
];

const statusColors = {
  PENDING: 'orange',
  FULFILLED: 'green',
  CANCELLED: 'red',
};

const StoreRewardsPage = () => {
  const { jwt, store } = useStoreAuth();
  const [status, setStatus] = useState<RewardStatus | undefined>(RewardStatus.PENDING);

  const {
    data: requests = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['store-rewards', store?.id, status],
    queryFn: () => getStoreRewardRequests(store?.id || '', status, jwt || ''),
    enabled: !!store?.id && !!jwt,
  });

  const mutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: RewardStatus }) =>
      updateStoreRewardRequestStatus(id, status, jwt || ''),
    onSuccess: () => {
      message.success('تم تحديث حالة الطلب');
      refetch();
    },
    onError: () => {
      message.error('حدث خطأ أثناء تحديث الحالة');
    },
  });

  const handleStatusChange = (id: string, status: RewardStatus) => {
    mutation.mutate({ id, status });
  };

  const columns = [
    {
      title: 'المستخدم',
      dataIndex: ['user', 'name'],
      key: 'user',
    },
    {
      title: 'رقم الهاتف',
      dataIndex: ['user', 'phone'],
      key: 'phone',
    },
    {
      title: 'المكافأة',
      dataIndex: ['reward', 'title'],
      key: 'reward',
    },
    {
      title: 'النقاط',
      dataIndex: 'pointsSpent',
      key: 'pointsSpent',
    },
    {
      title: 'تاريخ الطلب',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => new Date(date).toLocaleString('ar-EG'),
    },
    {
      title: 'الحالة',
      dataIndex: 'status',
      key: 'status',
      render: (status: RewardStatus) => <Tag color={statusColors[status]}>{statusOptions.find(s => s.value === status)?.label}</Tag>,
    },
    {
      title: 'إجراءات',
      key: 'actions',
      render: (_: any, record: UserReward) =>
        record.status === RewardStatus.PENDING ? (
          <>
            <Button type="primary" onClick={() => handleStatusChange(record.id, RewardStatus.FULFILLED)} style={{ marginLeft: 8 }}>
              تأكيد
            </Button>
            <Button danger onClick={() => handleStatusChange(record.id, RewardStatus.CANCELLED)}>
              إلغاء
            </Button>
          </>
        ) : null,
    },
  ];

  return (
    <Card title="طلبات مكافآت العملاء" style={{ margin: '2rem auto', maxWidth: 900 }}>
      <div style={{ marginBottom: 16, display: 'flex', gap: 16 }}>
        <span>تصفية حسب الحالة:</span>
        <Select
          value={status}
          onChange={setStatus}
          options={statusOptions}
          style={{ width: 180 }}
          allowClear
        />
      </div>
      <Table
        columns={columns}
        dataSource={requests}
        loading={isLoading}
        rowKey="id"
        pagination={{ pageSize: 10 }}
      />
    </Card>
  );
};

export default StoreRewardsPage;
