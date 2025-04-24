import { useSelector } from "react-redux";
import { addtoPlacementHandler } from "../redux/commonSlice";
import axios from "axios";

export const validateIfPlaced = async(interviewStatus, data, dispatch) => {
    
    console.log("Inside Validate if placed");
    console.log(data);
      if(interviewStatus === "Placed" || interviewStatus === "PLACED" || interviewStatus === "placed") {
         // dispatch(addtoPlacementHandler(data));
        const response = await axios.post('http://192.168.0.214:8085/candidate/placement/create-placement', data);
        console.log(response.data);
      }
      return;
}