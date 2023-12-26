// import { Carousel } from "rsuite";
import { Carousel } from 'rsuite';
import image from "../../assets/images/image1.png";
import image2 from "../../assets/images/image2.png";


function CarouselCard() {
  return (
    <Carousel autoplay className="carouselImg">
      <img src={image} alt='img'/>
      <img src={image2} alt='img' />
    </Carousel>
  );
}

export default CarouselCard;