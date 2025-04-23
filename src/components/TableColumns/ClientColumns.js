import { Skeleton } from "@mui/material";

export const generateClientColumns = (loading = false) => [
    {
      key: 'clientId',
      label: 'Client ID',
      type: 'text',
      sortable: true,
      filterable: true,
      width: 150,
      render: loading ? () => <Skeleton variant="text" width={100} /> : undefined
    },
    {
      key: 'clientName',
      label: 'Client Name',
      type: 'text',
      sortable: true,
      filterable: true,
      width: 200,
      render: loading ? () => <Skeleton variant="text" width={140} /> : undefined
    },
    {
      key: 'onBoardedBy',
      label: 'Onboarded By',
      type: 'text',
      sortable: true,
      filterable: true,
      width: 180,
      render: loading ? () => <Skeleton variant="text" width={120} /> : undefined
    },
    {
      key: 'clientSpocName',
      label: 'SPOC Name(s)',
      type: 'text',
      width: 200,
      render: (row) =>
        loading ? (
          <Skeleton variant="text" width={120} />
        ) : Array.isArray(row.clientSpocName) ? (
          row.clientSpocName.join(', ')
        ) : (
          'N/A'
        )
    },
    {
      key: 'clientSpocEmailid',
      label: 'SPOC Email(s)',
      type: 'text',
      width: 250,
      render: (row) =>
        loading ? (
          <Skeleton variant="text" width={160} />
        ) : Array.isArray(row.clientSpocEmailid) ? (
          row.clientSpocEmailid.join(', ')
        ) : (
          'N/A'
        )
    },
    {
      key: 'clientSpocMobileNumber',
      label: 'SPOC Phone(s)',
      type: 'text',
      width: 200,
      render: (row) =>
        loading ? (
          <Skeleton variant="text" width={120} />
        ) : Array.isArray(row.clientSpocMobileNumber) ? (
          row.clientSpocMobileNumber.join(', ')
        ) : (
          'N/A'
        )
    },
    {
      key: 'clientAddress',
      label: 'Address',
      type: 'text',
      width: 250,
      render: (row) =>
        loading ? (
          <Skeleton variant="text" width={160} />
        ) : row.clientAddress?.trim() ? (
          row.clientAddress
        ) : (
          'Not provided'
        )
    }
  ];