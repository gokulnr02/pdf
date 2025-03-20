"use client";
import React, { useState, useEffect } from "react";
import { IoShareSocialOutline } from "react-icons/io5";
import { MdOutlineFileDownload } from "react-icons/md";
import { MdMoreVert } from "react-icons/md";
import PDFlist from "../../../components/PDFlist";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import { Document, Page, pdfjs } from "react-pdf";
import Button from "../../../components/Button";
import Image from "next/image";
import { PDFDocument } from 'pdf-lib';
import { FiPrinter } from "react-icons/fi";
import AddPdf from "../../../components/AddPdf";


pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    "pdfjs-dist/build/pdf.worker.min.mjs",
    import.meta.url
).toString();

function Pdf() {
    const [searchTerm, setSearchTerm] = useState("");
    const [files, setfiles] = useState([])
    const [title, setTilte] = useState('')
    const [pageTexts, setPageTexts] = useState([]);
    const [file, setFiles] = useState("");
    const [numPages, setNumPages] = useState(null);
    const [filteredPages, setFilteredPages] = useState([]);
    const [AddPdF, setAddPdF] = useState(false);
    const [windowWidth, setWindowWidth] = useState(0);
    const [enableDownload, setEnableDownload] = useState(false);
    const [ViewPdfList, setViewPdfList] = useState(false);


    const [zoom, setZoom] = useState(1.0);

    const handleSelectFile = (file) => {
        setTilte(file);
        setFiles(file);
    }

    useEffect(() => {
        if (searchTerm && pageTexts.length > 0) {
            const filtered = pageTexts
                .map((text, index) =>
                    text.toLowerCase().includes(searchTerm.toLowerCase()) ? index + 1 : null
                )
                .filter(Boolean);
            setFilteredPages(filtered);
        } else {
            setFilteredPages([]);
        }
    }, [searchTerm, pageTexts]);

    const onDocumentLoadSuccess = async ({ numPages }) => {
        setNumPages(numPages);
        const pdf = await pdfjs.getDocument(file).promise;
        const texts = await Promise.all(
            Array.from({ length: numPages }, (_, i) => extractPageText(pdf, i + 1))
        );
        console.log(texts, 'texts')
        setPageTexts(texts);
    };



    const highlightSearchTerm = () => {
        if (!searchTerm) {
            // Restore original text if search is cleared
            document.querySelectorAll(".pdf-viewer .react-pdf__Page__textContent span").forEach((span) => {
                const originalText = span.getAttribute("data-original-text");
                if (originalText) {
                    span.innerHTML = originalText;
                }
            });
            return;
        }

        document.querySelectorAll(".pdf-viewer .react-pdf__Page__textContent span").forEach((span) => {
            const originalText = span.getAttribute("data-original-text") || span.textContent;
            span.setAttribute("data-original-text", originalText); // Preserve original text

            const regex = new RegExp(`(${searchTerm})`, "gi");
            if (regex.test(originalText)) {
                span.innerHTML = originalText.replace(
                    regex,
                    `<mark style="background-color: yellow; color: black;">$1</mark>`
                );
            } else {
                span.innerHTML = originalText; // Remove old highlights
            }
        });
    };

    function renameFun(filePath) {
        try {
            return filePath.replace(/^\.\/uploads\//, "")
        } catch (er) {
            return filePath
        }
    }
    const extractPageText = async (pdf, pageNumber) => {
        const page = await pdf.getPage(pageNumber);
        const textContent = await page.getTextContent();
        return textContent.items.map((item) => item.str).join(" ");
    };

    useEffect(() => {
        highlightSearchTerm();
    }, [searchTerm]);

    const handleDownload = async () => {
        console.log('filteredPages')
        if (filteredPages.length === 0) return;

        const existingPdfBytes = await fetch(file).then(res => res.arrayBuffer());
        console.log(existingPdfBytes)
        const pdfDoc = await PDFDocument.load(existingPdfBytes);
        const newPdf = await PDFDocument.create();

        for (const pageNum of filteredPages) {
            const [copiedPage] = await newPdf.copyPages(pdfDoc, [pageNum - 1]);
            newPdf.addPage(copiedPage);
        }

        const newPdfBytes = await newPdf.save();
        const blob = new Blob([newPdfBytes], { type: 'application/pdf' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'filtered_pages.pdf';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleButtonClick = () => {
        setAddPdF(!AddPdF);
        setViewPdfList(!ViewPdfList);
    };

    useEffect(() => {
        const searchParams = window.location.href;
        const cleanedText = searchParams.replace(/^.*\bpdf\?/, "");
        const key = decodeURIComponent(cleanedText)
        fetch('/api/files')
            .then((res) => res.json())
            .then(async (data) => {
                if (data.success) {
                    const selectedFiles = [];

                    for (const file of data.files) {
                        try {
                            const pdf = await pdfjs.getDocument(file).promise;
                            const texts = await Promise.all(
                                Array.from({ length: pdf.numPages }, (_, i) => extractPageText(pdf, i + 1))
                            );

                            if (texts.some((text) => text.includes(key))) {
                                selectedFiles.push(file);
                            }
                        } catch (error) {
                            console.log("Error processing PDF:", error);
                        }
                    }
                    setFiles(selectedFiles[0])
                    setTilte(selectedFiles[0])
                    setfiles(selectedFiles)
                };

            })
            .catch((error) => console.log('Error fetching files:', error));
    }, []);




    useEffect(() => {
        const handleResize = () => setWindowWidth(window.innerWidth);

        handleResize();

        window.addEventListener('resize', handleResize);

        return () => window.removeEventListener('resize', handleResize);
    }, [])

    useEffect(() => {
        if (windowWidth > 768) {
            setEnableDownload(true);
            setViewPdfList(true);
        } else {
            setEnableDownload(false);
            setViewPdfList(false);
        }
    }, [windowWidth])

    const A4_WIDTH = windowWidth < 768 ? 250 : 700;
    const A4_HEIGHT = windowWidth < 768 ? 2 : (A4_WIDTH * 1);

    return (
        <div className="w-full h-screen flex flex-col relative">
            {/* Top Bar */}
            {AddPdF && <AddPdf setView={handleButtonClick} />}
            <div className="w-full  md:h-[40px] lg:h-[80px]  flex justify-between items-center shadow-md px-4 bg-white">
                <p className="font-bold text-sm flex flex-row w-auto gap-2 items-center">
                    <span className="flex sm:hidden items-center gap-2">
                        <svg
                            onClick={() => setViewPdfList(!ViewPdfList)}
                            xmlns="http://www.w3.org/2000/svg"
                            height="24px"
                            viewBox="0 -960 960 960"
                            width="24px"
                            fill="#1f1f1f"
                        >
                            <path d="M80-160v-160h160v160H80Zm240 0v-160h560v160H320ZM80-400v-160h160v160H80Zm240 0v-160h560v160H320ZM80-640v-160h160v160H80Zm240 0v-160h560v160H320Z" />
                        </svg>
                    </span>
                    {renameFun(title)}
                </p>

                <div className="flex items-center space-x-4 hidden md:flex ">
                    <p className="text-sm">1/{numPages}</p>
                    <div className="flex items-center gap-2">
                        <button title="Zoom Out" onClick={() => setZoom(zoom - 0.1)} className="text-base cursor-pointer">-</button>
                        <p>{Math.round(zoom * 100)}%</p>
                        <button title="Zoom In" onClick={() => setZoom(zoom + 0.1)} className="text-base cursor-pointer">+</button>
                    </div>
                    <div className="flex items-center gap-2">
                        <IoShareSocialOutline className="cursor-pointer" title="Share" />
                        <MdOutlineFileDownload className="cursor-pointer" title="Download" />
                        <FiPrinter className="cursor-pointer" title="Print" />
                        <MdMoreVert className="cursor-pointer" title="More" />
                    </div>
                </div>
                <Image
                    src="/Images/OrimartLogo.jpg"
                    alt="Brand Logo"
                    width={windowWidth > 768 ? 140 : 70}
                    height={windowWidth > 768 ? 140 : 70}
                    className="md:w-[70px] lg:w-[120px] h-auto"
                />
            </div>

            {/* Main Layout */}
            <div className="w-full flex flex-col md:flex-row flex-grow overflow-hidden relative">
              { (filteredPages.length > 0 && !enableDownload)&&  <div className="z-10 rounded-full bg-sky-500 w-[40px] h-[40px] flex justify-center items-center cursor-pointer absolute right-4 bottom-10 visible md:hidden lg:hidden xl:hidden"

                    onClick={() => setEnableDownload(!enableDownload)}>
                  <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#1f1f1f"><path d="M280-280h400v-80H280v80Zm200-120 160-160-56-56-64 62v-166h-80v166l-64-62-56 56 160 160Zm0 320q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z" /></svg>
                </div>}

                {/* Left Sidebar */}
                <div className={`w-full md:w-[20%] lg:w-[25%] xl:w-[25%] 
              ${ViewPdfList ? 'translate-x-0 opacity-100 absolute left-1 md:relative z-10' : 'translate-x-full opacity-0 hidden'} 
              h-full flex flex-col items-center p-4 bg-gray-200 gap-2 
              transition-all duration-1000 ease-in-out scroll-smooth `}>
                    <div className="w-full h-8 border rounded-md hidden md:block lg:block xl:block">
                        <input
                            placeholder="Search here"
                            className="w-full h-8 outline-none px-2 text-sm bg-white"
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="w-full flex justify-between mt-2 relative">
                        <p className="text-gray-500 text-sm">Document</p>
                        <div className="bg-sky-500 w-[20px] h-[20px] flex items-center justify-center text-white text-base font-bold rounded-full cursor-pointer"
                            title="Add PDF"
                            onClick={handleButtonClick}>+</div>
                    </div>
                    <div className="mt-2 flex-grow overflow-y-auto scrollbar-hide">
                        <PDFlist files={files} setFiles={handleSelectFile} layout="vertical" />
                    </div>
                </div>

              { (ViewPdfList || !enableDownload) &&  <div className="w-full  h-[50px] flex  justify-center items-center visible md:hidden lg:hidden xl:hidden ">
                    <div className="w-[80%] h-8 border rounded-md ">
                        <input
                            placeholder="Search here"
                            className="w-full h-full outline-none px-2 text-sm bg-white"
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>}


                {/* Center PDF Viewer */}
                <div className="lg:w-[50%] md:w-[100%] md:mt-4 lg:mt-0 xl:mt-0 h-full flex flex-col items-center overflow-y-auto scrollbar-hide">
                    <Document file={file} onLoadSuccess={onDocumentLoadSuccess}>
                        {numPages &&
                            Array.from({ length: numPages }, (_, i) => (
                                <div key={i} className="text-center ">
                                    <Page pageNumber={i + 1} width={A4_WIDTH} height={A4_HEIGHT} scale={zoom} />
                                    <p>Page {i + 1}</p>
                                </div>
                            ))}
                    </Document>
                </div>

                {/* Right Sidebar */}
                <div
                    className={`z-15 w-full md:w-[20%] lg:w-[25%] xl:w-[25%]  relative
              ${enableDownload ? 'translate-x-0 opacity-100 absolute right-1 md:relative' : 'translate-x-full opacity-0 hidden'} 
              h-full flex flex-col items-center p-4 bg-gray-200 gap-2 
              transition-all duration-1000 ease-in-out scroll-smooth `}
                >
                    <p className="text-gray-500 text-sm text-left w-full">Filtered File</p>
                    <div className="w-full bg-gray-100 flex flex-col items-center p-4 border-l border-gray-300 overflow-y-auto ">
                        <Button
                            onclick={handleDownload}
                            Name="Download"
                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
                        />
                        <Document file={file} onLoadSuccess={onDocumentLoadSuccess}>
                            {filteredPages.length > 0 ? (
                                filteredPages.map((pageNum) => (
                                    <div key={pageNum} className="my-2">
                                        <Page pageNumber={pageNum} width={100} scale={2} />
                                        <p>Page {pageNum}</p>
                                    </div>
                                ))
                            ) : (
                                <p>No results</p>
                            )}
                        </Document>

                         <div onClick={() => setEnableDownload(!enableDownload)} className="  sm:visible lg:hidden xl:hidden lgz-200 absolute bottom-10 right-3 bg-sky-500 w-[40px] h-[40px] flex justify-center items-center cursor-pointer rounded-full">
                              <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#1f1f1f"><path d="m336-280 144-144 144 144 56-56-144-144 144-144-56-56-144 144-144-144-56 56 144 144-144 144 56 56ZM480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z" /></svg>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );

}

export default Pdf;
