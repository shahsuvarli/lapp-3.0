import React from "react";
// import Pagination from "@mui/material/Pagination";
// import Stack from "@mui/material/Stack";
import { useDispatch, useSelector } from "react-redux";
import {
  materialWindow,
  newMaterialWindow,
  selectMaterial,
} from "@/features/crmSlice";
import NewMaterial from "../shared/Material/newMaterial";
import { addMonths, format } from "date-fns";
const ExcelJS = require("exceljs");
import numeral from "numeral";
import { RiFileExcel2Fill } from "react-icons/ri";
import { MdOutlineAddCircleOutline } from "react-icons/md";
import Customer from "../shared/customer.js";
import Material from "../shared/Material/editMaterial.js";
import { formFields } from "@/utils/materialInputs";
import { useSession } from "next-auth/react";

function MaterialsTable({ materials, quote, customer }) {
  const [step, setStep] = React.useState(10);

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

  const dispatch = useDispatch();
  const { material } = useSelector((state) => state.crm);
  const { data: session } = useSession();

  const handlePerPage = (e) => {
    setStep(Number(e.target.value));
  };

  const handleStepCount = (e, p) => {
    setStart((p - 1) * step);
  };

  const handleEditMaterial = () => {
    dispatch(materialWindow(true));
    dispatch(selectMaterial({}));
  };

  const handleNewMaterial = () => {
    dispatch(newMaterialWindow(true));
  };

  const exportExcelFile = async () => {
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
      quote.Customer.customer_name,
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
            text: material.Material.description,
            hyperlink: "http://www.lappusa.com",
            tooltip: "www.lappusa.com",
          },
          material.Material.material_id,
          material.quantity,
          material.Material.Material_Sales_Org[0].uom,
          material.copper_base_price,
          material.full_base_price,
          `$${material.line_value}`,
          material.Material.stock_6100 +
            material.Material.stock_6120 +
            material.Material.stock_6130 +
            material.Material.stock_6140,
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

    sheet.getCell(`F${17 + materials.length + 3}`).value = "Total";
    sheet.getCell(`F${17 + materials.length + 3}`).fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFFFFF00" },
    };

    sheet.getCell(`F${17 + materials.length + 3}`).border = {
      top: { style: "medium" },
      bottom: { style: "medium" },
      right: { style: "medium" },
      left: { style: "medium" },
    };

    sheet.getCell(`G${17 + materials.length + 3}`).value = `$${materials.reduce(
      (total, material) => total + Number(material.line_value),
      0
    )}`;

    sheet.getCell(`G${17 + materials.length + 3}`).fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFFFFF00" },
    };

    sheet.getCell(`G${17 + materials.length + 3}`).border = {
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

  return (
    <React.Fragment>
      <Customer customer={customer} projectId={quote.project_id} />
      {material && (
        <Material quote={quote} materials={materials} material={material} />
      )}
      {quote && <NewMaterial quote={quote} />}
      <div className="flex flex-col py-5 px-8 gap-8 w-full h-fit bg-[#f7f6f3] rounded-md box-border mb-12">
        <div className="flex flex-row justify-between items-center w-full">
          <p className="text-2xl h-full">Material List</p>
          <div className="flex text-base gap-5 self-end mt-3 [&>button]:w-36 [&>button]:rounded-md [&>button]:border-none [&>button]:hover:cursor-pointer [&>div]:flex [&>div]:justify-center [&>div]:items-center [&>div]:rounded-md [&>div]:text-center [&>div]:h-12 [&>div]:border [&>div]:border-solid [&>div]:border-[#999998] [&>div]:w-32 [&>div]:text-[#434342] [&>div]:flex-col [&>div]:gap-0 [&>div]:px-1 [&>div]:box-border [&>div]:bg-[#e3e3df61]">
            <span
              className="text-white font-bold w-12 flex justify-center items-center hover:cursor-pointer"
              onClick={exportExcelFile}
            >
              <RiFileExcel2Fill
                color="#e7914e"
                style={{ width: "60%", height: "100%" }}
              />
            </span>
            <div>
              <p style={{ fontSize: 13 }}>total value</p>
              {numeral(quote.quote_value).format("$0,0")}
            </div>
            <div>
              <p style={{ fontSize: 13 }}>total cost</p>
              {numeral(quote.quote_cost).format("$0,0")}
            </div>
            <div>
              <p style={{ fontSize: 13 }}>total margin</p>
              {numeral(quote.quote_margin).format("0.0")}%
            </div>

            <button
              className={
                quote.is_active
                  ? "bg-[#f08938] flex justify-center items-center flex-row w-36 h-10 rounded-md text-base text-white transform-none border-none gap-3 hover:bg-[#b8682a] hover:cursor-pointer"
                  : "hidden"
              }
              type="button"
              onClick={handleNewMaterial}
              disabled={!Boolean(quote.copper_rate)}
            >
              <MdOutlineAddCircleOutline size={17} />
              <p>New Material</p>
            </button>
          </div>
        </div>
        <div
          className="max-w-full overflow-x-scroll box-border"
          onClick={handleEditMaterial}
        >
          <table className="w-full rounded-md overflow-x-scroll box-border">
            <thead>
              <tr>
                {formFields.map(({ id, label }) => (
                  <th key={id} className="align-text-top">
                    {label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {materials.map((item) => (
                <tr
                  key={item.id}
                  className="hover:cursor-pointer hover:bg-[#a5a4a42f]"
                >
                  <td>{item.material_id}</td>
                  <td>{item.quantity}</td>
                  <td>{item.Material.Material_Sales_Org[0]?.uom}</td>
                  <td>{item.Material.stock_6100}</td>
                  <td>{item.Material.stock_6120}</td>
                  <td>{item.Material.stock_6130}</td>
                  <td>{item.Material.stock_6140}</td>

                  <td>
                    {numeral(
                      item.Material.Material_Sales_Org[0]?.low_discount
                    ).format("0,0.00")}
                    %
                  </td>
                  <td>
                    {numeral(
                      item.Material.Material_Sales_Org[0]?.average_discount
                    ).format("0,0.00")}
                    %
                  </td>
                  <td>
                    {numeral(
                      item.Material.Material_Sales_Org[0]?.high_discount
                    ).format("0,0.00")}
                    %
                  </td>
                  <td className="w-40 break-words overflow-scroll text-ellipsis border-b-0 h-[4em] border-l-0 border-r-0 line-clamp-3">
                    {item.line_notes}
                  </td>
                  <td>
                    {numeral(
                      item.Material.Material_Sales_Org[0]?.level_5_base_cu
                    ).format("$0,0.00")}
                  </td>
                  <td>{numeral(item.discount_percent).format("0,0.00")}%</td>
                  <td>{numeral(item.copper_base_price).format("$0,0.00")}</td>
                  <td>{numeral(item.full_base_price).format("$0,0.00")}</td>
                  <td>{item.margin_full_copper}%</td>
                  <td>{numeral(item.line_value).format("$0,0.00")}</td>
                  <td>{numeral(item.line_cogs).format("$0,0.00")}</td>
                  <td>{item.Material.description}</td>
                  <td>{item.Material.product_family}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-between items-center [&>div]:flex [&>div]:flex-row [&>div]:gap-3 [&>div]:items-center">
          <div>
            <p className="text-sm text-[#313131]">Rows per page</p>
            <select
              id="rowCount"
              className="py-2 pr-1 pl-2 border border-solid border-[#d9d9d9]"
              onChange={handlePerPage}
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>

          {/* <Stack spacing={2}>
            <Pagination
              count={Math.ceil(materials.length / step)}
              showFirstButton
              showLastButton
              onChange={handleStepCount}
            />
          </Stack> */}
        </div>
      </div>
    </React.Fragment>
  );
}

export default MaterialsTable;
