import { addMonths, format } from "date-fns";
const ExcelJS = require("exceljs");
import messages from "../constants/messages.json";

const toDataURL = (url) => {
  const promise = new Promise((resolve, reject) => {
    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
      var reader = new FileReader();
      reader.readAsDataURL(xhr.response);
      reader.onloadend = function () {
        resolve({ base64Url: reader.result });
      };
    };
    xhr.open("GET", url);
    xhr.responseType = "blob";
    xhr.send();
  });

  return promise;
};

export const exportExcelFile = async (
  quote,
  materials,
  session,
  selectedMessages
) => {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet(`Quote #${quote.id} materials`);

  const url = "/logo.png";

  const result = await toDataURL(url);

  const imageId2 = workbook.addImage({
    base64: result.base64Url,
    extension: "png",
  });

  sheet.addImage(imageId2, {
    tl: { col: 0, row: 0 },
    ext: { width: 650, height: 120 },
  });

  sheet.mergeCells("A1:E6");

  for (let rowNumber = 1; rowNumber <= 100; rowNumber++) {
    const row = sheet.getRow(rowNumber);
    row.height = 15;
  }

  const widths = [33.33, 17, 13, 13, 13, 24, 24, 24, 37, 33];

  for (let colNumber = 0; colNumber <= widths.length; colNumber++) {
    const column = sheet.getColumn(colNumber + 1);
    column.width = widths[colNumber];
  }

  const documentInfo = [
    "Contact Name",
    "Company Name",
    "Quote Ref Description",
    "Quote #",
    "Valid on Date",
    "Valid to Date",
    "Copper Rate on quote",
  ];

  const documentData = [
    "Ted Waddel",
    quote.customer_name,
    "Serve Electric for Niagara Line 4 NOLA",
    quote.quote_id,
    new Date().toISOString().split("T")[0],
    format(addMonths(new Date(), 1), "yyyy-MM-dd"),
    quote.copper_rate,
  ];

  const contactInfo = [
    "29 Hanover Road",
    "Florham Park NJ 07932",
    "Toll Free: 800-774-3539",
    "Fax: 973-660-9330",
    "www.lappusa.com",
    session?.user.name,
    new Date().toISOString().split("T")[0],
    "800-774-3539 x6712",
  ];

  const tableHeaders = [
    "Description",
    "Lapp Part Number Quoted",
    "QTY",
    "UOM",
    "CU Base",
    "Price Full Copper (MFT)",
    "Total Line",
    "Stock",
    "Notes",
    "Skin-top recommendation",
  ];

  for (let row = 0; row <= documentInfo.length; row++) {
    sheet.getCell(`A${row + 8}`).value = documentInfo[row];
  }

  for (let row = 0; row <= documentData.length; row++) {
    sheet.getCell(`B${row + 8}`).value = documentData[row];
    sheet.getCell(`B${row + 8}`).alignment = {
      wrapText: true,
      vertical: "middle",
      horizontal: "center",
    };
  }

  for (let row = 0; row <= contactInfo.length; row++) {
    sheet.getCell(`H${row + 8}`).value = contactInfo[row];
  }

  for (let col = 0; col <= tableHeaders.length - 1; col++) {
    sheet.getCell(17, col + 1).value = tableHeaders[col];

    materials.map((material, index) => {
      sheet.getRow(18 + index).values = [
        {
          text: material.description,
          hyperlink: "http://www.lappusa.com",
          tooltip: "www.lappusa.com",
        },
        material.material_id,
        material.quantity,
        material.uom,
        material.copper_base_price,
        material.full_base_price,
        material.line_value ? `$${material.line_value}` : null,
        material.stock_6100 +
          material.stock_6120 +
          material.stock_6130 +
          material.stock_6140,
        material.line_notes,
        "",
      ];
      for (let col = 0; col < tableHeaders.length; col++) {
        const cell = sheet.getCell(18 + index, col + 1);
        cell.border = {
          top: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" },
          left: { style: "thin" },
        };

        cell.alignment = {
          wrapText: true,
          vertical: "middle",
          horizontal: "center",
        };
      }
    });

    const cell = sheet.getCell(17, col + 1);

    cell.border = {
      top: { style: "medium" },
      bottom: { style: "medium" },
      right: { style: "medium" },
      left: { style: "medium" },
    };

    cell.alignment = {
      wrapText: true,
      vertical: "middle",
      horizontal: "center",
    };

    cell.font = { bold: true };
  }

  sheet.getCell(`F${17 + materials.length + 2}`).value = "Total";
  sheet.getCell(`F${17 + materials.length + 2}`).fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FFFFFF00" },
  };

  sheet.getCell(`F${17 + materials.length + 2}`).border = {
    top: { style: "medium" },
    bottom: { style: "medium" },
    right: { style: "medium" },
    left: { style: "medium" },
  };

  sheet.getCell(`G${17 + materials.length + 2}`).value = `$${materials.reduce(
    (total, material) => total + Number(material.line_value),
    0
  )}`;

  sheet.getCell(`G${17 + materials.length + 2}`).fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FFFFFF00" },
  };

  sheet.getCell(`G${17 + materials.length + 2}`).border = {
    top: { style: "medium" },
    bottom: { style: "medium" },
    right: { style: "medium" },
    left: { style: "medium" },
  };

  sheet.getCell("H12").value = {
    text: "www.lappusa.com",
    hyperlink: "http://www.lappusa.com",
    tooltip: "www.lappusa.com",
  };

  sheet.getCell("H12").font = {
    color: { argb: "0000FF" },
    underline: "single",
  };

  // BORDERS ON LEFT SIDE
  sheet.getCell("A8").border = {
    top: { style: "medium" },
    left: { style: "medium" },
    right: { style: "medium" },
    bottom: { style: "thin" },
  };

  sheet.getCell("B8").border = {
    top: { style: "medium" },
    right: { style: "medium" },
    bottom: { style: "thin" },
  };

  for (let row = 9; row <= 14; row++) {
    sheet.getCell(`B${row}`).border = {
      right: { style: "medium" },
      bottom: { style: "thin" },
    };
  }

  for (let row = 9; row <= 14; row++) {
    sheet.getCell(`A${row}`).border = {
      left: { style: "medium" },
      right: { style: "medium" },
      bottom: { style: "thin" },
    };
  }

  sheet.getCell("A14").border = {
    bottom: { style: "medium" },
    left: { style: "medium" },
    right: { style: "medium" },
  };

  sheet.getCell("B14").border = {
    right: { style: "medium" },
    bottom: { style: "medium" },
  };

  // BORDERS ON RIGHT SIDE
  sheet.getCell("H8").border = {
    right: { style: "medium" },
    left: { style: "medium" },
    top: { style: "medium" },
  };

  for (let row = 9; row <= 15; row++) {
    sheet.getCell(`H${row}`).border = {
      left: { style: "medium" },
      right: { style: "medium" },
    };
  }

  sheet.getCell("H15").border = {
    right: { style: "medium" },
    left: { style: "medium" },
    bottom: { style: "medium" },
  };

  const row = sheet.getRow(17);
  row.eachCell({ includeEmpty: true }, (cell) => {
    cell.alignment = {
      wrapText: true,
      vertical: "middle",
      horizontal: "center",
    };
  });

  sheet.getRow(17).height = 33;
  sheet.getRow(10).height = 33;

  for (let row = 0; row <= selectedMessages.length - 1; row++) {
    const message = messages.find((item) => item.id === selectedMessages[row]);
    sheet.getCell(`A${row + 17 + materials.length + 4}`).value = `${row + 1}. ${
      message.message
    }`;
  }

  workbook.xlsx.writeBuffer().then(function (data) {
    const blob = new Blob([data], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const url = window.URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "Material List.xlsx";
    anchor.click();
    window.URL.revokeObjectURL(url);
  });
};
