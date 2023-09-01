import { doc } from "firebase/firestore";
import { db, updateDocument } from "../../../firebase/firestore.utils";

export const updateMaintenance = async (
  activateFailureNotification,
  activateSuccessNotification,
  closeModal,
  contractId,
  unit,
  newMaintenanceValues,
  currentMaintenanceDocument
) => {
  console.log("currentMaintenanceDocument: ", currentMaintenanceDocument);
  // const rebuildEquipmentArray = async (
  //   noy,
  //   nov,
  //   saleDate,
  //   newMaintenanceValues
  // ) => {
  //   const arrayOfUnits = [];
  //   return new Promise((resolve, reject) => {
  //     let i = noy;
  //     while (i > 0) {
  //       let j = nov;
  //       const iteratedExpirationDate = new Date(
  //         new Date().setFullYear(saleDate.getFullYear() + i)
  //       );
  //       const mNumberYearExtension = getFormattedYear(iteratedExpirationDate);
  //       while (j > 0) {
  //         const iterator = j;
  //         currentMaintenanceDocument.equipment.forEach((element) => {
  //           let unitValues = {
  //             completedDate: element.completedDate
  //               ? element.completedDate
  //               : null,
  //             equipment: element.equipmentName,
  //             equipmentBrand: element.equipmentBrand,
  //             equipmentModel: element.equipmentModel,
  //             equipmentName: element.equipmentName,
  //             equipmentSerial: element.equipmentSerial,
  //             expirationDate: iteratedExpirationDate,
  //             mNumber:
  //               noy > 1 && nov <= 1
  //                 ? `${newMaintenanceValues.mNumber}-${mNumberYearExtension}`
  //                 : noy > 1 && nov > 1
  //                 ? `${newMaintenanceValues.mNumber}-${mNumberYearExtension}-${iterator}`
  //                 : noy <= 1 && nov > 1
  //                 ? `${newMaintenanceValues.mNumber}-${iterator}`
  //                 : newMaintenanceValues.mNumber,
  //           };
  //           arrayOfUnits.push(unitValues);
  //         });
  //         j--;
  //       }
  //       i--;
  //     }
  //     console.log("array of units: ", arrayOfUnits);
  //     resolve(arrayOfUnits);
  //   });
  // };

  //saleDate changes
  // if (
  //   getFormattedDate(currentMaintenanceDocument.saleDate) !==
  //   getFormattedDate(newMaintenanceValues.saleDate)
  // ) {
  //   //get the new expiration date
  //   const newExpiration = new Date(
  //     new Date().setFullYear(
  //       newMaintenanceValues.saleDate.getFullYear() +
  //         newMaintenanceValues.numberOfYears
  //     )
  //   );

  //   //update the equipmentContract for Android
  //   const androidUpdate = {
  //     equipmentContract: getFormattedDate(newExpiration),
  //   };

  //   const db = getFirestore();
  //   originalArray.forEach((element) => {
  //     updateDocument(
  //       doc(
  //         db,
  //         "customers",
  //         currentMaintenanceDocument.customerId,
  //         "Equipment",
  //         element.equipmentName
  //       ),
  //       androidUpdate
  //     )
  //       .then(() => console.log("Android Part Updated"))
  //       .catch((error) => {
  //         activateFailureNotification();
  //         console.log("Android Update Error: ", error);
  //       });
  //   });
  // }

  //mNumber
  // if (updatedUnit.mNumber !== unit.mNumber) {
  // }

  //get original array, and unit,
  const originalArray = currentMaintenanceDocument.equipment;
  console.log("originalArray", originalArray);

  //find the exact index we are updating
  const unitIndex = originalArray.findIndex((u) => u.id === unit.id);

  //if there is no index found, exit
  if (unitIndex === -1) {
    return;
  }

  //update the value
  const updatedObject = {
    ...originalArray[unitIndex],
    completedDate: newMaintenanceValues.completedDate,
  };
  //originalArray[unitIndex].completedDate = newMaintenanceValues.completedDate;

  //make a final new array
  const updatedEquipmentArray = [
    ...originalArray.slice(0, unitIndex),
    updatedObject,
    ...originalArray.slice(unitIndex + 1),
  ];

  //make modifications,
  const updatedMaintenanceDoc = {
    // customerAddress: currentMaintenanceDocument.customerAddress,
    // customerId: currentMaintenanceDocument.customerId,
    // customerName: currentMaintenanceDocument.customerName,
    // customerPhone: currentMaintenanceDocument.customerPhone,
    equipment: updatedEquipmentArray,
    // id: currentMaintenanceDocument.id,
    // mNumber: newMaintenanceValues.mNumber,
    // numberOfVisits: newMaintenanceValues.numberOfVisits,
    // numberOfyears: newMaintenanceValues.numberOfYears,
    // saleDate: newMaintenanceValues.saleDate,
    // salePrice: newMaintenanceValues.salePrice,
  };

  console.log("updatedMaintenanceDoc", updatedMaintenanceDoc);

  //if completed date is !== to original,
  // if (newMaintenanceValues.completedDate !== unit.completedDate) {
  //   unitToUpdate.equipment[unitIndex].completedDate = newMaintenanceValues.completedDate
  //   unitToUpdate.equipment.splice(unitIndex, 1);
  //   unitToUpdate.equipment.push(unitToUpdate.equipment);
  // }

  //const updatedUnit = {
  //completedDate: newMaintenanceValues.completedDate,
  //equipment: originalArray,
  // equipmentBrand: unit.equipmentBrand,
  // equipmentModel: unit.equipmentModel,
  // equipmentName: unit.equipmentName,
  // equipmentSerial: unit.equipmentSerial,
  // expirationDate: unit.expirationDate,
  // mNumber: newMaintenanceValues.mNumber,
  //};

  updateDocument(doc(db, "maintenance", contractId), updatedMaintenanceDoc)
    .then(() => {
      activateSuccessNotification();
      console.log("Maintenance Updated");
      closeModal();
    })
    .catch((error) => {
      activateFailureNotification();
      console.log("Maintenance Update Error ", error);
    });
};
