import { Skeleton } from "@mui/material";

export const flattenSubmissions = (submissions) => {
    if (!submissions || typeof submissions !== 'object') return [];

    return Object.entries(submissions).flatMap(([clientName, list]) => {
      if (!Array.isArray(list)) return [];
      return list.map((submission) => ({
        ...submission,
        clientName: clientName.trim(),
      }));
    });
  };

 export const generateSubmissionColumns = (loading = false) => [
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
      render: loading ? () => <Skeleton width={120} /> : undefined,
    },
    {
      key: 'candidateEmailId',
      label: 'Email',
      sortable: true,
      filterable: true,
      render: loading ? () => <Skeleton width={180} /> : undefined,
    },
    {
      key: 'contactNumber',
      label: 'Contact Number',
      sortable: true,
      filterable: true,
      render: loading ? () => <Skeleton width={100} /> : undefined,
    },
    {
      key: 'qualification',
      label: 'Qualification',
      sortable: true,
      filterable: true,
      render: loading ? () => <Skeleton width={80} /> : undefined,
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
      key: 'overallFeedback',
      label: 'Feedback',
      sortable: true,
      filterable: false,
      render: loading ? () => <Skeleton width={150} /> : undefined,
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
      render: loading ? () => <Skeleton width={120} /> : undefined,
    },
    {
      key: 'clientName',
      label: 'Client Name',
      sortable: true,
      filterable: true,
      render: loading ? () => <Skeleton width={120} /> : undefined,
    }
  ];
  