import { deleteField, doc } from "firebase/firestore";
import { db, updateDocument } from "../../firebase/firestore.utils";
import { getFormattedDate } from "../../utilities/dateUtils";

export const addWarranty = (
  customer,
  selectedEquipment,
  warrantyValues,
  equipment,
  activateSuccessNotification,
  activateFailureNotification,
  closeBasicModal
) => {
  if (selectedEquipment === undefined || selectedEquipment.length === 0) {
    alert("No Equipment Selected..");
  } else {
    for (const index in selectedEquipment) {
      if (selectedEquipment[index]) {
        const newWarr = {
          key: equipment[index].equipmentName,
          equipmentWarranty: getFormattedDate(
            warrantyValues.partsExpirationDate
          ),
          laborWarranty: getFormattedDate(warrantyValues.laborExpirationDate),
          warranty: {
            key: equipment[index].equipmentName,
            jobNumber: warrantyValues.jobNumber,
            startDate: warrantyValues.startDate,
            partsExpirationDate: warrantyValues.partsExpirationDate,
            laborExpirationDate: warrantyValues.laborExpirationDate,
            equipment: equipment[index].equipmentName,
            equipmentName: equipment[index].equipmentName,
            equipmentBrand: equipment[index].equipmentBrand,
            equipmentModel: equipment[index].equipmentModel,
            equipmentSerial: equipment[index].equipmentSerial,
          },
        };
        updateDocument(
          doc(
            db,
            "customers",
            customer.id,
            "Equipment",
            equipment[index].equipmentName
          ),
          newWarr
        )
          .then(() => {
            activateSuccessNotification();
            closeBasicModal();
          })
          .catch((error) => {
            activateFailureNotification();
            console.log("Firebase Error: ", error);
          });
      }
    }
  }
};

export const updateWarranty = (
  customer,
  warrantyValues,
  activateSuccessNotification,
  activateFailureNotification,
  closeModal
) => {
  console.log("updatedWarranty: ", warrantyValues);
  updateDocument(
    doc(db, "customers", customer.id, "Equipment", warrantyValues.key),
    warrantyValues
  )
    .then(() => {
      activateSuccessNotification();
      closeModal();
    })
    .catch((error) => {
      activateFailureNotification();
      console.log("Firebase error: ", error);
    });
};

export const deleteWarranty = (
  customer,
  selectedWarranty,
  activateSuccessNotification,
  activateFailureNotification,
  closeDetails,
  closeDelete
) => {
  console.log("selectedWarranty", selectedWarranty);

  updateDocument(
    doc(
      db,
      "customers",
      customer.id,
      "Equipment",
      selectedWarranty.equipmentName
    ),
    { equipmentWarranty: "", laborWarranty: "", warranty: deleteField() }
  )
    .then(() => {
      activateSuccessNotification();
      console.log("Removed String Representations, and Objects");
      closeDelete();
      closeDetails();
    })
    .catch((error) => {
      activateFailureNotification();
      console.log("Firebase Error: ", error);
    });
};
