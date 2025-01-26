"use client";

import { useEffect, useState } from "react";
import moment from 'moment';
import {formatNumberToBalance, getDecimals, getKeyringFromSeed, initialize } from "avail-js-sdk"
import { useStore } from "../store/useStore";
import config from '../config';

const usePolkadotExtension = () => {
    const [extensionApis, setExtensionApis] = useState(null);
  
    useEffect(() => {
      const loadExtension = async () => {
        if (typeof window !== "undefined") {
          const { web3Enable, web3Accounts, web3FromAddress } = await import(
            "@polkadot/extension-dapp"
          );
          setExtensionApis({ web3Enable, web3Accounts, web3FromAddress });
        }
      };
  
      loadExtension();
    }, []);
  
    return extensionApis;
  };

export const useExplorer = () => {
    const { showToast, isToast, message, setTransactionData, transactionData, setSubmittedData,submittedData } = useStore();
    const [availApi, setAvailApi] = useState(null);
    const [loading, setLoading] = useState(false);
    const [isWalletConnected, setIsWalletConnected] = useState(false);
    const [actionType, setActionType] = useState("transfer");
    const [inputValue, setInputValue] = useState("");
    const [account, setAccount] = useState(null);
    const extensionApis = usePolkadotExtension();

    // Connect wallet
    const connectWallet = async () => {
          const { web3Enable, web3Accounts } = extensionApis;
          const extensions = await web3Enable("My DApp");
          if (!extensions.length) {
            showToast(true, "Please install Polkadot.js extension!");
            return;
          }
      
          const accounts = await web3Accounts();
          setAccount(accounts[0]);
          if (accounts[0]) {
            setIsWalletConnected(true);
          }
    };

    const handleAction = async () => {
        try{
            if (!account) {
                showToast(true, "Please connect your wallet first");
                return;
            }
            setLoading(true);
            let api = availApi
            if (!(api && api.isConnected)) {
              api = await initialize(config?.endpoint);
              setAvailApi(api)
            }
            const testAccount = getKeyringFromSeed(config?.seed)
            const toAccount = account?.meta?.name || account?.meta?.source
            // balance transfer
           if(actionType ==="transfer"){
            const uniqueTxn= crypto.randomUUID()
            const decimals = getDecimals(api)
            const amount = formatNumberToBalance(Number(inputValue), decimals)
            const oldBalance = await api.query.system.account(testAccount?.address)
            if(amount>oldBalance?.data?.free?.toHuman()){
                setLoading(false);
                return showToast(true, "Insufficient Wallet Balance. Please add balance to transfer.");
            }
            const txResult = await new Promise((res) => {
            const transferredData =  api.tx.balances.transferKeepAlive(account.address, amount)
            const time = moment(Date.now()).format('D MMM h:mmA')
            setTransactionData({[uniqueTxn]:[testAccount.address,toAccount,inputValue,time,"In Progress"]})
            setInputValue("")
            setLoading(false);
            transferredData .signAndSend(testAccount, { app_id: 0, nonce: -1 }, (result) => {
                if(result.isError){
                setTransactionData({[uniqueTxn]:[testAccount.address,toAccount,inputValue,time,"Error"]})
                }
                if(result.isInBlock){
                setTransactionData({[uniqueTxn]:[testAccount.address,toAccount,inputValue,time,"InBlock"]})
                }
                if(result.isFinalized){
                res(result);
                setTransactionData({[uniqueTxn]:[testAccount.address,toAccount,inputValue,time,"Finalized"]})
                }
            })
            })
             // Error handling
            const error = txResult.dispatchError
            if (txResult.isError) {
                setLoading(false);
                showToast(true, `Transaction was not executed`);
            } else if (error != undefined) {
                if (error.isModule) {
                    const decoded = api.registry.findMetaError(error.asModule)
                    const { docs, name, section } = decoded
                    setLoading(false);
                    showToast(true, `Transaction failed: ${section}.${name}: ${docs.join(" ")}`);
                } else {
                    setLoading(false);
                    showToast(true, `Transaction failed: ${error}`);
                }
            }
           // Data Submit
           }else{
            const time = moment(Date.now()).format('D MMM h:mmA')
            const tx = api.tx.dataAvailability.submitData(String(inputValue));
            setSubmittedData({[inputValue]:[testAccount.address,toAccount,inputValue,time,"In Progress"]})
            setInputValue("")
            setLoading(false);
            tx.signAndSend(testAccount, {nonce: -1 }, (result) => {
                if(result.isError){
                 setSubmittedData({[inputValue]:[testAccount.address,toAccount,inputValue,time,"Error"]})
                }
                if(result.isInBlock){
                 setSubmittedData({[inputValue]:[testAccount.address,toAccount,inputValue,time,"InBlock"]})
                }
                if(result.isFinalized){
                 setSubmittedData({[inputValue]:[testAccount.address,toAccount,inputValue,time,"Finalized"]})
                }
             })
           }
        }catch(err){
            showToast(true, `${actionType} failed: ${err}`);
            setLoading(false);
        }
    };

    return {
        handleAction, connectWallet,
        actionType, setActionType,
        inputValue, setInputValue,
        transactionData, isWalletConnected,
        isToast, showToast, message,
        submittedData,loading
    }
}
