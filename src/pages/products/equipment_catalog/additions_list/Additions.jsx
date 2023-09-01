import AdditionsList from "./AdditionsList";
import EmptyAdditionsList from "./EmptyAdditionsList";

const Additions = ({ additions, setAdditions, openAddAdditionsToJob }) => {
  if (additions === null || additions.length < 1) {
    return <EmptyAdditionsList openAddAdditionsToJob={openAddAdditionsToJob} />;
  } else {
    return (
      <AdditionsList
        additions={additions}
        setAdditions={setAdditions}
        openAddAdditionsToJob={openAddAdditionsToJob}
      />
    );
  }
};

export default Additions;
