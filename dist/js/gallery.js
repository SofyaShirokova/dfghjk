const allImages = ["img1.jpg","img2.jpeg","img3.png","img4.jpeg","img5.jpg","img6.jpg"];


createGallery = () => {
    let row = 2;
    let column = 3;

    let images = document.getElementsByName('imageRow');
    for (let i = 0; i < row; i++) {
        for (let j = 0; j < column; j++) {
            images[i].innerHTML += `
            <div class="imagesFlexItem">
                <a href = ${"img/" + allImages[column * i + j]}
                   data-fancybox = "gallery">
                   <img src=${"img/" + allImages[column * i + j]} />
                </a>
            </div>`;
        }
    };
};