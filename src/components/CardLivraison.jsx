import React, { useState, useEffect } from 'react';
import userProfile from '../assets/images/userProfile.png';
import envoi from '../assets/images/envoi.png';
import commenter from '../assets/images/commenter.png';
import img1 from '../assets/images/img (1).jpg';
import img2 from '../assets/images/img (2).jpg';
import img3 from '../assets/images/img (3).jpg';
import img4 from '../assets/images/img (4).jpg';
import img5 from '../assets/images/img (5).jpg';
import { Galleria } from 'primereact/galleria';
import { Dialog } from 'primereact/dialog';

export default function CardLivraison() {
  // eslint-disable-next-line
  const [apprenant, setApprenat] = useState('Cheikh Ahmed Tidiane Gueye');
  const [coach, setCoach] = useState('Kalika Ba');
  const [date, setDate] = useState('19 Dec 2023, 16:05');
  const [days, setDays] = useState('1');
  const [comment, setComment] = useState('Good job (:-)');
  const [role, setRole] = useState('Coach');
  const [visible, setVisible] = useState(false);
  const [images, setImages] = useState(null);

  const PhotoService = {
    getData() {
      return [
        {
          itemImageSrc: img1,
          thumbnailImageSrc: img1,
          alt: 'Description for Image 1',
          title: 'Title 1',
        },
        {
          itemImageSrc: img2,
          thumbnailImageSrc: img2,
          alt: 'Description for Image 2',
          title: 'Title 2',
        },
        {
          itemImageSrc: img3,
          thumbnailImageSrc: img3,
          alt: 'Description for Image 3',
          title: 'Title 3',
        },
        {
          itemImageSrc: img4,
          thumbnailImageSrc: img4,
          alt: 'Description for Image 4',
          title: 'Title 4',
        },
        {
          itemImageSrc: img5,
          thumbnailImageSrc: img5,
          alt: 'Description for Image 5',
          title: 'Title 5',
        },
      ];
    },

    getImages() {
      return Promise.resolve(this.getData());
    },
  };

  const itemTemplate = (item) => {
    return (
      <img
        src={item.itemImageSrc}
        alt={item.alt}
        style={{ width: '100%', height: '100px%' }}
      />
    );
  };

  const thumbnailTemplate = (item) => {
    return (
      <img
        src={item.thumbnailImageSrc}
        alt={item.alt}
        style={{ width: '140px', height: '100px' }}
      />
    );
  };

  useEffect(() => {
    PhotoService.getImages().then((data) => setImages(data));
  }, []);

  function handleSend() {
    console.log("Cliqué sur l'image send");
    alert('message envoyé');
  }

  return (
    <div className="">
      <div className="container containerApprenant w-100 my-5">
        <div className="row rowAppenant align-items-center">
          <div className="col-md-12 d-flex colApprenant my-3">
            <img src={userProfile} alt="" className="icon" />
            <div className="mySpan">
              <h6 className=" px-3 pt-2 dark">{apprenant}</h6>
              <p className="m-0 px-3 pt-2 dark">{date}</p>
            </div>
          </div>

          <div className="col-md-12 d-flex justify-content-center py-2">
            <p>Titre de la publication de l'apprenant</p>
          </div>

          <div className="col-12 my-2 ">
            <Galleria
              value={images}
              numVisible={5}
              style={{ maxWidth: '' }}
              item={itemTemplate}
              thumbnail={thumbnailTemplate}
              className="publication rounded-2"
            />
          </div>

          <div>
            <Dialog
              className="com flex justify-content-center"
              header="Commentaires"
              visible={visible}
              maximizable
              style={{ width: '50vw' }}
              onHide={() => setVisible(false)}
            >
              <div className="row comment border rounded-2 m-0 my-2 boxshadow">
                <div className="col-12 py-1">
                  <p className=" d-flex">
                    <span className="fw-bolder">{coach}</span>
                    <span className="text-light bg-warning rounded-2 px-2 mx-3 pb-0 mainBackgrounColor">
                      {role}
                    </span>
                    <span>il y a {days} jour</span>
                  </p>
                </div>
                <div className="col-12">
                  <p>{comment}</p>
                </div>
              </div>
              <div className="row comment border rounded-2 m-0 my-2 boxshadow">
                <div className="col-12 py-1">
                  <p className=" d-flex">
                    <span className="fw-bolder">{coach}</span>
                    <span className="text-light bg-warning rounded-2 px-2 mx-3 pb-0 mainBackgrounColor">
                      {role}
                    </span>
                    <span>il y a {days} jour</span>
                  </p>
                </div>
                <div className="col-12">
                  <p>{comment}</p>
                </div>
              </div>
              <div className="row comment border rounded-2 m-0 my-2 boxshadow">
                <div className="col-12 py-1">
                  <p className=" d-flex">
                    <span className="fw-bolder">{coach}</span>
                    <span className="text-light bg-warning rounded-2 px-2 mx-3 pb-0 mainBackgrounColor">
                      {role}
                    </span>
                    <span>il y a {days} jour</span>
                  </p>
                </div>
                <div className="col-12">
                  <p>{comment}</p>
                </div>
              </div>
            </Dialog>
          </div>

          <div className="col-12 py-1">
            <div
              className="comment d-flex align-items-center"
              onClick={() => setVisible(true)}
            >
              <img
                src={commenter}
                alt=""
                className=""
                style={{ width: '30px', height: '30px' }}
              />
              <p className="px-2 m-0 sizeHover" style={{ fontSize: '12px' }}>
                Plus de commentaires
              </p>
            </div>

            <div className="form-floating my-3 rounded-2 boxshadow">
              <input
                className="form-control textarea"
                placeholder="Leave a comment here"
                id="floatingTextarea2"
                style={{}}
              ></input>
              <label htmlFor="floatingTextarea2">Ajouter un commentaire</label>
              <span className="send" onClick={handleSend}>
                <img
                  src={envoi}
                  alt="send"
                  style={{ width: '30px', height: '30px' }}
                />
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}