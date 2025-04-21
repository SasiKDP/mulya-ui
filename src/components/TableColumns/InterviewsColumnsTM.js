
import { Skeleton } from "@mui/material";

export const generateInterviewColumns = (loading = false) => [
    {
        key: 'candidateId',
        label: 'Candidate ID',
        type: 'text',
        sortable: true,
        filterable: true,
        width: 120,
        render: loading ? () => <Skeleton variant="text" width={80} /> : undefined
      },
      {
        key: 'fullName',
        label: 'Full Name',
        type: 'text',
        sortable: true,
        filterable: true,
        width: 120,
        render: loading ? () => <Skeleton variant="text" width={80} /> : undefined
      },
      {
        key: 'email' || 'candidateEmailId',
        label: 'Email',
        type: 'text',
        sortable: true,
        filterable: true,
        width: 120,
        render: loading ? () => <Skeleton variant="text" width={80} /> : undefined
      },
      {
        key: 'contactNumber',
        label: 'Contact Number',
        type: 'text',
        sortable: true,
        filterable: true,
        width: 120,
        render: loading ? () => <Skeleton variant="text" width={80} /> : undefined
      },
      {
        key: 'qualification',
        label: 'Qualification',
        type: 'text',
        sortable: true,
        filterable: true,
        width: 120,
        render: loading ? () => <Skeleton variant="text" width={80} /> : undefined
      },
      {
        key: 'skills',
        label: 'Skills',
        sortable: true,
        filterable: true,
        render: (row) =>
          loading
            ? <Skeleton width={120} />
            : typeof row.skills === 'string'
            ? row.skills
            : Array.isArray(row.skills)
            ? row.skills.join(', ')
            : 'N/A',
      },
      {
        key: 'interviewLevel',
        label: 'Interview Level',
        type: 'text',
        sortable: true,
        filterable: true,
        width: 120,
        render: loading ? () => <Skeleton variant="text" width={80} /> : undefined
      },
      {
        key: 'interviewDateTime',
        label: 'Interview Date',
        type: 'text',
        sortable: true,
        filterable: true,
        width: 120,
         render: (row) =>
            row.interviewDateTime
              ? new Date(row.interviewDateTime).toLocaleString()
              : '-',
      },
]

export const generateInterviewColumnsTeamLead = () => [
    {
      key: 'candidateId',
      label: 'Candidate ID',
      sortable: true,
      filterable: true,
    },
    {
      key: 'fullName',
      label: 'Full Name',
      sortable: true,
      filterable: true,
    },
    {
      key: 'candidateEmailId',
      label: 'Email',
      sortable: true,
      filterable: true,
    },
    {
      key: 'contactNumber',
      label: 'Contact Number',
      sortable: true,
      filterable: true,
    },
    {
      key: 'qualification',
      label: 'Qualification',
      sortable: true,
      filterable: true,
    },
    {
      key: 'skills',
      label: 'Skills',
      sortable: true,
      filterable: true,
      render: (row) =>
        row.skills && typeof row.skills === 'string'
          ? row.skills.split(',').join(', ')
          : '-',
    },
    {
      key: 'jobId',
      label: 'Job ID',
      sortable: true,
      filterable: true,
    },
    {
      key: 'jobTitle',
      label: 'Job Title',
      sortable: true,
      filterable: true,
    },
    {
      key: 'clientName',
      label: 'Client Name',
      sortable: true,
      filterable: true,
    },
    {
      key: 'interviewLevel',
      label: 'Interview Level',
      sortable: true,
      filterable: true,
    },
    {
      key: 'interviewStatus',
      label: 'Status',
      sortable: true,
      filterable: true,
    },
    {
      key: 'interviewDateTime',
      label: 'Interview Date',
      sortable: true,
      filterable: false,
      render: (row) =>
        row.interviewDateTime
          ? new Date(row.interviewDateTime).toLocaleString()
          : '-',
    },
  ];
  