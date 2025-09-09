import { useEffect, useState, lazy } from "react";
import Card from "@mui/joy/Card";
import CardOverflow from "@mui/joy/CardOverflow";
import Button from "@mui/joy/Button";
import Table from "@mui/joy/Table";
import ConfirmDelete from "./ConfirmDelete";
import api from "../api";
import { useDispatch } from "react-redux";
import { showSnackbar } from "../redux/actions/snackbarSlice";
import { useNavigate } from "react-router";

const TableSkeleton = lazy(() => import("./TableSkeleton"));

export default function TableCrud({ refresh, onDeleted }) {
  const [questions, setQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [idRow, setIdRow] = useState();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const openDeleteDialog = (value) => {
    setIdRow(value);
    setConfirmDelete(true);
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

  useEffect(() => {
    const controller = new AbortController();

    const fetchQuestion = async () => {
      try {
        setIsLoading(true);
        const response = await api.get("/questions");
        setQuestions(response.data.data);
      } catch (error) {
        console.log(error);
        if (error.status == 404) setQuestions([]);
      } finally {
        setTimeout(() => setIsLoading(false), 600);
      }
    };

    fetchQuestion();
    console.log(refresh);

    return () => {
      controller.abort();
      clearTimeout();
    };
  }, [refresh]);

  return (
    <>
      <Card
        sx={{
          "--Card-padding": "0px",
        }}
      >
        <CardOverflow>
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
