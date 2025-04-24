export const generateJobDetailsColumns = () => [
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
      key: 'noOfPositions',
      label: 'Positions',
      sortable: true,
      filterable: false,
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      filterable: true,
    },
    {
      key: 'jobMode',
      label: 'Mode',
      sortable: true,
      filterable: true,
        },
    {
      key: 'qualification',
      label: 'Qualification',
      sortable: false,
      filterable: true,
    },
    {
      key: 'jobType',
      label: 'Job Type',
      sortable: true,
      filterable: true,
    },
    {
      key: 'assignedBy',
      label: 'Assigned By',
      sortable: true,
      filterable: true,
    },
    {
        key: 'postedDate',
        label: 'Posted Date',
        sortable: true,
        filterable: false,
        render: (row) =>
            row.postedDate
              ? new Date(row.postedDate).toLocaleString()
              : '-',
      }
  ];
  