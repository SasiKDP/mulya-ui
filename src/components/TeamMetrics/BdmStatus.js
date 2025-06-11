import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
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
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { 
    filterTeamMetricsByDateRange, 
    fetchEmployeeDetails,
    selectEmployeeDetails,
    selectIsLoading
} from '../../redux/teamMetricsSlice';
import DataTable from '../muiComponents/DataTabel';
import { generateClientColumns } from '../TableColumns/ClientColumns';
import { flattenRequirements, generateRequirementColumns } from '../TableColumns/RequirementsColumnsTM';
import { flattenSubmissions, generateSubmissionColumns } from '../TableColumns/SubmissionsColumnsTS';
import { flattenArray } from '../../utils/FlattenArray';
import { generateInterviewColumns } from '../TableColumns/InterviewsColumnsTM';
import { generatePlacementsColumns } from '../TableColumns/PlacementsColumnsTS';

const BdmStatus = () => {
    const { employeeId } = useParams();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    
    const [tabValue, setTabValue] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    const employeeData = useSelector(selectEmployeeDetails);
    const isLoading = useSelector(selectIsLoading);

    useEffect(() => {
        if (employeeId) {
            setLoading(true);
            setError(null);
            
            const startDate = searchParams.get('startDate');
            const endDate = searchParams.get('endDate');
            
            const fetchData = async () => {
                try {
                    if (startDate && endDate) {
                        await dispatch(filterTeamMetricsByDateRange({ 
                            startDate, 
                            endDate, 
                            employeeId 
                        })).unwrap();
                    } else {
                        await dispatch(fetchEmployeeDetails(employeeId)).unwrap();
                    }
                    setLoading(false);
                } catch (err) {
                    setError(err.message || 'Failed to fetch employee');
                    setLoading(false);
                }
            };
            
            fetchData();
        }
    }, [employeeId, searchParams, dispatch]);

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    if (loading || isLoading) {
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
                <Button
                    variant="outlined"
                    onClick={() => navigate('/dashboard/team-metrics')}
                    sx={{ mt: 2 }}
                    startIcon={<ArrowBackIcon />}
                >
                    Back to Team Metrics
                </Button>
            </Box>
        );
    }

    const { bdmDetails, clientDetails, requirements, submissions, interviews, placements } = employeeData || {};
    const employee = bdmDetails?.[0];

    return (
        <Box sx={{minHeight: "100vh", overflow: "hidden"}}>
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
                <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                        <Card elevation={3} sx={{ height: '100%' }}>
                            <CardContent>
                                <Typography variant="h7" sx={{fontWeight: "bold"}} gutterBottom>
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
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <Card elevation={3} sx={{ height: '100%' }}>
                            <CardContent>
                                <Typography variant="h7" sx={{fontWeight: "bold"}} gutterBottom>
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
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            )}

            {tabValue === 1 && (
                <DataTable
                    data={clientDetails || []}
                    columns={generateClientColumns(loading)}
                    title={`Client Details`}
                    loading={loading}
                    enableSelection={false}
                    defaultSortColumn="clientName"
                    defaultSortDirection="asc"
                    defaultRowsPerPage={10}
                    primaryColor="#1976d2"
                    secondaryColor="#e0f2f1"
                    customStyles={{
                        headerBackground: "#1976d2",
                        rowHover: "#e0f2f1",
                        selectedRow: "#b2dfdb",
                    }}
                    uniqueId="clientId"
                />
            )}

            {tabValue === 2 && (
                <DataTable
                    data={flattenArray(requirements)}
                    columns={generateRequirementColumns(loading)}
                    title={`Requirement List`}
                    loading={loading}
                    enableSelection={false}
                    defaultSortColumn="clientName"
                    defaultSortDirection="asc"
                    defaultRowsPerPage={10}
                    primaryColor="#1976d2"
                    secondaryColor="#e0f2f1"
                    customStyles={{
                        headerBackground: "#1976d2",
                        rowHover: "#e0f2f1",
                        selectedRow: "#b2dfdb",
                    }}
                    uniqueId="jobId"
                />
            )}

            {tabValue === 3 && (
                <DataTable
                    data={flattenArray(submissions)}
                    columns={generateSubmissionColumns(loading)}
                    title={`Submissions List`}
                    loading={loading}
                    enableSelection={false}
                    defaultSortColumn="fullName"
                    defaultSortDirection="asc"
                    defaultRowsPerPage={10}
                    primaryColor="#1976d2"
                    secondaryColor="#e0f2f1"
                    customStyles={{
                        headerBackground: "#1976d2",
                        rowHover: "#e0f2f1",
                        selectedRow: "#b2dfdb",
                    }}
                    uniqueId="candidateId"
                />
            )}

            {tabValue === 4 && (
                <DataTable
                    data={flattenArray(interviews)}
                    columns={generateInterviewColumns(loading)}
                    title={`Interviews List`}
                    loading={loading}
                    enableSelection={false}
                    defaultSortColumn="fullName"
                    defaultSortDirection="asc"
                    defaultRowsPerPage={10}
                    primaryColor="#1976d2"
                    secondaryColor="#e0f2f1"
                    customStyles={{
                        headerBackground: "#1976d2",
                        rowHover: "#e0f2f1",
                        selectedRow: "#b2dfdb",
                    }}
                    uniqueId="candidateId"
                />
            )}

            {tabValue === 5 && (
                <DataTable
                    data={flattenArray(placements)}
                    columns={generatePlacementsColumns(loading)}
                    title={`Placements List`}
                    loading={loading}
                    enableSelection={false}
                    defaultSortColumn="fullName"
                    defaultSortDirection="asc"
                    defaultRowsPerPage={10}
                    primaryColor="#1976d2"
                    secondaryColor="#e0f2f1"
                    customStyles={{
                        headerBackground: "#1976d2",
                        rowHover: "#e0f2f1",
                        selectedRow: "#b2dfdb",
                    }}
                    uniqueId="candidateId"
                />
            )}
        </Box>
    );
};

export default BdmStatus;