import React, { useState } from "react";
import CardLivraison from "./CardLivraison";
import FilterStudents from "./FilterStudents";

function MainComponent() {
  const [selectedStudent, setSelectedStudent] = useState(null);

  return (
    <div>
      <FilterStudents onSelect={(student) => setSelectedStudent(student)} />
      {selectedStudent && (
        <CardLivraison
          role={selectedStudent.role}
          title={selectedStudent.title}
          name={selectedStudent.name}
          date={selectedStudent.date}
          defaultImg={selectedStudent.defaultImg}
          images={selectedStudent.images}
          validation={selectedStudent.validation}
        />
      )}
    </div>
  );
}

export default MainComponent;
