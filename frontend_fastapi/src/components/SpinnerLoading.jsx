import CircularProgress from "@mui/joy/CircularProgress";
export default function SpinnerLoading() {
  return (
    <div className="flex min-h-screen justify-center items-center bg-gray-50">
      <CircularProgress variant="solid" value={25} />
    </div>
  );
}
