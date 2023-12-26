import React from 'react';
import CustomDataTable from './CustomDataTable';
import NewCoach from './NewCoach';

const Table = () => {
  const data = [
    {
      id: 1,
      nom: 'John Doe',
      email: 'john.doe@example.com',
      domaine: 'example.com',
    },
    {
      id: 2,
      nom: 'Amadou Oury Bah',
      email: 'john.doe@example.com',
      domaine: 'example.com',
    },
    {
      id: 3,
      nom: 'Serigne Mourtalla Syll',
      email: 'john.doe@example.com',
      domaine: 'example.com',
    },
    {
      id: 4,
      nom: 'Mamadou Barry',
      email: 'john.doe@example.com',
      domaine: 'example.com',
    },
    {
      id: 5,
      nom: 'Yaya DIa',
      email: 'john.doe@example.com',
      domaine: 'example.com',
    },
    {
      id: 6,
      nom: 'Oumar Ndongo',
      email: 'john.doe@example.com',
      domaine: 'example.com',
    },
    {
      id: 7,
      nom: 'El Emir',
      email: 'john.doe@example.com',
      domaine: 'example.com',
    },
    {
      id: 8,
      nom: 'Anna Faye',
      email: 'john.doe@example.com',
      domaine: 'example.com',
    },
    {
      id: 9,
      nom: 'Mariama Bah',
      email: 'john.doe@example.com',
      domaine: 'example.com',
    },
    {
      id: 10,
      nom: 'Cheikh Ahmed Tidiane',
      email: 'john.doe@example.com',
      domaine: 'example.com',
    },
    {
      id: 11,
      nom: 'El Bechir',
      email: 'john.doe@example.com',
      domaine: 'example.com',
    },
    {
      id: 12,
      nom: 'Sam Laye',
      email: 'john.doe@example.com',
      domaine: 'example.com',
    },
    {
      id: 13,
      nom: 'John Doe',
      email: 'john.doe@example.com',
      domaine: 'example.com',
    },
    {
      id: 14,
      nom: 'John Doe',
      email: 'john.doe@example.com',
      domaine: 'example.com',
    },
    {
      id: 15,
      nom: 'John Doe',
      email: 'john.doe@example.com',
      domaine: 'example.com',
    },
  ];

  return (
    <div>
      <NewCoach />
      <CustomDataTable data={data} />
    </div>
  );
};

export default Table;
