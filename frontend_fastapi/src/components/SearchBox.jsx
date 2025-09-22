import { useEffect,useState } from "react";
import Input from "@mui/joy/Input";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";

export default function SearchBox({ onDelay }) {
  const [inputValue, setInputValue] = useState("");
  const [debouncedSearchTerm, setDebounceSearchTerm] = useState("");

  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebounceSearchTerm(inputValue);
    }, 500);

    return () => {
      clearTimeout(timerId);
    };
  }, [inputValue]);

  useEffect(()=>{
    if(debouncedSearchTerm){
        onDelay(inputValue)
    }else{
        onDelay(false)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearchTerm])

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  return (
    <div className="p-2">
      <Input
        value={inputValue}
        onChange={handleInputChange}
        startDecorator={<SearchOutlinedIcon />}
      />
    </div>
  );
}
