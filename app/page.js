"use client";

import { useCallback, useEffect, useState } from "react";
import Table from "./components/Table";
import { useExplorer } from './hooks/useExplorer';
import { isValidAddress } from "./utils/utils";

export default function Home() {
  const [errorMessage, setErrorMessage] = useState("");
  const {
    handleAction,
    connectWallet,
    setInputValue,
    setActionType,
    showToast,
    actionType,
    inputValue,
    transactionData,
    isWalletConnected,
    isToast,
    message
  } = useExplorer();

  useEffect(() => {
    if (actionType === "transfer") {
      const isValid = isValidAddress(inputValue)
      if (!!inputValue && !isValid) {
        setErrorMessage("Invalid Recipient Address. Please type right address.")
      }
      if (!inputValue) {
        setErrorMessage("")
      }
    } else {
      setErrorMessage("")
    }
  }, [inputValue, actionType])

  const handleDropDown = useCallback((e) => {
    setInputValue("");
    setActionType(e.target.value);
  }, [])

  return (
    <>
      <div className="min-h-screen p-6 bg-gray-900 text-gray-200">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-white">Chain Explorer</h1>
          <button
            onClick={connectWallet}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            {isWalletConnected ? "✅ Connected" : "🔌 Connect Wallet"}
          </button>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-300">Select Action</label>
          <select
            className="mt-2 p-2 border border-gray-700 rounded bg-gray-800 text-gray-200"
            value={actionType}
            onChange={handleDropDown}
          >
            <option value="transfer">Balance Transfer</option>
            <option value="dataSubmit">Data Submit</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-300">
            {actionType === "transfer" ? "Recipient Address" : "Data to Submit"}
          </label>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={actionType === "transfer" ? "Enter recipient address" : "Enter data"}
            className="w-[80%] mt-2 p-2 border border-gray-700 rounded bg-gray-800 text-gray-200"
          />
          <button
            onClick={handleAction}
            className={`w-[18%] mx-2 px-4 py-2 rounded text-white ${(!!errorMessage || !inputValue || !isWalletConnected)
              ? "bg-gray-500 cursor-not-allowed"
              : "bg-green-500 hover:bg-green-600"
              }`}
            disabled={!!errorMessage || !inputValue}
          >
            {actionType === "transfer" ? "Transfer Balance" : "Submit Data"}
          </button>
          {!!errorMessage && <div className="text-red-600 dark:text-red-600">{errorMessage}</div>}
        </div>

        {(!!transactionData?.length) && <div className="mt-8">
          <h2 className="text-xl font-bold text-white">Action Logs</h2>
          <Table
            bodyItems={transactionData}
            headerItems={["Type", "Details", "Hash"]}
          />
        </div>}

        {isToast && <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-red-500 text-white p-4 rounded-lg shadow-lg w-1/4">
          <strong className="font-bold">Error!</strong>
          <p>{message}</p>
          <div className="flex justify-end mt-4">
            <button
              onClick={() => showToast(false, "")}
              className="ml-4 px-2 py-1 bg-black text-white rounded hover:bg-gray-800"
            >
              Close
            </button>
          </div>
        </div>
        }
      </div>
    </>

  );
}
