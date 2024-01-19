import React from 'react'
import CardLivraison from './CompoDashCoach/CardLivraison'
import FilterStudents from './CompoDashCoach/FiterStudents'

function ContentCardLivraison() {
  return (
    <div>
    <h1 className='text-start'>Livraison</h1>
        <FilterStudents />
        <div className='d-flex justify-content-center  flex-wrap'>
            <CardLivraison />
            <CardLivraison />
            <CardLivraison />
        </div>
    </div>
  )
}

export default ContentCardLivraison