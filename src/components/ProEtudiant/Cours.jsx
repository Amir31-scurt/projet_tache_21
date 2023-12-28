import React, { useState } from 'react'
import { Card } from 'primereact/card';
import { Modal, ButtonToolbar, Button, RadioGroup, Radio, Placeholder } from 'rsuite';

export default function CoursHtmlCss() {

    
    function CarteCours() {
        const [display,setDisplay]=useState(false)
        const handleDisplay= ()=>{
            setDisplay(true)
        }
        const [backdrop, setBackdrop] = React.useState('static');
        const handleClose = () => setOpen(false);
       ;
        const [changement, setChangement]=useState(false)
        const [livraison, setLivraison]=useState(true)
        const handleChangement =() =>{
            setChangement(true)
            setLivraison(false)
        }
        const [open, setOpen] = React.useState(false);
        const handleOpen = () =>{
            setOpen(true)
        } 
        const [imagePreview, setImagePreview] = useState(null);

        const handleImageChange = (e) => {
          const file = e.target.files[0];
      
          if (file) {
            const reader = new FileReader();
      
            reader.onloadend = () => {
              setImagePreview(reader.result);
            };
      
            reader.readAsDataURL(file);
          } else {
            setImagePreview(null);
          }
        };
        return (
            <div className="card" style={{padding:'20px'}}>
                <Card  style={{border:'1px solid #48a93c',padding:'30px'}} > 
                        <h5>html</h5>

                    <p className="m-4">
                        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Inventore sed consequuntur error repudiandae 
                        numquam deserunt quisquam repellat libero asperiores earum nam nobis, culpa ratione quam perferendis esse, cupiditate neque quas!
                    </p>
                </Card>

            <div className='text-end mt-2 gap-2 d-flex justify-content-end '>
            <Modal backdrop={backdrop} keyboard={false} open={open} onClose={handleClose}>
        <Modal.Header>
          <Modal.Title>Enoyer mon travail</Modal.Title>
        </Modal.Header>

        <Modal.Body>
        <div class="mb-3">
  <label for="exampleFormControlTextarea1" class="form-label"></label>
  <textarea  placeholder="description" class="form-control" id="exampleFormControlTextarea1" rows="3"></textarea>
    </div>
    <div>
  <label for="formFileLg" class="form-label">Large file input example</label>
  <input class="form-control "onChange={handleImageChange} accept="image/*" id="formFileLg" type="file"/>
    </div>
    {imagePreview && <img src={imagePreview} alt="Image Preview" style={{ maxWidth: '100%', maxHeight: '100px', marginTop: '10px' }} />} 
       
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={handleClose} appearance="primary">
            Ok
          </Button>
          <Button onClick={handleClose} appearance="subtle">
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
            <button  className={` btn ${livraison ?'d-none': 'd-block'}`}  onClick={handleOpen} style={{backgroundColor:'#48a93c'}}>Livrer</button>
                <button  className={` btn ${changement ?'d-none': 'd-block'}`} disabled={display} onClick={handleDisplay} style={{backgroundColor:'#48a93c'}}>demarer</button>
                 <button disabled={!livraison} onClick={handleChangement} className={` btn ${display ?'d-block': 'd-none'}`} style={{backgroundColor:'#3084b5'}}>Terminer</button>
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
