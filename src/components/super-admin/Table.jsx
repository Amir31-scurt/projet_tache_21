import CustomDataTable from "./CustomDataTable";

const Table = ({ certificationsData }) => {
  return (
    <div style={{ width: "80vw" }} className="px-1">
      <CustomDataTable data={certificationsData} />
    </div>
  );
};

export default Table;
