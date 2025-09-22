import { useState, useActionState } from "react";
import Button from "@mui/joy/Button";
import FormLabel from "@mui/joy/FormLabel";
import Snackbar from "@mui/joy/Snackbar";
import Add from "@mui/icons-material/Add";
import api from "../api";
import TableCrud from "../components/TableCrud";
import Input from "@mui/joy/Input";
import { useSelector, useDispatch } from "react-redux";
import { useSearchParams } from "react-router";
import { closeSnackbar } from "../redux/actions/snackbarSlice";

function App() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [refreshTable, setRefreshTable] = useState(0);
  const page = searchParams.get("page");
  const size = searchParams.get("size");
  const snackbarShow = useSelector((state) => state.snackbar.show);
  const snackbarMessage = useSelector((state) => state.snackbar.message);
  const dispatch = useDispatch();

  const submitForm = async (prevState, values) => {
    try {
      const newData = {
        question_text: values.get("question_text"),
        question_category: values.get("question_category"),
        author: values.get("author"),
      };

      // consume api with post method to add data
      const response = await api.post("/questions", newData);

      // show response after add data
      console.log(response);
      // refetch question after add data
      setRefreshTable((prevState) => prevState + 1);
    } catch (error) {
      // show message error when failed in add data
      console.log(error);
    }

    return {
      ...prevState,
    };
  };

  const [, handleSubmitForm, isFormLoading] = useActionState(submitForm, {
    question_text: "",
    question_category: "",
    author: "",
  });

  const onDeleted = (value) => {
    if (value) setRefreshTable((prevState) => prevState + 1);
  };

  const onChangePage = (value) => {
    console.log(`from App component event onChangePage with value:${value}`);
    setSearchParams((prevParam) => {
      const newParams = new URLSearchParams(prevParam);
      newParams.set("page", value);
      return newParams;
    });
  };

  const onChangePageSize = (value) => {
    console.log(
      `from App component event onChangePageSize with value:${value}`
    );
    setSearchParams((prevParam) => {
      const newParams = new URLSearchParams(prevParam);
      newParams.set("size", value);
      newParams.set("page", 1);
      return newParams;
    });
  };

  const onSearch = (value) => {
    if (value == false) {
      searchParams.delete("search");
      setSearchParams(searchParams);
    } else {
      setSearchParams((prevParam) => {
        const newParams = new URLSearchParams(prevParam);
        newParams.set("search", value);
        return newParams;
      });
    }
  };

  return (
    <>
      <title>CRUD React 19 Fastapi</title>
      <div className="flex items-center justify-center max-w-4xl min-h-screen mx-auto mb-5">
        <div className="space-y-5">
          <div>
            <div className="flex justify-between">
              <p className="text-xl font-bold">CRUD Fastapi + react</p>
            </div>
            <form action={handleSubmitForm} className="space-y-3">
              <div>
                <FormLabel>Question</FormLabel>
                <Input
                  type="text"
                  placeholder="Input question..."
                  name="question_text"
                  id="question_text"
                />
              </div>
              <div>
                <FormLabel>Category</FormLabel>
                <Input
                  type="text"
                  placeholder="Input category..."
                  name="question_category"
                  id="question_category"
                />
              </div>
              <div>
                <FormLabel>Author</FormLabel>
                <Input
                  type="text"
                  placeholder="Input author..."
                  name="author"
                  id="author"
                />
              </div>
              <Button
                type="submit"
                startDecorator={<Add />}
                loading={isFormLoading}
              >
                Simpan Data
              </Button>
            </form>
          </div>
          <TableCrud
            refresh={refreshTable}
            onDeleted={onDeleted}
            onChangePage={onChangePage}
            onChangePageSize={onChangePageSize}
            pageRow={page ? page : 1}
            sizeRow={size ? size : 2}
            onSearchBox={onSearch}
          />
        </div>
      </div>
      <Snackbar
        autoHideDuration={2000}
        open={snackbarShow}
        color="primary"
        variant="solid"
        onClose={(event, reason) => {
          if (reason === "clickaway") {
            return;
          }
          dispatch(closeSnackbar());
        }}
      >
        {snackbarMessage}
      </Snackbar>
    </>
  );
}

export default App;
