import React from "react";
import ExcelJs from "exceljs";
import {
  getFormattedDate,
  getFormattedDateAndTime,
} from "../../utilities/dateUtils";

import { FormatListNumbered } from "@mui/icons-material";
import { currencyFormat } from "../../utilities/currencyUtils";
import { getExpirationDates } from "../maintenance_manager/maintenance_functions/createMaintenanceFunctions";

const MaintenanceExport = ({ maintenance }) => {
  const formattedMaintenance = maintenance.map((maint) => ({
    ...maint,
    saleDate: getFormattedDate(maint.saleDate),
    expirationDate: getFormattedDate(
      getExpirationDates(new Date(maint.saleDate.seconds * 1000)),
      maint.numberOfYears
    ),
    salePrice: currencyFormat(maint.salePrice),
  }));
  const exportToExcel = (data) => {
    let sheetName = "Maintenance.xlsx";

    let workbook = new ExcelJs.Workbook();
    let sheet = workbook.addWorksheet(sheetName, {
      views: [{ showGridLines: true }],
    });
    //let sheet2 = workbook.addWorksheet("Second sheet", { views: [{ showGridLines: false }] });

    sheet.headerFooter.firstHeader = "Maintenance";

    sheet.columns = [
      { header: "Data ID", key: "id", width: 25 },
      { header: "M-Number", key: "mNumber", width: 8 },
      { header: "Name", key: "customerName", width: 25 },
      { header: "Address", key: "customerAddress", width: 25 },
      { header: "Phone Number", key: "customerPhone", width: 14 },
      { header: "Sale Date", key: "saleDate", width: 14 },
      { header: "Expiration", key: "expirationDate", width: 14 },
      { header: "Sale Price", key: "salePrice", width: 14 },
    ];

    data.forEach((singleData) => {
      sheet.addRow(singleData);
    });

    sheet.duplicateRow(1, 2, true);
    sheet.getRow(1).values = [
      `Maintenance as of: ${getFormattedDateAndTime(new Date())}`,
    ];
    sheet.getRow(2).values = [];

    sheet.getRow("1").font = {
      size: 14,
      bold: true,
    };

    sheet.getRow("3").font = {
      size: 14,
      bold: true,
    };

    const writeFile = (fileName, content) => {
      const link = document.createElement("a");
      const blob = new Blob([content], {
        type: "application/vnd.ms-excel;charset=utf-8;",
      });
      link.download = fileName;
      link.href = URL.createObjectURL(blob);
      link.click();
    };

    workbook.xlsx.writeBuffer().then((buffer) => {
      writeFile(sheetName, buffer);
    });
  };

  return (
    <button
      type="button"
      className="standardButton"
      onClick={() => exportToExcel(formattedMaintenance)}
    >
      <FormatListNumbered />
      <span className="iconSeperation">Export Maintenance To Excel</span>
    </button>
  );
};

export default MaintenanceExport;
