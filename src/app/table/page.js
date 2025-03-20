"use client";
import React, { useCallback, useEffect, useState } from 'react';
import DynamicTable from '../../../components/DynamicTable';
import { useRouter } from "next/navigation";
import { LuMoveUpLeft } from "react-icons/lu";

function Page() {
    const [data, setData] = useState([]);
    const [openFile, setOpenFIle] = useState(null);
    const router = useRouter();

    const handleBackClick = () => {
        router.back();
    };

    const fetchData = useCallback(async () => {
        try {
            const response = await fetch("/api/files", {
                method: "POST",
            });
            const result = await response.json();
            setData(result.files || []);
        } catch (error) {
           // console.error("Error fetching data:", error);
        }
    }, []);
    const deleteFile = async (fileName) => {
        if(!fileName) {
            return;
        }
        try {
            const response = await fetch("/api/files", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ fileName }),
            });

            if (!response.ok) {
                throw new Error("Failed to delete file");
            }

            const result = await response.json();
            console.log(result);
            alert(result.message);

            fetchData();
        } catch (error) {
           // console.error("Error deleting file:", error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const showFile = useCallback(async (fileName) => { 
        if(!fileName) {
            setOpenFIle('');
        }
        try {
            const response = await fetch(`/api/files/?p1=${fileName}`, {
                method: "GET",
            });

            if (!response.ok) {
                throw new Error("Failed to get file");
            }

            const result = await response.json();
            console.log(result);
            setOpenFIle(result.file);
        } catch (error) {
         // console.error("Error getting file:", error);
        }
    }, []);

    return (
        <div className="w-full h-screen bg-gray-200 flex flex-col p-4 relative bg-gradient-to-r from-slate-300 to-slate-100">
            {/* Back Button */}
            <div
                title="Back"
                onClick={handleBackClick}
                className="bg-[#00B0EF] absolute top-4 left-4 text-white p-3 rounded-full w-[40px] h-[40px] flex justify-center items-center cursor-pointer"
            >
                <LuMoveUpLeft style={{ fontSize: "20px" }} />
            </div>

            {/* Table Section */}
            <div className="w-full h-full flex justify-center items-center">
                <div className="w-[80%] bg-white p-4 rounded-lg shadow-lg">
                    <DynamicTable tableData={data} onDelete={deleteFile }  refreshtable ={(e)=> e ? fetchData():""} getfile={showFile} openFile={openFile}/>
                </div>
            </div>
        </div>
    );
}

export default Page;
