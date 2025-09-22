import { useEffect, useState, lazy } from "react";
import Card from "@mui/joy/Card";
import CardOverflow from "@mui/joy/CardOverflow";
import CardContent from "@mui/joy/CardContent";
import Button from "@mui/joy/Button";
import Table from "@mui/joy/Table";
import TablePagination from "@mui/material/TablePagination";
import { Divider } from "@mui/joy";
import ConfirmDelete from "./ConfirmDelete";
import api from "../api";
import { useDispatch } from "react-redux";
import { showSnackbar } from "../redux/actions/snackbarSlice";
import { useNavigate } from "react-router";
import SearchBox from "./SearchBox";

const TableSkeleton = lazy(() => import("./TableSkeleton"));

export default function TableCrud({
  refresh,
  onSearchBox,
  onDeleted,
  pageRow,
  sizeRow,
  onChangePage,
  onChangePageSize,
}) {
  const [questions, setQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [searchText, setSearhText] = useState("");
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [idRow, setIdRow] = useState();
  const [page, setPage] = useState(pageRow);
  const [rowsPerPage, setRowsPerPage] = useState(sizeRow);
  const [countPage, setCountPage] = useState(0);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChangePage = (_, newPage) => {
    // setPage(newPage);
    console.log(newPage);
    onChangePage(newPage + 1);
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    // setRowsPerPage(parseInt(event.target.value, 10));
    setPage(1);
    console.log(parseInt(event.target.value));
    onChangePageSize(parseInt(event.target.value));
    setRowsPerPage(event.target.value);
  };

  const openDeleteDialog = (value) => {
    setIdRow(value);
    setConfirmDelete(true);
  };

  const onSearch = (value) => {
    onSearchBox(value);
    setSearhText(value);
  };

  const deleteData = async () => {
    try {
      setConfirmLoading(true);
      await api.delete(`/questions/${idRow}`);

      onDeleted(true);
      dispatch(
        showSnackbar({
          show: true,
          message: "Data berhasil dihapus",
          type: "info",
        })
      );
    } catch (error) {
      console.log(error);
      onDeleted(false);
    } finally {
      setConfirmLoading(false);
      setConfirmDelete(false);
    }
  };

  const fetchQuestion = async () => {
    try {
      setIsLoading(true);

      const params = [`page=${pageRow}`,`size=${sizeRow}`]

      if(searchText.length > 0) params.push(`search=${searchText}`)

      const response = await api.get(
        `/questions?${params.join("&")}`
      );

      setRowsPerPage(response.data.size);
      setPage(response.data.page - 1);
      setCountPage(response.data.total);
      console.log(response.data);
      setQuestions(response.data.items);
    } catch (error) {
      console.log(error);
      if (error.status == 404) setQuestions([]);
    } finally {
      setTimeout(() => setIsLoading(false), 600);
    }
  };

  useEffect(() => {
    const controller = new AbortController();

    fetchQuestion();
    console.log(refresh);

    return () => {
      controller.abort();
      clearTimeout();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refresh,searchText, pageRow, sizeRow]);

  return (
    <>
      <Card
        sx={{
          "--Card-padding": "0px",
        }}
      >
        <CardOverflow>
          <CardContent>
            <SearchBox onDelay={onSearch} />
            <Table aria-label="Tabel Pertanyaan">
              <thead>
                <tr>
                  <th className="w-[40px]">ID</th>
                  <th>Pertanyaan</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <TableSkeleton column="3" />
                ) : (
                  questions.map((question) => (
                    <tr key={question.id}>
                      <td>{question.id}</td>
                      <td>{question.question_text}</td>
                      <td className="flex gap-1">
                        <Button
                          variant="soft"
                          size="sm"
                          onClick={() => navigate(`/${question.id}`)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="soft"
                          size="sm"
                          color="danger"
                          onClick={() => openDeleteDialog(question.id)}
                        >
                          Hapus
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
            <Divider orientation="horizontal" />
            <TablePagination
              component="div"
              count={countPage}
              page={page}
              rowsPerPageOptions={[1, 2, 10]}
              onPageChange={handleChangePage}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </CardContent>
        </CardOverflow>
      </Card>

      <ConfirmDelete
        open={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        onDelete={deleteData}
        loading={confirmLoading}
      />
    </>
  );
}
