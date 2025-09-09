import { useActionState, useEffect } from "react";
import api from "../api";
import { Input, FormLabel, Button } from "@mui/joy";
import Add from "@mui/icons-material/Add";
import { useParams } from "react-router";
import { useNavigate } from "react-router";

export default function EditCrud() {
  const { pageId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    console.log(pageId);
  }, [pageId]);

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
  return (
    <>
      <title>Form Edit</title>
      <div className="flex items-center justify-center max-w-4xl min-h-screen mx-auto mb-5">
        <div className="space-y-5">
          <div className="w-[500px]">
            <div className="flex justify-between">
              <p className="text-xl font-bold">Form Edit</p>
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
              <div className="flex gap-3">
                <Button color="neutral" onClick={() => navigate("/")}>
                  Kembali
                </Button>
                <Button
                  type="submit"
                  startDecorator={<Add />}
                  loading={isFormLoading}
                >
                  Simpan Data
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
