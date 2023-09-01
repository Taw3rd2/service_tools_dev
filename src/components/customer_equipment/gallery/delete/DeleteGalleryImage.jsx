import { useContext } from "react";
import { ToastContext } from "../../../../context/toastContext";
import { deleteEquipmentGalleryImage } from "../../customerEquipmentFunctions";
import { Close, DeleteForever } from "@mui/icons-material";
import "../../../../global_style/style.css";
import { getFormattedDateAndTime } from "../../../../utilities/dateUtils";

const DeleteGalleryImage = ({
  customer,
  selectedEquipment,
  selectedImage,
  closeImageViewer,
  closeDelete,
}) => {
  const { dispatch } = useContext(ToastContext);

  const activateDeleteCompletionNotification = () => {
    dispatch({
      type: "ADD_NOTIFICATION",
      payload: {
        id: getFormattedDateAndTime(new Date()),
        type: "SUCCESS",
        title: "Delete Gallery Image",
        message: "Image was deleted from the cloud",
      },
    });
  };

  const activateDeleteFailureNotification = () => {
    dispatch({
      type: "ADD_NOTIFICATION",
      payload: {
        id: getFormattedDateAndTime(new Date()),
        type: "ERROR",
        title: "Delete Gallery Image",
        message: "There was an error deleting the image",
      },
    });
  };

  const deleteSelectedGalleryImage = () => {
    deleteEquipmentGalleryImage(
      customer,
      selectedEquipment,
      selectedImage,
      activateDeleteCompletionNotification,
      activateDeleteFailureNotification,
      closeImageViewer,
      closeDelete
    );
  };

  return (
    <div className="container">
      <div className="deleteWarningText">Unrecoverable Delete!</div>
      <div className="buttonBar">
        {selectedImage !== undefined && (
          <button
            type="button"
            className="deleteButton"
            onClick={() => deleteSelectedGalleryImage()}
          >
            <DeleteForever />
            <span className="iconSeperation">Confirm Unrecoverable Delete</span>
          </button>
        )}
        <button
          type="button"
          className="standardButton"
          onClick={() => closeDelete()}
        >
          <Close />
          <span className="iconSeperation">Close</span>
        </button>
      </div>
    </div>
  );
};

export default DeleteGalleryImage;
