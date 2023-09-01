import { useContext, useState } from "react";
import { collection } from "firebase/firestore";
import { db } from "../../../../firebase/firestore.utils";

import { ArrowUpward, Close } from "@mui/icons-material";
import { TextField } from "@mui/material";
import { ToastContext } from "../../../../context/toastContext";
import { createUnNamedDocument } from "../../../../firebase/firestore.utils";
import { getFormattedExactTime } from "../../../../utilities/dateUtils";

const CreateCategory = ({ tab, closeModalOne }) => {
  const { dispatch } = useContext(ToastContext);

  const [name, setName] = useState("");

  const submitCategory = (e) => {
    e.preventDefault();
    const newCategory = {
      equipmentTab: tab.name,
      name: name,
    };
    createUnNamedDocument(collection(db, "equipmentSubCategories"), newCategory)
      .then(() => {
        dispatch({
          type: "ADD_NOTIFICATION",
          payload: {
            id: getFormattedExactTime(new Date()),
            type: "SUCCESS",
            title: "Create Category",
            message: "Created a category in the cloud",
          },
        });
        closeModalOne();
      })
      .catch((error) => {
        dispatch({
          type: "ADD_NOTIFICATION",
          payload: {
            id: getFormattedExactTime(new Date()),
            type: "ERROR",
            title: "Create Category",
            message: "There was an error creating",
          },
        });
        console.log("Firebase error: ", error);
      });
  };

  return (
    <div>
      <form onSubmit={submitCategory} autoComplete="new password">
        <div className="row">
          <div className="singleRowInput">
            <TextField
              label="Category"
              fullWidth
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
        </div>
        <div className="row">
          <div className="singleRowInput">
            <div className="centerInfo textTeal">
              Format: Brand Name, Efficiency, Features
            </div>
          </div>
        </div>
        <div className="buttonBar">
          <button
            type="button"
            className="standardButton"
            onClick={() => closeModalOne()}
          >
            <Close />
            <span className="iconSeperation">Close</span>
          </button>
          <button type="submit" className="standardButton">
            <ArrowUpward />
            <span className="iconSeperation">Submit</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateCategory;
