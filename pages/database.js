import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"


// VARIABLES
const appSettings = {
    databaseURL: "https://realtime-database-3d44f-default-rtdb.firebaseio.com/"
}

const databaseName = localStorage.getItem("database")
const backBtn = document.getElementById("back-btn")

const headTitle = document.getElementById("title")
const tenorGIF = document.getElementById("tenor-gif")
const listName = document.getElementById("list-name")

const newListEntryForm = document.getElementById("new-list-entry-form")
const newListEntryInput = document.getElementById("new-list-entry")
const addBtn = document.getElementById("add-btn")
const listItems = document.getElementById("checklist")

const app = initializeApp(appSettings)
const database = getDatabase(app)
const databaseRef = ref(database, databaseName)

headTitle.innerHTML = databaseName
listName.innerHTML = databaseName

// FIREBASE
onValue(databaseRef, function(snapshot){
    const databaseItems = Object.entries(snapshot.val())

    clearList()

    for(let i = 0; i < databaseItems.length; i++){
        const currentItem = databaseItems[i]
        const id = currentItem[0]
        const name = currentItem[1]
        if(name !== "-Placeholder-"){

            const listEl = document.createElement("li")
            
            listEl.innerText = `${name}`
            
            listEl.classList.add("list-item")
            listEl.classList.add("padding")
            listEl.classList.add("borderRadius")
            
            listEl.addEventListener("dblclick", function(){
                remove(ref(database,`${databaseName}/${id}`))
                // 
            })
            
            listItems.appendChild(listEl)
        }
    }
    if(!listItems.innerHTML){
        listItems.innerHTML = `<h1 class="empty-list">No items yet!</h1>`
    }
})

// EVENT LISTENERS
backBtn.addEventListener("click", function(){
    localStorage.clear()
})

newListEntryForm.addEventListener("submit", function(e){
    e.preventDefault()
    newItem()
})

addBtn.addEventListener("click", function(){
    newItem()
})

// FUNCTIONS
function newItem(){
    if(newListEntryInput.value){
        let value = newListEntryInput.value
        push(databaseRef, value)
        newListEntryInput.value = ""
    }
}

function clearList(){
    listItems.innerHTML = ""
}

// TENOR API
grab_data()

// TENOR API NOTES
// url Async requesting function
function httpGetAsync(theUrl, callback)
{
    // create the request object
    var xmlHttp = new XMLHttpRequest();

    // set the state change callback to capture when the response comes in
    xmlHttp.onreadystatechange = function()
    {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
        {
            callback(xmlHttp.responseText);
        }
    }

    // open as a GET call, pass in the url and set async = True
    xmlHttp.open("GET", theUrl, true);

    // call send with no params as they were passed in on the url string
    xmlHttp.send(null);

    return;
}

// callback for the top 8 GIFs of search
function tenorCallback_search(responsetext)
{
    // parse the json response
    var response_objects = JSON.parse(responsetext);

    const gifs = response_objects["results"];

    console.log(gifs)

    // load the GIFs -- for our example we will load the first GIFs preview size (nanogif) and share size (tinygif)

    document.getElementById("tenor-gif").src = gifs[Math.floor(Math.random()*gifs.length)]["media"][0]["gif"]["url"];

    // document.getElementById("share_gif").src = gifs[0]["media"][0]["tinygif"]["url"];

    return;

}


// function to call the search endpoint
function grab_data()
{
    // set the apikey and limit
    var apikey = "LIVDSRZULELA";
    var lmt = 8;
    var mediaFilter = "minimal";
    var arRange = "standard";

    // using default locale of en_US
    var search_url = "https://g.tenor.com/v1/search?q=" + databaseName+ "&key=" +
            apikey + "&limit=" + lmt + "&media_filter=" + mediaFilter + "&ar_range=" + arRange + "&contentfilter=high&locale=en_US";

    httpGetAsync(search_url,tenorCallback_search);

    // data will be loaded by each call's callback
    return;
}