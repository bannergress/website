import { useSelector } from "react-redux";
import { RootState } from "../../storeTypes";

const getSettings = (state: RootState) => state.settings

export const useSettings = function() {
  return useSelector(getSettings)
}
