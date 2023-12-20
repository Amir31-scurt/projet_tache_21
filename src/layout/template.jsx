import React from 'react';
import ProgramList from '../components/programmes/programmes';
import SpecificPro from '../components/programmes/Single_Programmes/specific_program';
import { Routes, Route } from 'react-router-dom';

export default function Template() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<ProgramList />} />
        <Route path="/specific-cour" element={<SpecificPro />} />
      </Routes>
    </div>
  );
}
