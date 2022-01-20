//Initilized global variables
let likedImg;
let feed = document.getElementById('feed');
let saved = document.getElementById('saved');
let mainDisplay = document.getElementById('main-display')


//Fetch NASA Photo data
function getData() { 
    fetch(`https://api.nasa.gov/planetary/apod?start_date=2022-01-01&api_key=fcUavzuvEbCML0WWty4NyG3jYDjCR0g54DmIOtEH`)
    .then((res) => {
      return(res.json())
    })
    .then((data) => {
        render(data)
    })
}

//Render function will create cards for items in array passed to it
function render(data) {
        
        feed.textContent = '' //Clears  display  when switching between feed types

        //Create card for each photo
        data.forEach((photo) => {
        const div = document.createElement('div');
        div.classList.add('card')
        div.id = 'image-card';
        
        //Adding bootstrap cardbody div for display formatting
        const cardBody = document.createElement('div')
        cardBody.classList.add('card-body')

        //Create photo title
        const title = document.createElement('h3')
        title.id = 'img-title'
        title.classList.add('card-title')
        title.textContent = photo.title

        //Create photo date
        const p = document.createElement('p')
        p.id ='img-date'
        p.classList.add('card-text')
        p.textContent = photo.date
        //Add image to card
        let img = document.createElement('img')
        img.classList.add('card-img-top')
        let text = photo.url;
        //Some image urls from api are youtube links - adding logic to display link rather than blank card
        if(text.includes("youtube")){
            const link = document.createElement('a')
            link.href = text
            link.textContent = 'Click here to watch video'
            cardBody.appendChild(link)
        } else {
            img.src=text
        }

        //Photo like button
        const likeButton = document.createElement('button')
        //Check local storage if this photo is liked -- if yes then mark as liked when created
        if (likedImg.includes(photo.date)) {
            likeButton.classList.add('like-btn-clicked')
        }
        likeButton.classList.add('like-btn')
        likeButton.innerHTML = 'Like'

        //Like button click event calls like function to change style and add/remove from local storage
        likeButton.addEventListener('click', () => like(likeButton, photo.date)) 
        
        //Appending child elements to create complete card and add to DOM
        feed.appendChild(div)
        cardBody.appendChild(title)
        cardBody.appendChild(p)
        cardBody.appendChild(likeButton)
        div.appendChild(img)            
        div.appendChild(cardBody)
    })
}


//Check Local storage if user has liked any images, initialize empty array if local storage is empty
function checkLocal() {
    if (localStorage.getItem('likedImg') === null){
        return likedImg = []
    } else {
        likedImg = JSON.parse(localStorage.getItem('likedImg'))
    }
}

//Like button click handler, toggles classlist and calls add/remove local storage functions
function like(likeButton, id) {
    likeButton.classList.toggle('like-btn-clicked');

    likeButton.classList.contains('like-btn-clicked') ? (
        addToStorage(id)
    ): (
        removeFromStorage(id)
    )
}

//When a photo is liked, the id is added to local storage so liked images will be saved on refresh
function addToStorage(id){
    likedImg.push(id)
    localStorage.setItem('likedImg', JSON.stringify(likedImg))
    console.log(localStorage)
}

//Removing an id from local storage
function removeFromStorage(id){
    likedImg.splice(likedImg.indexOf(id),1)
    localStorage.setItem('likedImg', JSON.stringify(likedImg))
    console.log(localStorage)
}

//Show feed of only liked images
function savedFeed() {
    fetch(`https://api.nasa.gov/planetary/apod?start_date=2022-01-01&api_key=fcUavzuvEbCML0WWty4NyG3jYDjCR0g54DmIOtEH`)
    .then((res) => {
      return(res.json())
    })
    .then((data) => {
        const savedData = (data.filter(photo => likedImg.includes(photo.date)))
        render(savedData)
    })
}

saved.addEventListener('click', () => {
    mainDisplay.classList.toggle('active')
    saved.classList.toggle('active')
    savedFeed()
})
mainDisplay.addEventListener('click', () => {
    saved.classList.toggle('active')
    mainDisplay.classList.toggle('active')
    getData()
})


checkLocal();
getData();