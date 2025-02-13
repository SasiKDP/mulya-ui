import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
//import appconfig.PROD_appconfig.PROD_BASE_URL from "../../redux/apiConfig";

const appconfig = require("../apiConfig");

const useEmployees = (roleFilter = 'EMPLOYEE') => {
  const [employees, setEmployees] = useState([]);
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEmployees = async () => {
      setStatus('loading');
      try {
        const response = await axios.get(`${appconfig.PROD_appconfig.PROD_BASE_URL}/users/employee`);
        const allEmployees = response.data;
        
        // Apply role filtering if specified
        const filteredEmployees = roleFilter 
          ? allEmployees.filter(employee => employee.roles === roleFilter)
          : allEmployees;
        
        setEmployees(filteredEmployees);
        setStatus('succeeded');
      } catch (error) {
        setStatus('failed');
        setError(error.message);
        toast.error(`Failed to fetch employees: ${error.message}`);
      }
    };

    if (status === 'idle') {
      fetchEmployees();
    }
  }, [roleFilter, status]);

  const refetch = () => {
    setStatus('idle');
  };

  return {
    employees,
    status,
    error,
    refetch
  };
};

export default useEmployees;