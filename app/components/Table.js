"use client";
import React from "react";

export default function Table({headerItems, bodyItems}) {
    return (
        <table className="w-full mt-4 border-collapse border border-gray-700">
        <thead>
          <tr>
            {headerItems?.map((headerLabel)=>{
                return <th className="border border-gray-700 px-4 py-2 text-gray-300">{headerLabel}</th>
            })}
          </tr>
        </thead>
        <tbody>

          {bodyItems?.map((item, index) => (
            <tr key={index} className="bg-gray-800 hover:bg-gray-700">
                {item?.map((itemKey)=>{
                 return <td className=" text-center border border-gray-700 px-4 py-2 text-gray-300" key={itemKey}>{itemKey}</td>
                })}
            </tr>
          ))}
        </tbody>
      </table>
    )
}
