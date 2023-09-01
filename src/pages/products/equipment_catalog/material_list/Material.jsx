import EmptyMaterialList from "./EmptyMaterialList";
import MaterialList from "./MaterialList";

const Material = ({ material, setMaterial, openJobMaterialPicker }) => {
  if (material === null || material.length < 1) {
    return <EmptyMaterialList openJobMaterialPicker={openJobMaterialPicker} />;
  } else {
    return (
      <MaterialList
        material={material}
        setMaterial={setMaterial}
        openJobMaterialPicker={openJobMaterialPicker}
      />
    );
  }
};

export default Material;
