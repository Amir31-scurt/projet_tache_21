import React from 'react'
import { Card } from 'primereact/card';
import { Divider } from 'primereact/divider';

export default function CoursHtmlCss() {

    
    function CarteCours() {
        return (
            <div className="card" style={{padding:'20px'}}>
                <div>bgrfr</div>
                <Card  style={{border:'1px solid #e16d07',padding:'30px'}} > 
                        <h5>html</h5>

                    <p className="m-4">
                        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Inventore sed consequuntur error repudiandae 
                        numquam deserunt quisquam repellat libero asperiores earum nam nobis, culpa ratione quam perferendis esse, cupiditate neque quas!
                    </p>
                </Card>

            <div className='text-end mt-2  justify-content-between '>
                <button className='btn me-2' style={{backgroundColor:'#e16d07'}}>Demarer</button>
                {/* <button className='btn' style={{backgroundColor:'#e16d07'}}>Terminer</button> */}
            
            </div>
            </div>
        )
    }
            
  return (
    <div className='bg-cours p-2'>
        <h2 > Listes des cours</h2>
        <div className='container'>
            <div className='row'>
            <CarteCours/>

            </div>
        </div>

    </div>
  )
}
