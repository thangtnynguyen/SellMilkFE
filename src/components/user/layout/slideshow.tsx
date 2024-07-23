import React from 'react';
import { Carousel } from 'react-bootstrap';

const MilkCarousel: React.FC = () => {
    return (
        <Carousel>
            <Carousel.Item>
                <img
                    className="d-block w-100"
                    src="https://mir-s3-cdn-cf.behance.net/project_modules/1400/9f0cda81347675.5cfd33aacb470.png"
                    alt="First slide"
                    style={{maxHeight:'400px'}}
                />
                <Carousel.Caption>
                    {/* <h3>Slide 1</h3> */}
                    <p>This is a description for slide 1.</p>
                </Carousel.Caption>
            </Carousel.Item>
            <Carousel.Item>
                <img
                    className="d-block w-100"
                    src="https://cdn-www.vinid.net/2020/04/6402b2e3-03-04-2020_meiji_banner-web_1920x1080.jpg"
                    alt="Second slide"
                    style={{maxHeight:'400px'}}
                />
                <Carousel.Caption>
                    {/* <h3>Slide 2</h3> */}
                    <p>This is a description for slide 2.</p>
                </Carousel.Caption>
            </Carousel.Item>
            <Carousel.Item>
                <img
                    className="d-block w-100"
                    src="https://th.bing.com/th/id/R.070bfd663f8669b903c40a4bb5e5e461?rik=ko9AfsmN15Xdfg&pid=ImgRaw&r=0"
                    alt="Third slide"
                    style={{maxHeight:'400px'}}
                />
                <Carousel.Caption>
                    {/* <h3>Slide 3</h3> */}
                    <p>This is a description for slide 3.</p>
                </Carousel.Caption>
            </Carousel.Item>
        </Carousel>
    );
};

export default MilkCarousel;
