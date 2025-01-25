"use client";

import { useState } from "react";
import { ApiPromise, WsProvider } from "@polkadot/api";
import { useStore } from "../store/useStore";
const usePolkadotExtension = async () => {
    if (typeof window !== "undefined") {
      const { web3Enable, web3Accounts, web3FromAddress } = await import("@polkadot/extension-dapp");
      return { web3Enable, web3Accounts, web3FromAddress };
    }
    return null;
  };

export const useExplorer = () => {
    const { showToast, isToast, message, setTransactionData, transactionData } = useStore();
    const [isWalletConnected, setIsWalletConnected] = useState(false);
    const [actionType, setActionType] = useState("transfer");
    const [inputValue, setInputValue] = useState("");
    const [account, setAccount] = useState(null);

    const connectWallet = async () => {
        const extensionApis = await usePolkadotExtension();
        if (!extensionApis) return;
        const { web3Enable, web3Accounts } = extensionApis;
        const extensions = await web3Enable("My DApp");
        if (!extensions.length) {
            showToast(true, "Please install Polkadot.js extension!");
            return;
        }
        const accounts = await web3Accounts();
        setAccount(accounts[0]);
        if (!!accounts[0]) {
            setIsWalletConnected(true)
        }
    };

    const handleAction = async () => {
        if (!account) {
            showToast(true, "Please connect your wallet first");
            return;
        }
        const provider = new WsProvider("ws://127.0.0.1:9944"); // local node server
        const api = await ApiPromise.create({ provider });
        const { data: { free } } = await api.query.system.account(account.address);

        if (free.toHuman() <= 0 && actionType === "transfer") {
            return showToast(true, "Wallet balance is low. Please add balance to transfer.");
        }

        if (actionType === "transfer" && free.toHuman() > 0) {
            const injector = await web3FromAddress(account.address);
            const recipientAddress = inputValue;
            const transferAmount = 0;

            try {
                const transfer = api.tx.balances.transferKeepAlive(recipientAddress, transferAmount);
                const hash = await transfer.signAndSend(account.address, { signer: injector.signer });// comment this line to check the data from transaction, that's dummy data table
                setTransactionData(["Balance Transfer", `Transfer to ${recipientAddress}`, (hash?.toHex() || "145YM4AKXbdwqPFsoWKK")]) // For the reference, but should be removed the dummy hash value
                setInputValue("");
            } catch (error) {
                showToast(true, `Transfer failed: ${error.message}`);
            }
        } else if (actionType === "dataSubmit") {
            // NOTE: Need to integarte the api for transfering user data
            alert(`Submitting data: ${inputValue}`);
            setTransactionData(["Data Submit", inputValue, `Transfer to ${account.address}`])
            setInputValue("");
        }
    };

    return {
        handleAction, connectWallet,
        actionType, setActionType,
        inputValue, setInputValue,
        transactionData, isWalletConnected,
        isToast, showToast, message
    }
}
