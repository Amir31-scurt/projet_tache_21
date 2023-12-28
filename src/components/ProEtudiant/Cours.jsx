import React, { useState } from 'react'
import { Card } from 'primereact/card';
import { Modal, ButtonToolbar, Button, RadioGroup, Radio, Placeholder } from 'rsuite';
import { ChangeCircle } from '@mui/icons-material';
import { useEffect } from 'react';

export default function CoursHtmlCss() {

    
    function CarteCours() {
        const [display,setDisplay]=useState(false)
        const [changement, setChangement]=useState(false)
        const [livraison, setLivraison]=useState(true)
        const handleDisplay= ()=>{
            setDisplay(true)
            setChangement(true)
            setLivraison(false)
          
        }
        const handleChangement =() =>{
        setChangement(true)
         
        }
        const [backdrop, setBackdrop] = React.useState('static');
        const handleClose = () => setOpen(false);
       ;
     
      
        const [open, setOpen] = React.useState(false);
        const handleOpen = () =>{
            setOpen(true)
        } 
        const [files, setFiles] = useState();
  const [previews, setPreviews] = useState();

  // 
  useEffect(() => {
    if (!files) return; 
    let tmp = [];
    for (let i = 0; i < files.length; i++) {
      tmp.push(URL.createObjectURL(files[i]));
    }
    const objectUrls = tmp;
    setPreviews(objectUrls);

    // free memory
    for (let i = 0; i < objectUrls.length; i++) {
      return () => {
        URL.revokeObjectURL(objectUrls[i]);
      };
    }
  }, [files]);

        return (
            <div className="card" style={{padding:'20px'}}>
                <Card  style={{border:'1px solid #48a93c',padding:'30px'}} > 
                    <h5>html</h5>
                    <p>durée</p>
                    <p className="">
                        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Inventore sed consequuntur error repudiandae 
                        numquam deserunt quisquam repellat libero asperiores earum nam nobis, culpa ratione quam perferendis esse, cupiditate neque quas!
                    </p>
                </Card>

            <div className='text-end mt-2 gap-2 d-flex justify-content-end '>
            <Modal backdrop={backdrop} keyboard={false} open={open} onClose={handleClose}>
        <Modal.Header>
          <Modal.Title>Envoyer mon travail</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <div class="mb-3">
  <textarea  placeholder="description" class="form-control" id="exampleFormControlTextarea1" rows="3"></textarea>
    </div>
      {previews &&
        previews.map((pic) => {
          
          return <div className='d-flex '><img src={pic}   className='output gap-3'/></div>;
        })}
    <div className="text-center mt-4">
  <label for="formFileLg" id='myfiles' className="form-label inputStyle ">Choisir Fichiers</label>

  <input className="form-control d-none " onChange={(e)=> {
    if(e.target.files && e.target.files.length > 0){
      setFiles(e.target.files);
    }
  }}  multiple accept="image/*" id="formFileLg" type="file"/>
  </div>
        </Modal.Body>
        <Modal.Footer>
        <button type='submit' className='inputStyle'>Envoyer</button>
        </Modal.Footer>
      </Modal>
            <button  className={` btn text-white ${livraison ?'d-none': 'd-block'}`}  onClick={handleOpen} style={{backgroundColor:'#48a93c'}}>Livrer</button>
                <button  className={` btn text-white ${changement ?'d-none': 'd-block'}`} onClick={handleDisplay} style={{backgroundColor:'#48a93c'}}>Demarer</button>
                 <button   onClick={handleChangement} className={` btn text-white ${display ?'d-block': 'd-none'}`} style={{backgroundColor:'#3084b5'}}>Terminer</button>
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
