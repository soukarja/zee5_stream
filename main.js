function search(){
    var searchText = document.querySelector('#searchbox').value.trim();
    if (searchText == ""){
        resetContent();
    }
    else if (searchText.startsWith('https://www.zee5.com/') || searchText.startsWith('http://www.zee5.com/')){
        resetContent();
        var newLink = "https://old-dawn-04ee.soukarja.workers.dev/?url="+searchText;
        // var newLink = "https://old-dawn-04ee.soukarja.workers.dev/?url=";
        createContainer(title="Zee5 Show", 
                        genre="unknown",
                        actors="N/A",
                        link=newLink,
                        picture="https://www.zee5.com/images/ZEE5_logo.svg?ver=2.50.19",
                        showType="Watch Now",
                        cost="Free");

    }
    else{
        resetContent();
    // document.querySelector('#contentBox').innerHTML = searchText;
    // createContainer();
    var request = new XMLHttpRequest();
    searchText = searchText.replace(' ', '%20');
// Open a new connection, using the GET request on the URL endpoint
request.open('GET', 'https://gwapi.zee5.com/content/getContent/search?q='+searchText+'&start=0&limit=24&asset_type=0,6,1,9,9,101&country=IN&languages=bn,en,hi&translation=en&version=5&page=1', true);

request.onload = function () {
    var data = JSON.parse(this.response);
    console.log(data["all"].length);
    if (data["all"].length <= 0){
        resetContent();
        document.querySelector('#contentBox').innerHTML = "No Search Results Found on Zee5";
        return;
    }
    var genreTxt = "";
    data["all"].forEach((movie) => {
      // Log each movie's title
      
    //   try{
    //   movie.genre.forEach((item, index)=>{
    //     if (genreTxt != ""){
    //         genreTxt = genreTxt + ", ";
    //     }
    //     genreTxt = genreTxt + String(item);
    //   });
    // }
    
    // catch(err){
    //     genreTxt = movie.genre;
    // }
    for (var i=0; i<movie.genre.length; i++){
        if (genreTxt.includes(movie.genre[i].id)){
            continue;
        }
        if (genreTxt != ""){
                    genreTxt = genreTxt + ", ";
                }
                genreTxt = genreTxt + String(movie.genre[i].id);
    }
    // console.log(movie);
    // console.log(movie.genre[0].id);
      var actorsTxt = "";

    //   for (var i=0; i<movie.actors.length; i++){
    //     if (actorsTxt.includes(movie.actors[i].id)){
    //         continue;
    //     }
    //     if (actorsTxt!= ""){
    //                 actorsTxt =actorsTxt + ", ";
    //             }
    //             actorsTxt= actorsTxt + String(movie.actors[i].id);
    // }

    //   try{
    //   movie.actors.forEach((item)=>{
    //     if (actorsTxt != ""){
    //         actorsTxt = actorsTxt + ", ";
    //     }
    //     actorsTxt = actorsTxt + item;
    //   });}
    //   catch(err){
    //       actorsTxt = movie.actors;
    //   }

    //   console.log(movie.title);
    createContainer(title=movie.title, 
                        genre=genreTxt,
                        actors=actorsTxt,
                        link="https://old-dawn-04ee.soukarja.workers.dev/"+movie.id,
                        picture=movie.image_url,
                        showType=movie.asset_subtype,
                        cost=movie.business_type.replace('_downloadable', ''));
    
    })
}

// Send request
request.send();
    }
}


function createContainer(title, genre, actors, link, picture, showType, cost){
    var box = document.createElement("div");
    box.className = "showBox";
    box.innerHTML = `<img src="`+picture+`" alt="`+title+`">
    <div class="content">
        <div class="heading">
            <h3>`+title+`</h3>
        <span class="showType">`+showType+`</span>
    <span class="showPrice">`+cost+`</span></div>

    <p>Genre: <span class="genre">`+genre+`</span></p>
    <!--<p>Actors: <span class="actors">`+actors+`</span></p>-->
    <br>

    <a href="`+link+`" class="streamBtn">Stream Now</a>
    </div>`;
    var parent = document.querySelector('#contentBox');
    var hrTag = document.createElement("hr")
    parent.appendChild(hrTag);
    parent.appendChild(box);
}


function resetContent(){
    document.querySelector('#contentBox').innerHTML = "";
}