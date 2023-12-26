import React from 'react'
import CardLivraison from './CompoDashCoach/CardLivraison'
import FilterStudents from './CompoDashCoach/FiterStudents'

function ContentCardLivraison() {
  return (
    <div>
        <FilterStudents />
        <div className='d-flex justify-content-between flex-wrap'>
            <CardLivraison />
            <CardLivraison />
            <CardLivraison />
        </div>
    </div>
  )
}

export default ContentCardLivraison