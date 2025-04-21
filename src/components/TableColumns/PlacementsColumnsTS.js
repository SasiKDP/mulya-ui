import { Skeleton } from "@mui/material";

export const generatePlacementsColumns = (loading = false) => [
    {
      key: 'candidateId',
      label: 'Candidate ID',
      sortable: true,
      filterable: true,
      render: loading ? () => <Skeleton width={100} /> : undefined,
    },
    {
      key: 'fullName',
      label: 'Full Name',
      sortable: true,
      filterable: true,
      render: loading ? () => <Skeleton width={150} /> : undefined,
    },
    {
      key: 'candidateEmailId',
      label: 'Email ID',
      sortable: true,
      filterable: true,
      render: loading ? () => <Skeleton width={200} /> : undefined,
    },
    {
      key: 'jobId',
      label: 'Job ID',
      sortable: true,
      filterable: true,
      render: loading ? () => <Skeleton width={80} /> : undefined,
    },
    {
      key: 'jobTitle',
      label: 'Job Title',
      sortable: true,
      filterable: true,
      render: loading ? () => <Skeleton width={180} /> : undefined,
    },
    {
      key: 'clientName',
      label: 'Client Name',
      sortable: true,
      filterable: true,
      render: loading ? () => <Skeleton width={140} /> : undefined,
    },
  ];
  