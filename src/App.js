import { useState,useEffect } from 'react';
import { ImageList, ImageListItem, Container, Paper, Zoom, Button } from '@material-ui/core';
import './imageList.css';

function App() {

  // React Hooks
  let [imgList, setImgList] = useState([]); // define and set state to render first 30 images
  let [bottomScrolled, setBottomScrolled] = useState(false); // define and set state to check if the image list is scrolled to bottom
  let [displayImg, setDisplayImg] = useState(''); // define and set state to display image when image is clicked
  let [uploadedImgId, setUploadedImgId] = useState(0); // define and set state to apply unique id to uploaded image(bonus point)

  // calling API on page load. useEffect with [] works similar as componentDidMount()
  useEffect(() => {
    fetch("https://picsum.photos/v2/list")
      .then(res => res.json())
      .then(
        (result) => {
          setImgList(result);
        },
        (error) => {
          console.log('apiError', error);
        }
      )
  },[]);

  // original image src from API conatins high defination images and increase the load time of the page
  // so creating function to retrieve correct image for page to load faster.
  function getCorrectSizeImg(size,src){
    src = src.split('/');
    src = src.slice(0,-2).join('/');
    src = `${src}${size}`;
    return src;
  }
  
  // when user clicks on an image, It will select and display it
  function onClickGetImg(e) {
    setDisplayImg(e.target);
  }

  // set the displayImg value empty to clear the image selection
  function cleaeSelection() {
    setDisplayImg('');
  }

  // (from bonus point) when user clicks on Upload Image button, It will add the image to the list from device
  function addNewImg(e){
    setUploadedImgId(++uploadedImgId); //sets unique id to uploaded image
    let reader = new FileReader();
    let file  = e.target.files[0];
    file && reader.readAsDataURL(file);
    reader.onloadend = () => {
      const addNewArray = {"id": `uploaded${uploadedImgId}` , "img_upload_url" : reader.result}
      setImgList(imgList => imgList.concat(addNewArray));
    }
  }

  // (from bonus point) when user scrolls down, It will add 30 more iamges
  function handelOnCroll(e){
    const bottom = e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight;
    if (bottom && !bottomScrolled) {
      fetch("https://picsum.photos/v2/list?page=2&limit=30")
        .then(res => res.json())
        .then(
          (result) => {
            setImgList(imgList => imgList.concat(result));
          },
        (error) => {
          console.log('apiError', error);
        }
      )
      setBottomScrolled(true)
    }
  } 
  return (
    <Container>
      <h1>Image list</h1>
      {!displayImg && <div className="uploadBtnWrapper">
        <input
          accept="image/*"
          id="contained-button-file"
          multiple
          type="file"
          onChange={(e) => addNewImg(e)}        
        />
        <label htmlFor="contained-button-file">
          <Button variant="contained" color="primary" component="span">
            Upload Image 
          </Button>
        </label>
      </div>}
      <ImageList 
        tabIndex="0" 
        className={`imageList ${displayImg ? 'imgListOpacity' : ''}`} 
        rowHeight={200} cols={4} 
        onScroll={(e) => handelOnCroll(e)}>
        {imgList.map((item) => (
          <ImageListItem key={item.id}>
            <img src={(item.img_upload_url) || getCorrectSizeImg(`/300/200`, item.download_url)} alt={item.author} onClick={(e) => onClickGetImg(e)} />
          </ImageListItem>
        ))}
      </ImageList>
      { /* only display the component when img is clicked */}
      {displayImg && <Zoom in={true}>
        <Paper elevation={4} className="imgDetailsWrapper">
          <Button variant="contained" color="primary" onClick={() => cleaeSelection()}>Clear</Button>
          <img className="fullImg" src={getCorrectSizeImg(`/800/500`,displayImg.src)} alt={displayImg.alt} />
        </Paper>
      </Zoom>}
    </Container>
  );
}

export default App;
