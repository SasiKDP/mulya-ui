import { Skeleton } from "@mui/material";

export const generateRequirementColumns = (loading = false) => [
    {
      key: 'jobId',
      label: 'Job ID',
      type: 'text',
      sortable: true,
      filterable: true,
      width: 120,
      render: loading ? () => <Skeleton variant="text" width={80} /> : undefined
    },
    {
      key: 'jobTitle',
      label: 'Job Title',
      type: 'text',
      sortable: true,
      filterable: true,
      width: 220,
      render: loading ? () => <Skeleton variant="text" width={140} /> : undefined
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
      key: 'recruiterName',
      label: 'Recruiter',
      type: 'text',
      sortable: true,
      filterable: true,
      width: 150,
      render: loading ? () => <Skeleton variant="text" width={100} /> : undefined
    },
    {
      key: 'location',
      label: 'Location',
      type: 'text',
      sortable: true,
      filterable: true,
      width: 300,
      render: loading ? () => <Skeleton variant="text" width={200} /> : undefined
    },
    {
      key: 'noticePeriod',
      label: 'Notice Period',
      type: 'text',
      sortable: true,
      filterable: true,
      width: 150,
      render: loading ? () => <Skeleton variant="text" width={80} /> : undefined
    }
  ];
  