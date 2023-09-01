import { stringPriceToNumber } from "../../../../utilities/currencyUtils";

export const getEquipmentDateUpdated = (unit) => {
  if(unit.dateUpdated === null || unit.dateUpdated === undefined) {
    return "not updated"
  } else {
    return unit.dateUpdated
  }
}

export const buildMaterialPrices = (unit, parts) => {
    //this is what we will return after modifications
    let accumulatedTotal = 0;

    //the material list is only part ids and quantitys
    //so we need to fetch the list and build an array
    //put the fetched array here
    const fetchedMaterialList = [];

    //make sure we have a unit, and the unit has a material list
    if (unit && unit.defaultMaterialList) {
      //get the material list
      const loadedMaterialList = unit.defaultMaterialList;

      //do we have a list of ids to work with?
      if (loadedMaterialList.length > 0) {
        //fiter through the parts collection to get the list of part objects associated with the ids
        const filteredParts = parts.filter((part) => {
          return loadedMaterialList.find((prt) => {
            //update the quantity of the found part with the stored quantity on the equipment
            part.quantity = prt.quantity;
            return prt.id === part.id;
          });
        });
        //when we are done loading parts, push them to fetchedMaterialList
        filteredParts.map((item) => fetchedMaterialList.push(item));
      }

      //get the unit, and include it in the price
      const modifiedUnit = {
        btu: unit.btu,
        cost: stringPriceToNumber(unit.cost),
        dateUpdated: unit.dateUpdated,
        model: unit.model,
        quantity: unit.quantity,
        subCategory: unit.subCategory,
      };
      //push the unit to the list
      fetchedMaterialList.push(modifiedUnit);

      //after all the fetching, do we have items in fetchedMaterialList?
      if (fetchedMaterialList.length > 0) {
        //map through the fetched list and get the price totals
        fetchedMaterialList.map((item) => {
          //is this a part or quipment? partCost = part cost = equipment
          if (item.partCost) {
            let sub = 0;

            //convert the string to a number
            const convertedPartCost = stringPriceToNumber(item.partCost);

            //multiply the price * quantity
            sub = convertedPartCost * item.quantity;

            //add the sub total to the accumulated total
            return (accumulatedTotal += sub);
          } else {
            let sub = 0;

            //convert the string to a number
            const convertedEquipmentCost = stringPriceToNumber(item.cost);

            //multiply the price * quantity
            sub = convertedEquipmentCost * item.quantity;

            //add the sub total to the accumulated total
            return (accumulatedTotal += sub);
          }
        });
      } else {
        console.log("no items in fetchedMaterialList");
      }
    } else {
      console.log(
        "in build material there is no unit, or unit.defaultMaterialList"
      );
    }
    return accumulatedTotal;
  };

export const buildLaborPrices = (unit) => {
    let accumulatedTotal = 0;
    //make sure we have a unit and labor list to work with
    if (unit && unit.defaultLaborList) {
      //get the labor list
      const loadedLaborList = unit.defaultLaborList;

      //do we have labor items to work with
      if (loadedLaborList.length > 0) {
        loadedLaborList.map((item) => {
          const sub = item.hours * item.rate;
          return (accumulatedTotal += sub);
        });
      }
      return accumulatedTotal;
    } else {
      console.log("in build labor there is no unit, or unit.defaultLaborList");
    }
};

export const buildAdditionsPrices = (unit, services) => {
    let accumulatedTotal = 0;
    //make sure we have a unit and additions list to work with
    if (unit && unit.defaultAdditionsList) {
      //get the additions list
      const loadedAdditionsList = unit.defaultAdditionsList;

      //the additions list is only part ids and quantitys
      //so we need to fetch the list and build a array
      //put the fetched array here

      //do we have additions ids to work with?
      //if there is none, the array will stay empty
      if (loadedAdditionsList.length > 0) {
        //look through the list of services
        //if we find a match, update the quantity with the saved quantity from defaultAdditionsList
        //if defaultAdditionsList.id matches service.id return it to filteredAdditions
        const filteredAdditions = services.filter((service) => {
          return loadedAdditionsList.find((svc) => {
            service.quantity = svc.quantity;
            return svc.id === service.id;
          });
        });

        //map through the filteredAdditions
        //multiply the quantity by the cost for each item
        //add the
        filteredAdditions.map((item) => {
          let sub = item.quantity * item.cost;
          return (accumulatedTotal += sub);
        });
        return accumulatedTotal;
      } else {
        return accumulatedTotal;
      }
    } else {
      console.log(
        "in build additions there is no unit, or unit.defaultAdditionsList"
      );
    }
};

export const fetchEquipmentByModel = (equipmentModel, listOfEquipment) => {
    //find the units that match the model number supplied
    const specifiedEquipment = listOfEquipment.filter((unit) => {
        return unit.model.includes(equipmentModel)
    })
    return specifiedEquipment
}