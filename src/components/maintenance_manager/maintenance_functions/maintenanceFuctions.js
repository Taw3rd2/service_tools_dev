export const getPartDetailsFromIds = (partsInventory, partIds) => {
  const partsListWithDetails = [];
  if (partIds.length > 0) {
    const filteredParts = partsInventory.filter((part) => {
      return partIds.find((prt) => {
        part.quantity = prt.quantity;
        return prt.id === part.id;
      });
    });
    filteredParts.map((item) => partsListWithDetails.push(item));
  }
  console.log("partsListWithDetails: ", partsListWithDetails);
  return partsListWithDetails;
};
