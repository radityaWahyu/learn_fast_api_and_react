import { lazy } from "react";


const Skeleton = lazy(() => import("@mui/joy/Skeleton"))

export default function TableSkeleton({ row = 10, column = 0 }) {
  const arrayRow = Array.from({length:row});
  const arrayColumn = Array.from({length:column});

  if (column == 0) {
    return (
      <>
        {arrayRow.map((value,indexRow) => (
          <tr key={indexRow}>
            <td>
              <Skeleton
                animation="wave"
                variant="text"
                sx={{ width: "100%" }}
              />
            </td>
          </tr>
        ))}
      </>
    );
  }

  return (
    <>
      {arrayRow.map((value,indexRow) => (
        <tr key={indexRow}>
          {arrayColumn.map((value,indexColumn) => (
            <td key={indexColumn}>
              <Skeleton
                animation="wave"
                variant="text"
                sx={{ width: "100%" }}
              />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}
