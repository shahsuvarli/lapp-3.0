import React, { useState } from "react";
import messages from "../../constants/messages.json";
import { exportExcelFile } from "@/features/excelExport";

function Marketing({ setMarketing, quote, materials, session }) {
  const [selectedMessages, setSelectedMessages] = useState([]);
  const toggleMessages = (id) => {
    if (selectedMessages.includes(id)) {
      const newMessages = selectedMessages.filter((item) => item !== id);
      setSelectedMessages([...newMessages]);
    } else {
      setSelectedMessages([...selectedMessages, id]);
    }
  };
  return (
    <div
      className="fixed top-0 left-0 right-0 bottom-0 w-full h-screen bg-[#4845458f] flex justify-center items-center z-[100]"
      onClick={() => setMarketing(false)}
    >
      <div
        className="bg-white w-2/3 rounded-md animate-[rise_1s_ease-in-out] p-5 gap-4 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <p>Marketing</p>
        <div className="w-full z-10 flex flex-col py-2 box-border overflow-y-scroll border border-solid border-[#939292] hover:cursor-pointer rounded-md gap-2">
          {messages.map(({ id, message }) => (
            <fieldset
              key={id}
              className="flex flex-row items-center gap-2 hover:bg-[#313131] hover:text-white w-full px-2 min-h-10"
            >
              <input
                readOnly
                // onChange={toggleMessages}
                type="checkbox"
                checked={selectedMessages.includes(id)}
                className="hover:cursor-pointer"
                onClick={() => toggleMessages(id)}
                id={`input-${id}`}
              />
              <label
                className="w-full hover:cursor-pointer min-h-10 items-center block"
                htmlFor={`input-${id}`}
              >
                {message}
              </label>
            </fieldset>
          ))}
        </div>
        <div className="justify-end flex flex-row">
          <button
            className="bg-red-200 m-4 px-4 py-2 rounded-md"
            onClick={() =>
              exportExcelFile(quote, materials, session, selectedMessages)
            }
          >
            Export
          </button>
        </div>
      </div>
    </div>
  );
}

export default Marketing;
