import {
  setMilliseconds,
  setSeconds,
  setMinutes,
  setHours,
  format,
  parse,
  getUnixTime,
} from "date-fns";

//called in create dispatch
export const setDateToZeroHours = (date) => {
  const newHours = setHours(date, 0);
  const newMin = setMinutes(newHours, 0);
  const newSeconds = setSeconds(newMin, 0);
  const newMillis = setMilliseconds(newSeconds, 0);
  return newMillis;
};

export const setDateToOneAm = (date) => {
  const newHours = setHours(date, 1);
  const newMin = setMinutes(newHours, 0);
  const newSeconds = setSeconds(newMin, 0);
  const newMillis = setMilliseconds(newSeconds, 0);
  return newMillis;
};

//called in ClientActivityPage
export const getFormattedTime = (date) => {
  if (Object.prototype.toString.call(date) === "[object Date]") {
    const newDateTime = format(date, "h:mm:ss aaa");
    return newDateTime;
  } else {
    const newDate = date.toDate();
    const newTime = format(newDate, "h:mm:ss aaa");
    return newTime;
  }
};

//called in EquipmentList
export const getFormattedDate = (date) => {
  if (date !== null) {
    if (Object.prototype.toString.call(date) === "[object Date]") {
      const newDateTime = format(date, "MMM, dd, yyyy");
      return newDateTime;
    } else {
      const newDate = date.toDate();
      const newTime = format(newDate, "MMM, dd, yyyy");
      return newTime;
    }
  } else return "Not done yet";
};

export const getFormattedYear = (date) => {
  if (date !== null) {
    if (Object.prototype.toString.call(date) === "[object Date]") {
      const newDateTime = format(date, "yyyy");
      return newDateTime;
    } else {
      const newDate = date.toDate();
      const newTime = format(newDate, "yyyy");
      return newTime;
    }
  } else return "Not A Date";
};

//called in warranty list
export const getWarrantyFormattedDate = (date) => {
  if (date !== null) {
    if (Object.prototype.toString.call(date) === "[object Date]") {
      const newDateTime = format(date, "MMM, dd, yyyy");
      return newDateTime;
    } else {
      const newDate = date.toDate();
      const newTime = format(newDate, "MMM, dd, yyyy");
      return newTime;
    }
  } else return "None On Record";
};

//called in ClientActivity
export const getFormattedDateAndTime = (date) => {
  if (Object.prototype.toString.call(date) === "[object Date]") {
    const newDateTime = format(date, "MMM, dd, yyyy h:mm:ss aaa");
    return newDateTime;
  } else {
    const newDate = date.toDate();
    const newTime = format(newDate, "MMM, dd, yyyy h:mm:ss aaa");
    return newTime;
  }
};

export const getFormattedExactTime = (date) => {
  if (Object.prototype.toString.call(date) === "[object Date]") {
    const exactTimeFormat = format(date, "MMM, dd, yyyy h:mm:ss:T");
    return exactTimeFormat;
  } else {
    const newDate = date.toDate();
    const exactTimeFormat = format(newDate, "MMM, dd, yyyy h:mm:ss:T");
    return exactTimeFormat;
  }
};

export const getDateFromString = (string) => {
  return parse(string, "MMM, dd, yyyy", new Date());
};

export const getUnixFromDate = (date) => {
  return getUnixTime(date);
};
