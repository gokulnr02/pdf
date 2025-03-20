"use client";
import * as React from "react";
import PropTypes from "prop-types";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  Toolbar,
  Typography,
  Paper,
  TextField,
  Dialog,
  DialogContent,
  DialogTitle
} from "@mui/material";
import Image from "next/image";
import { visuallyHidden } from "@mui/utils";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import { Document, Page, pdfjs } from "react-pdf";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

// Component accepts `tableData` and `onDelete` function as props
export default function EnhancedTable({ tableData, onDelete, refreshtable, getfile, openFile }) {
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("calories");
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [searchTerm, setSearchTerm] = React.useState("");


  // Columns are derived dynamically from `tableData`
  const columns = tableData.length
    ? Object.keys(tableData[0]).map((key) => ({
        id: key,
        label: key.charAt(0).toUpperCase() + key.slice(1), // Capitalize first letter
        numeric: typeof tableData[0][key] === "number"
      }))
    : [];

  // Handle sorting
  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  // Handle search
  const filteredRows = tableData.filter((row) =>
    Object.values(row).some((val) =>
      val.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );


  const sortedRows = React.useMemo(() => {
    return [...filteredRows].sort((a, b) =>
      order === "asc" ? (a[orderBy] < b[orderBy] ? -1 : 1) : (a[orderBy] > b[orderBy] ? -1 : 1)
    );
  }, [filteredRows, order, orderBy]);


  const visibleRows = sortedRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);


  const fileName = (url) => {
    if(!url) return '';
    const parts = url.split("/");
    return parts[parts.length - 1];
  }

  return (
    <Box sx={{ width: "100%" }}>
      <Paper sx={{ width: "100%", mb: 2, p: 2 }}>
        {/* Toolbar with title and search */}
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="h6" className="flex w-full gap-4 font-bold text-md"> Pdf List
            <Image
              src="/refresh.svg"
              title="Refresh"
              alt="View"
              width={15}
              height={15}
              onClick={() => { refreshtable(true); }}
              className="cursor-pointer"
            />
          </Typography>
          <TextField
            size="small"
            label="Search"
            variant="outlined"
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ width: 300 }}
          />
        </Toolbar>

        {/* Table container */}
        <TableContainer sx={{ height: "400px", overflowY: "auto" }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    align={column.numeric ? "right" : "left"}
                    sortDirection={orderBy === column.id ? order : false}
                    sx={{ backgroundColor: "lightblue" }}
                  >
                    <TableSortLabel
                      active={orderBy === column.id}
                      direction={order}
                      onClick={() => handleRequestSort(null, column.id)}
                    >
                      {column.label}
                      {orderBy === column.id ? (
                        <Box component="span" sx={visuallyHidden}>
                          {order === "desc" ? "sorted descending" : "sorted ascending"}
                        </Box>
                      ) : null}
                    </TableSortLabel>
                  </TableCell>
                ))}
                <TableCell align="center" sx={{ backgroundColor: "lightblue" }}>
                  Action
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {visibleRows.map((row, index) => (
                <TableRow key={index} hover>
                  {columns.map((column) => (
                    <TableCell key={column.id} align={column.numeric ? "right" : "left"}>
                      {row[column.id]}
                    </TableCell>
                  ))}
                  <TableCell>
                    <div className="flex w-full justify-center items-center space-x-2 gap-4">
                      <Image
                        src="/delete.svg"
                        alt="Delete"
                        width={20}
                        height={20}
                        className="cursor-pointer"
                        title="Delete"
                        onClick={() => onDelete(row.fileName)}
                      />
                      <Image
                        src="/visibility.svg"
                        title="View"
                        alt="View"
                        width={20}
                        height={20}
                        className="cursor-pointer"
                        onClick={() => getfile(row.fileName)} // Open file in modal
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Pagination */}
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          count={filteredRows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(event, newPage) => setPage(newPage)}
          onRowsPerPageChange={(event) => {
            setRowsPerPage(parseInt(event.target.value, 10));
            setPage(0);
          }}
        />
      </Paper>

      {/* Image Viewer Modal */}
      <Dialog open={!!openFile} onClose={() => getfile(null)} maxWidth="md">
        <div className="w-full bg-white">
          <DialogTitle ><div className="text-md font-bold">{fileName(openFile)} </div> </DialogTitle>
          <DialogContent>
            <div style={{ width: 'auto', height: 'auto', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <Document file={openFile}>
                <Page pageNumber={1} width={300} scale={1.4} />
              </Document>
            </div>
          </DialogContent>
        </div>
      </Dialog>
    </Box>
  );
}

// Prop Types
EnhancedTable.propTypes = {
  tableData: PropTypes.array.isRequired, // Expecting an array of objects
  onDelete: PropTypes.func.isRequired, // Function to handle delete action
  refreshtable: PropTypes.func.isRequired, // Function to refresh the table
  getfile: PropTypes.func.isRequired, // Function to handle fetching file data
  openFile: PropTypes.string // Optional: file URL for the modal view
};
