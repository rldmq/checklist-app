import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

const appSettings = {
    databaseURL: "https://realtime-database-3d44f-default-rtdb.firebaseio.com/"
}

const databaseName = localStorage.getItem("database")
const backBtn = document.getElementById("back-btn")

backBtn.addEventListener("click", function(){
    localStorage.clear()
})

const headTitle = document.getElementById("title")
const listName = document.getElementById("list-name")

const newListEntryInput = document.getElementById("new-list-entry")
const addBtn = document.getElementById("add-btn")
const listItems = document.getElementById("checklist")

const app = initializeApp(appSettings)
const database = getDatabase(app)
const databaseRef = ref(database, databaseName)

headTitle.innerHTML = databaseName
listName.innerHTML = databaseName

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
            
            listEl.addEventListener("dblclick", function(){
                remove(ref(database,`${databaseName}/${id}`))
                if(!listItems.innerHTML){
                    listItems.innerText = "No items yet!"
                }
            })
            
            listItems.appendChild(listEl)
        }
    }
})

addBtn.addEventListener("click", function(){
    let value = newListEntryInput.value
    push(databaseRef, value)
    newListEntryInput.value = ""
})

function clearList(){
    listItems.innerHTML = ""
}