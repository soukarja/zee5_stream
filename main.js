async function search(){
    var searchText = document.querySelector('#searchbox').value.trim();
    if (searchText == ""){
        resetContent();
    }
    else if (searchText.startsWith('https://www.zee5.com/') || searchText.startsWith('http://www.zee5.com/')){
        resetContent();
        var videoId = searchText.split("/").pop();
        // alert(videoId);
        var mainFetch = await fetch('https://gwapi.zee5.com/content/details/'+videoId+'?translation=en&country=IN&version=2', {
            headers: {
                "x-access-token": await token(),
                'Content-Type': 'application/json'
            }
        });
        var mainFetchRes = mainFetch.json().then(function(cont){
            // console.log(cont.title);
            var genreTxt = "";
            for (var i=0; i<cont.genre.length; i++){
                if (genreTxt.includes(cont.genre[i].id)){
                    continue;
                }
                if (genreTxt != ""){
                            genreTxt = genreTxt + ", ";
                        }
                        genreTxt = genreTxt + String(cont.genre[i].id);
            }
            
            var newLink = "https://old-dawn-04ee.soukarja.workers.dev/?url="+searchText;
            resetContent();
            createContainer(title=cont.title, 
                        genre=genreTxt,
                        actors="N/A",
                        link=newLink,
                        picture=cont.image_url,
                        showType=cont.asset_subtype,
                        cost=cont.business_type.replace('_downloadable', ''));
        });
        // console.log(mainFetchRes.response);
        // console.log(videoId);
        // var newLink = "https://old-dawn-04ee.soukarja.workers.dev/?url="+searchText;
        // var newLink = "https://old-dawn-04ee.soukarja.workers.dev/?url=";
        // createContainer(title="Zee5 Show", 
        //                 genre="unknown",
        //                 actors="N/A",
        //                 link=newLink,
        //                 picture="https://www.zee5.com/images/ZEE5_logo.svg?ver=2.50.19",
        //                 showType="Watch Now",
        //                 cost="Free");

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
    var movLink = "";
    if (movie.duration > 0){
        movLink = "https://old-dawn-04ee.soukarja.workers.dev/"+movie.id;
    }
    else{
        movLink = "tvshow.html?id="+movie.id;
    }
    createContainer(title=movie.title, 
                        genre=genreTxt,
                        actors=actorsTxt,
                        link=movLink,
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


function createEpisodeContainer(title, desc, season, link, picture, showType, cost){
    var box = document.createElement("div");
    box.className = "showBox";
    box.innerHTML = `<img src="`+picture+`" alt="`+title+`">
    <div class="content">
    <span class="seasonNo">`+season+`</span>
    <br>
        <div class="heading">
            <h3>`+title+`</h3>
        <span class="showType">`+showType+`</span>
    <span class="showPrice">`+cost+`</span></div>

    
    <br>
            <span class="desc">`+desc+`</span>
            <br>
            <br>
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

async function token() {
    var tokenfetch = await fetch('https://useraction.zee5.com/token/platform_tokens.php?platform_name=web_app');
    var tokenfetch = await tokenfetch.json();
    return tokenfetch.token;
}


function goBack(){
    window.location.href = document.referrer;
}

function initialize(){
    var ref = document.referrer;
    if (ref.trim() != "" && ref.trim() != window.location.href.trim())
    {
        document.querySelector('#backbtn').style.display = "unset";
    }
    if (location.pathname.split('/').pop()=="tvshow.html")
    {
        loadTvShows();
    }
}

async function loadTvShows(){
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const showId = urlParams.get('id');
    console.log(showId);
    if (showId==null || showId.trim()==""){
                resetContent();
                document.querySelector('#contentBox').innerHTML = "Invalid Link";
                return;
    }

    var mainFetch = await fetch('https://gwapi.zee5.com/content/tvshow/'+showId+'?translation=en&country=IN&version=2', {
            headers: {
                "x-access-token": await token(),
                'Content-Type': 'application/json'
            }
        });
        var mainFetchRes = mainFetch.json().then(function(cont){
            if (cont.error_msg=="Data not found")
            {
                // window.open('../', '_self');
                resetContent();
                document.querySelector('#contentBox').innerHTML = "No Results Found";
                return;
            }
            document.querySelector('#thisShowName').innerHTML = cont.title.trim();
            
            // console.log(cont);

            var totEp = cont.seasons["0"].total_episodes;
            if (totEp <= 0){
                resetContent();
                document.querySelector('#contentBox').innerHTML = "No Episodes Found";
                return;
            }
            var showEpisodes = cont.seasons["0"].episodes;
            resetContent();
            for(var xy=0; xy<totEp; xy++){
                createEpisodeContainer(title=showEpisodes[xy].title, 
                    desc=showEpisodes[xy].description,
                    season=showEpisodes[xy].season.title+" : Episode "+showEpisodes[xy].orderid,
                    link="https://old-dawn-04ee.soukarja.workers.dev/"+showEpisodes[xy].id,
                    picture=showEpisodes[xy].image_url,
                    showType=showEpisodes[xy].asset_subtype,
                    cost=showEpisodes[xy].business_type.replace('_downloadable', ''));
            }
        });


}

window.onload = initialize;