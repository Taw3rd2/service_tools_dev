import BlankEquipmentSheet from "./BlankEquipmentSheet";
import EquipmentDetails from "./EquipmentDetails";
import "../../../../global_style/style.css";

const EquipmentWorksheet = ({
  selectedEquipmentId,
  selectedEquipmentValues,
  setSelectedEquipmentValues,
  clearSelectedEquipment,
  openDeleteEquipment,
  openAddMaterialList,
  openEditLaborList,
  openEditMaterialList,
  openEditAdditionsList,
}) => {
  return (
    <div>
      <div className="row">
        <div className="singleRowInput">
          <div className="worksheetTitle">Equipment Worksheet</div>
        </div>
      </div>
      <div className="row" style={{ border: "2px solid black" }}>
        <div className="singleRowInput">
          {selectedEquipmentId ? (
            <EquipmentDetails
              selectedEquipmentId={selectedEquipmentId}
              selectedEquipmentValues={selectedEquipmentValues}
              setSelectedEquipmentValues={setSelectedEquipmentValues}
              clearSelectedEquipment={clearSelectedEquipment}
              openDeleteEquipment={openDeleteEquipment}
              openAddMaterialList={openAddMaterialList}
              openEditLaborList={openEditLaborList}
              openEditMaterialList={openEditMaterialList}
              openEditAdditionsList={openEditAdditionsList}
            />
          ) : (
            <BlankEquipmentSheet />
          )}
        </div>
      </div>
    </div>
  );
};

export default EquipmentWorksheet;
