import React from 'react';
import ProgramList from '../components/programmes/programmes';
import SpecificPro from '../components/programmes/Single_Programmes/specific_program';

export default function Template() {
  return (
    <div>
      <ProgramList />
      <SpecificPro />
    </div>
  );
}
