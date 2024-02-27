import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, set, push, onValue, remove } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

// VARIABLES
const appSettings = {
    databaseURL: "https://realtime-database-3d44f-default-rtdb.firebaseio.com/"
}

const newDBNameForm = document.getElementById("new-database-form")
const newDBNameEl = document.getElementById("new-database")
const addBtn = document.getElementById("add-btn")

const dbSelection = document.getElementById("db-selection")

const app = initializeApp(appSettings)
const database = getDatabase(app)

// FIREBASE
onValue(ref(database), function(snapshot){
    const dbs = Object.entries(snapshot.val())

    clearList()

    for(let i = 0; i < dbs.length; i++){
        const dbName = dbs[i][0]
        const dbContainer = document.createElement("li")
        const dbEl = document.createElement("div")
        const dbDel = document.createElement("button")

        dbContainer.classList.add('database-container')
        dbEl.classList.add("database-item")
        dbEl.classList.add("padding")
        dbEl.classList.add("borderRadius")
        dbDel.classList.add("delete-btn")

        dbEl.innerHTML = `<a href="./pages/database.html">${dbName}</a>`
        dbDel.innerText = `🗑️`

        // EVENT LISTENER FOR DELETING
        dbDel.addEventListener("dblclick", function(){
            remove(ref(database,`${dbName}`))
        })

        // EVENT LISTENER FOR STORING DB NAME
        dbEl.addEventListener("click", function(){
            localStorage.setItem("database",`${dbName}`)
        })

        dbContainer.appendChild(dbEl)
        dbContainer.appendChild(dbDel)

        dbSelection.appendChild(dbContainer)
    }
})


// EVENT LISTENERS
newDBNameForm.addEventListener("submit", function(e){
    e.preventDefault()
    newDatabase()
})

addBtn.addEventListener("click", function(){
    newDatabase()
})

// FUNCTIONS
function clearList(){
    dbSelection.innerHTML = ""
}

function newDatabase(){
    if(newDBNameEl.value){
        let newDBName = newDBNameEl.value
    
        // Add naming convention
        // newDBName = newDBName.split(" ").map(e => e.toLowerCase()).join("-")
    
        clearList()
    
        // Push new root to firebase
        push(ref(database, newDBName), "-Placeholder-")
    
        newDBNameEl.value = ""
    }
}

// create login and users through firebase + create new account