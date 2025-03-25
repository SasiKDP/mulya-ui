import React from 'react';
import ReusableTable from './ReusableTable';

const ClientDetailsTab = ({ clientDetails }) => {
  const columns = [
    { key: 'clientId', label: 'Client ID' },
    { key: 'clientName', label: 'Client Name' },
    { key: 'clientAddress', label: 'Client Address' },
    { key: 'clientSpocName', label: 'SPOC Name', render: (value) => value?.[0] || '—' },
    { key: 'clientSpocEmailid', label: 'SPOC Email', render: (value) => value?.[0] || '—' },
    { key: 'clientSpocMobileNumber', label: 'SPOC Mobile', render: (value) => value?.[0] || '—' }
  ];

  return <ReusableTable columns={columns} data={clientDetails} />;
};

export default ClientDetailsTab;
