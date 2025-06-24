import React from 'react'
import { useEffect,useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchInProgressData } from '../../redux/inProgressSlice'
import DataTable from '../muiComponents/DataTabel'


const InProgress = () => {
   
    const dispatch=useDispatch();
    const {inProgress,loading}=useSelector((state)=>state.inProgress)

 useEffect(()=>{
      dispatch(fetchInProgressData);
 },[dispatch])


 const generateColumns=()=>{
     
    return [
          {
            key:'jobId',
            label: "Job ID",
            type: "text",
            sortable: true,
            filterable: true,
            width: 120
          },
          {
            key:"bdmName",
            label:"Recruiter",
            type:"text",
            sortable:true,
            filterable:true,
            width:120
          },
          {
            key:"teamlead",
            label:"Team Lead",
            type:"text",
            sortable:true,
            filterable:true,
            width:120
          }
    ]
    
 }

  return (
     <>
       
       <DataTable
        // data={processedData}
        columns={generateColumns}
        title=""
        // loading={loading}
        // enableSelection={false}
        // defaultSortColumn="requirementAddedTimeStamp"
        // defaultSortDirection="desc"
        // defaultRowsPerPage={10}
        // refreshData={refreshData}
        primaryColor="#00796b"
        secondaryColor="#e0f2f1"
        customStyles={{
          headerBackground: "#1976d2",
          rowHover: "#e0f2f1",
          selectedRow: "#b2dfdb",
        }}
        // uniqueId="jobId"
      />

     </>
  )
}

export default InProgress