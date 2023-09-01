import React from "react";
import ExcelJs from "exceljs";
import { getFormattedDateAndTime } from "../../utilities/dateUtils";

import { FormatListNumbered } from "@mui/icons-material";

const CustomerExport = ({ customers }) => {
  const exportToExcel = (data) => {
    let sheetName = "Customers.xlsx";

    let workbook = new ExcelJs.Workbook();
    let sheet = workbook.addWorksheet(sheetName, {
      views: [{ showGridLines: true }],
    });
    //let sheet2 = workbook.addWorksheet("Second sheet", { views: [{ showGridLines: false }] });

    sheet.headerFooter.firstHeader = "Customers";

    sheet.columns = [
      { header: "Data ID", key: "id", width: 25 },
      { header: "Last Name", key: "lastname", width: 25 },
      { header: "First Name", key: "firstname", width: 15 },
      { header: "Address", key: "street", width: 25 },
      { header: "City", key: "city", width: 15 },
      { header: "State", key: "state", width: 5 },
      { header: "Zip Code", key: "zip", width: 7 },
      { header: "Phone Name", key: "phoneName", width: 20 },
      { header: "Phone Number", key: "phone", width: 14 },
      { header: "Alt Phone Name", key: "altPhoneName", width: 20 },
      { header: "Alt Phone Number", key: "altphone", width: 14 },
      { header: "Other Phone Name", key: "otherPhoneName", width: 20 },
      { header: "Other Phone Number", key: "otherPhone", width: 14 },
      { header: "Balance", key: "balance", width: 10 },
    ];

    data.forEach((singleData) => {
      sheet.addRow(singleData);
    });

    sheet.duplicateRow(1, 2, true);
    sheet.getRow(1).values = [
      `Customers as of: ${getFormattedDateAndTime(new Date())}`,
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
      onClick={() => exportToExcel(customers)}
      style={{ background: "white" }}
    >
      <FormatListNumbered />
      <span className="iconSeperation">Export Customers To Excel</span>
    </button>
  );
};

export default CustomerExport;
