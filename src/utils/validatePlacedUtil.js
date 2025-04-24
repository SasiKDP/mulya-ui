import { useSelector } from "react-redux";
import { addtoPlacementHandler } from "../redux/commonSlice";
import axios from "axios";

export const validateIfPlaced = async(interviewStatus, data, dispatch) => {
    
      if(interviewStatus === "Placed" || interviewStatus === "PLACED" || interviewStatus === "placed") {
        dispatch(addtoPlacementHandler(data));
      }
      return;
}
