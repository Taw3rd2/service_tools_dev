import EmptyLaborList from "./EmptyLaborList";
import LaborList from "./LaborList";

const Labor = ({ unit, labor, setLabor, openAddLaborToJob }) => {
  if (labor === null || labor.length < 1) {
    return <EmptyLaborList openAddLaborToJob={openAddLaborToJob} />;
  } else {
    return (
      <LaborList
        labor={labor}
        setLabor={setLabor}
        openAddLaborToJob={openAddLaborToJob}
      />
    );
  }
};

export default Labor;
