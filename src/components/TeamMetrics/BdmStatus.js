import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Divider,
  CircularProgress,
  Chip,
  Button,
  Tabs,
  Tab,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import httpService from '../../Services/httpService';

const BdmStatus = () => {
  const { employeeId } = useParams();
  const navigate = useNavigate();
  const [employeeData, setEmployeeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tabValue, setTabValue] = useState(0);

  // useEffect(() => {
  //   if (employeeId) {
  //     // Simulating API call with your provided JSON data
  //     try {
        
  //       setEmployeeData(mockData);
  //       setLoading(false);
  //     } catch (err) {
  //       console.error(err);
  //       setError('Failed to fetch employee');
  //       setLoading(false);
  //     }
  //   }
  // }, [employeeId]);

  

  useEffect(() => {
    if (employeeId) {
      httpService
        .get(`/requirements/bdm/details/${employeeId}`)
        .then((res) => {
          setEmployeeData(res.data);
          setLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setError('Failed to fetch employee');
          setLoading(false);
        });
    }
  }, [employeeId]);


  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error || !employeeData) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h5" color="error">
          {error || 'Employee not found'}
        </Typography>
      </Box>
    );
  }

  const { bdmDetails, clientDetails, requirements, submissions, interviews, placements } = employeeData || {};
  const employee = bdmDetails?.[0];

  return (
    <Box >
      <Button
        variant="outlined"
        onClick={() => navigate('/dashboard/team-metrics')}
        sx={{ mb: 2 }}
        startIcon={<ArrowBackIcon />}
      >
        Back to Team Metrics
      </Button>


      <Paper sx={{ mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange} variant="scrollable" scrollButtons="auto">
          <Tab label="Employee Details" />
          <Tab label="Client Details" />
          <Tab label="Requirements" />
          <Tab label="Submissions" />
          <Tab label="Interviews" />
          <Tab label="Placements" />
        </Tabs>
      </Paper>

      {tabValue === 0 && (
        <Card>
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>
                  Basic Information
                </Typography>
                <Divider sx={{ mb: 2 }} />

                <Grid container spacing={2}>
                  <Grid item xs={4}>
                    <Typography variant="subtitle2">Employee ID:</Typography>
                  </Grid>
                  <Grid item xs={8}>
                    <Typography>{employee.employeeId}</Typography>
                  </Grid>

                  <Grid item xs={4}>
                    <Typography variant="subtitle2">Name:</Typography>
                  </Grid>
                  <Grid item xs={8}>
                    <Typography>{employee.userName}</Typography>
                  </Grid>

                  <Grid item xs={4}>
                    <Typography variant="subtitle2">Email:</Typography>
                  </Grid>
                  <Grid item xs={8}>
                    <Typography>{employee.email}</Typography>
                  </Grid>

                  <Grid item xs={4}>
                    <Typography variant="subtitle2">Designation:</Typography>
                  </Grid>
                  <Grid item xs={8}>
                    <Typography>{employee.designation}</Typography>
                  </Grid>

                  <Grid item xs={4}>
                    <Typography variant="subtitle2">Status:</Typography>
                  </Grid>
                  <Grid item xs={8}>
                    <Chip
                      label={employee.status}
                      color={employee.status === 'ACTIVE' ? 'success' : 'error'}
                      size="small"
                    />
                  </Grid>
                </Grid>
              </Grid>

              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>
                  Additional Details
                </Typography>
                <Divider sx={{ mb: 2 }} />

                <Grid container spacing={2}>
                  <Grid item xs={4}>
                    <Typography variant="subtitle2">Joining Date:</Typography>
                  </Grid>
                  <Grid item xs={8}>
                    <Typography>
                      {employee.joiningDate ? new Date(employee.joiningDate).toLocaleDateString() : '-'}
                    </Typography>
                  </Grid>

                  <Grid item xs={4}>
                    <Typography variant="subtitle2">Date of Birth:</Typography>
                  </Grid>
                  <Grid item xs={8}>
                    <Typography>
                      {employee.dob ? new Date(employee.dob).toLocaleDateString() : '-'}
                    </Typography>
                  </Grid>

                  <Grid item xs={4}>
                    <Typography variant="subtitle2">Phone:</Typography>
                  </Grid>
                  <Grid item xs={8}>
                    <Typography>{employee.phoneNumber || '-'}</Typography>
                  </Grid>

                  <Grid item xs={4}>
                    <Typography variant="subtitle2">Personal Email:</Typography>
                  </Grid>
                  <Grid item xs={8}>
                    <Typography>{employee.personalEmail || '-'}</Typography>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      )}

      {tabValue === 1 && (
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Client Details ({clientDetails.length} clients)
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Client ID</TableCell>
                    <TableCell>Client Name</TableCell>
                    <TableCell>SPOC Name</TableCell>
                    <TableCell>SPOC Email</TableCell>
                    <TableCell>SPOC Phone</TableCell>
                    <TableCell>Address</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {clientDetails.map((client) => (
                    <TableRow key={client.clientId}>
                      <TableCell>{client.clientId}</TableCell>
                      <TableCell>{client.clientName}</TableCell>
                      <TableCell>
                        {client.clientSpocName.join(', ')}
                      </TableCell>
                      <TableCell>
                        {client.clientSpocEmailid.join(', ')}
                      </TableCell>
                      <TableCell>
                        {client.clientSpocMobileNumber.join(', ')}
                      </TableCell>
                      <TableCell>
                        {client.clientAddress || 'Not provided'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      )}

      {tabValue === 2 && (
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Requirements by Client
            </Typography>
            <Divider sx={{ mb: 2 }} />
            {Object.entries(requirements).map(([clientName, reqs]) => (
              <Box key={clientName} sx={{ mb: 4 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
                  {clientName} ({reqs.length} requirements)
                </Typography>
                {reqs.length > 0 ? (
                  <TableContainer component={Paper}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Job ID</TableCell>
                          <TableCell>Job Title</TableCell>
                          <TableCell>Recruiter</TableCell>
                          <TableCell>Location</TableCell>
                          <TableCell>Notice Period</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {reqs.map((req, index) => (
                          <TableRow key={index}>
                            <TableCell>{req.jobId}</TableCell>
                            <TableCell>{req.jobTitle}</TableCell>
                            <TableCell>{req.recruiterName}</TableCell>
                            <TableCell>{req.location}</TableCell>
                            <TableCell>{req.noticePeriod}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                ) : (
                  <Typography variant="body2" color="textSecondary">
                    No requirements found for this client.
                  </Typography>
                )}
              </Box>
            ))}
          </CardContent>
        </Card>
      )}

      {tabValue === 3 && (
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Submissions by Client
            </Typography>
            <Divider sx={{ mb: 2 }} />
            {Object.entries(submissions).map(([clientName, subs]) => (
              <Box key={clientName} sx={{ mb: 4 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
                  {clientName} ({subs.length} submissions)
                </Typography>
                {subs.length > 0 ? (
                  <TableContainer component={Paper}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Candidate</TableCell>
                          <TableCell>Job Title</TableCell>
                          <TableCell>Contact</TableCell>
                          <TableCell>Skills</TableCell>
                          <TableCell>Feedback</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {subs.map((sub, index) => (
                          <TableRow key={index}>
                            <TableCell>
                              <Box display="flex" alignItems="center">
                                <Avatar sx={{ width: 24, height: 24, mr: 1 }}>
                                  {sub.fullName.charAt(0)}
                                </Avatar>
                                {sub.fullName}
                              </Box>
                            </TableCell>
                            <TableCell>{sub.jobTitle}</TableCell>
                            <TableCell>
                              <Typography variant="body2">{sub.candidateEmailId}</Typography>
                              <Typography variant="body2">{sub.contactNumber}</Typography>
                            </TableCell>
                            <TableCell>{sub.skills}</TableCell>
                            <TableCell>{sub.overallFeedback}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                ) : (
                  <Typography variant="body2" color="textSecondary">
                    No submissions found for this client.
                  </Typography>
                )}
              </Box>
            ))}
          </CardContent>
        </Card>
      )}

      {tabValue === 4 && (
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Interviews by Client
            </Typography>
            <Divider sx={{ mb: 2 }} />
            {Object.entries(interviews).map(([clientName, ints]) => (
              <Box key={clientName} sx={{ mb: 4 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
                  {clientName} ({ints.length} interviews)
                </Typography>
                {ints.length > 0 ? (
                  <List>
                    {ints.map((int, index) => (
                      <ListItem key={index} divider>
                        <ListItemAvatar>
                          <Avatar>{int.fullName.charAt(0)}</Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={int.fullName}
                          secondary={
                            <>
                              <Typography component="span" variant="body2" display="block">
                                {int.skills}
                              </Typography>
                              <Typography component="span" variant="body2" display="block">
                                Interview: {new Date(int.interviewDateTime).toLocaleString()}
                              </Typography>
                              <Typography component="span" variant="body2" display="block">
                                Level: {int.interviewLevel}
                              </Typography>
                            </>
                          }
                        />
                      </ListItem>
                    ))}
                  </List>
                ) : (
                  <Typography variant="body2" color="textSecondary">
                    No interviews found for this client.
                  </Typography>
                )}
              </Box>
            ))}
          </CardContent>
        </Card>
      )}

      {tabValue === 5 && (
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Placements by Client
            </Typography>
            <Divider sx={{ mb: 2 }} />
            {Object.entries(placements).map(([clientName, places]) => (
              <Box key={clientName} sx={{ mb: 4 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
                  {clientName} ({places.length} placements)
                </Typography>
                {places.length > 0 ? (
                  <Typography>Placement data would be displayed here</Typography>
                ) : (
                  <Typography variant="body2" color="textSecondary">
                    No placements found for this client.
                  </Typography>
                )}
              </Box>
            ))}
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default BdmStatus;