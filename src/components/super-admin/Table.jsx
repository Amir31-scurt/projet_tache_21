import CustomDataTable from "./CustomDataTable";

// Méthode principale
const Table = ({ certificationsData }) => {
  return (
    <div>
      <CustomDataTable data={certificationsData} />
    </div>
  );
};

export default Table;
