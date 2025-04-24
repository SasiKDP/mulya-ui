import { useSelector } from "react-redux";
import { addtoPlacementHandler } from "../redux/commonSlice";
import axios from "axios";

export const validateIfPlaced = async(interviewStatus, data, dispatch) => {
    
    console.log("Inside Validate if placed");
    console.log(data);
      if(interviewStatus === "Placed" || interviewStatus === "PLACED" || interviewStatus === "placed") {
          dispatch(addtoPlacementHandler(data));
      }
      return;
}