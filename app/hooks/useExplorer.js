"use client";

import { useState } from "react";
import { ApiPromise, WsProvider } from "@polkadot/api";
import { web3Enable, web3Accounts, web3FromAddress } from "@polkadot/extension-dapp";
import { useStore } from "../store/useStore";

export const useExplorer = () => {
    const {showToast, isToast,message} = useStore();
    const [isWalletConnected, setIsWalletConnected] = useState(false);
    const [actionType, setActionType] = useState("transfer");
    const [inputValue, setInputValue] = useState("");
    const [logs, setLogs] = useState([]);
    const [account, setAccount] = useState(null);

    const connectWallet = async () => {
        const extensions = await web3Enable("My DApp");
        if (!extensions.length) {
            showToast(true, "Please install Polkadot.js extension!" );
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
            showToast(true, "Please connect your wallet first" );
            return;
        }
        const provider = new WsProvider("ws://127.0.0.1:9944");
        const api = await ApiPromise.create({ provider });
        const { data: { free } } = await api.query.system.account(account.address);

        // if (free.toHuman() <= 0 && actionType === "transfer") {
        // return showToast(true, "Wallet balance is low. Please add balance to transfer." );
        // }

        if (actionType === "transfer" && free.toHuman() > 0 || true) {
            const injector = await web3FromAddress(account.address);
            const recipientAddress = inputValue;
            const transferAmount = 0;

            try {

                const transfer = api.tx.balances.transferKeepAlive(recipientAddress, transferAmount);
                const hash = await transfer.signAndSend(account.address, { signer: injector.signer });

                setLogs((prevLogs) => [
                    ...prevLogs,
                    { type: "Transfer", recipient: recipientAddress, hash: hash.toHex() },
                ]);
            } catch (error) {
                showToast(true, `Transfer failed: ${error.message}`);
            }
        } else if (actionType === "dataSubmit") {
            // NOTE: Need to integarte the api for transfering user data
            alert(`Submitting data: ${inputValue}`);
        }
    };

    return {
        handleAction, connectWallet,
        actionType, setActionType,
        inputValue, setInputValue,
        logs, isWalletConnected,
        isToast,
        showToast,
        message
    }
}
