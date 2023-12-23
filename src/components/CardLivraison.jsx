import React, { useState, useEffect } from 'react';
import userProfile from '../assets/images/userProfile.png';
// import livraison from '../assets/images/livraison.jpg';
import envoi from '../assets/images/envoi.png';
import commenter from '../assets/images/commenter.png';

import img1 from '../assets/images/img (1).jpg';
import img2 from '../assets/images/img (2).jpg';
import img3 from '../assets/images/img (3).jpg';
import img4 from '../assets/images/img (4).jpg';
import img5 from '../assets/images/img (5).jpg';

import { Galleria } from "primereact/galleria";
// import { PhotoService } from "./service/PhotoService";


// import { Button } from "primereact/button";
import { Dialog } from 'primereact/dialog';

export default function CardLivraison() {
  // eslint-disable-next-line
  const [apprenant, setApprenat] = useState('Cheikh Ahmed Tidiane Gueye');
  // eslint-disable-next-line
  const [coach, setCoach] = useState('Kalika Ba');
  // eslint-disable-next-line
  const [date, setDate] = useState('19 Dec 2023, 16:05');
  // eslint-disable-next-line
  const [days, setDays] = useState('1');
  // eslint-disable-next-line
  const [comment, setComment] = useState('Good job (:-)');
  // eslint-disable-next-line
  const [role, setRole] = useState('Coach');
  const [visible, setVisible] = useState(false);

  const [images, setImages] = useState(null);
  // const responsiveOptions = [
  //   {
  //     breakpoint: "991px",
  //     numVisible: 4,
  //   },
  //   {
  //     breakpoint: "767px",
  //     numVisible: 3,
  //   },
  //   {
  //     breakpoint: "575px",
  //     numVisible: 1,
  //   },
  // ];

  useEffect(() => {
    PhotoService.getImages().then((data) => setImages(data));
  }, []);

  const itemTemplate = (item) => {
    return (
      <img
        src={item.itemImageSrc}
        alt={item.alt}
        style={{ width: "100%", height: "100%" }}
      />
    );
  };

  const thumbnailTemplate = (item) => {
    return (
      <img
        src={item.thumbnailImageSrc}
        alt={item.alt}
        style={{ width:'140px', height: "100px" }}
      />
    );
  };

  const PhotoService = {
    getData() {
      return [
        {
          itemImageSrc: img1,
          thumbnailImageSrc: img1,
          alt: "Description for Image 1",
          title: "Title 1",
        },
        {
          itemImageSrc: img2,
          thumbnailImageSrc: img2,
          alt: "Description for Image 2",
          title: "Title 2",
        },
        {
          itemImageSrc: img3,
          thumbnailImageSrc: img3,
          alt: "Description for Image 3",
          title: "Title 3",
        },
        {
          itemImageSrc: img4,
          thumbnailImageSrc: img4,
          alt: "Description for Image 4",
          title: "Title 4",
        },
        {
          itemImageSrc: img5,
          thumbnailImageSrc: img5,
          alt: "Description for Image 5",
          title: "Title 5",
        },
      ];
    },

    getImages() {
      return Promise.resolve(this.getData());
    },
  };

  function handleSend() {
    console.log("Cliqué sur l'image send");
    alert('message envoyé');
  }


  return (
    <div className="">
      <div className="container containerApprenant w-75 h-0 my-5">
        <div className="row rowAppenant ">
          <div className="col-md-12 d-flex colApprenant my-3">
            <img src={userProfile} alt="" className="icon" />
            <div className="mySpan">
              <h6 className=" px-3 pt-2 mainColor">{apprenant}</h6>
              <p className="m-0 px-3 pt-2 mainColor">{date}</p>
            </div>
          </div>

          <div className="col-12 my-2 ">
            {/* <img src={livraison} alt="" className="publication rounded-2" /> */}
              <Galleria
                value={images}
                numVisible={5}
                style={{ maxWidth: "" }}
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
              style={{ width: "50vw" }}
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
                style={{ width: "30px", height: "30px" }}
              />
              <p className="px-2 m-0 sizeHover" style={{ fontSize: "12px" }}>
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
                  style={{ width: "30px", height: "30px" }}
                />
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
