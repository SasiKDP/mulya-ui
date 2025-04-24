export const generateCandidateColumns = () => [
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
      key: 'overallFeedback',
      label: 'Feedback',
      sortable: false,
      filterable: true,
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
      label: 'Client',
      sortable: true,
      filterable: true,
    },
  ];
  