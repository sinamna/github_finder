const actionResult = document.querySelector('.action_result');
const info_card=document.querySelector('.info_card')
const info_list=document.getElementById('info_list')


// show error in notice block
function showAlert(title) {
    actionResult.style.display = "block";
    const info_list=document.getElementById('notice')

    info_list.textContent = title;
    setTimeout(() => { // removes the error message from screen after 10 seconds.
        actionResult.style.display = "none";
    }, 10000);
}

//called after each button click in order to remove previous data from github info block
function clear_last(){
    info_card.style.display="none";

    document.getElementById('github_picture').src = ""
    document.getElementById('github_picture').style.display="none";

    info_list_div = document.getElementById('info_list')
    while(info_list_div.firstChild){
        info_list_div.removeChild(info_list_div.lastChild)
    }
}

// function that gets called after search button gets pressed. search cache/github for info.
async function getInfo(e){
    github_id = document.getElementById('github_id').value;
    console.log(github_id)
    e.preventDefault();
    clear_last()
    let cachedObject = window.localStorage.getItem(github_id)//check if search with this github_id exists in cache
    if (cachedObject != null) { // return from cache
        console.log('found in cache'+cachedObject)
        showAlert("served from cache!")
        displayInfo(JSON.parse(cachedObject))
    }else{
        try {
            let git_link = `https://api.github.com/users/${github_id}`
            let response = await fetch(git_link);
            let obj = await response.json();

            if (response.status == 404) {
                showAlert('could not find user with specified username');
                return Promise.reject(`Request failed with error ${response.status}`);
            }
            if (response.status != 200) {
                showAlert(`request failed with error ${response.status}`);
                return Promise.reject(`Request failed with error ${response.status}`);
            }
            //displaying info to user by populating info_card
            displayInfo(obj)
            window.localStorage.setItem(github_id,JSON.stringify(obj)) 
        } catch (e) {
            console.log(e);
            showAlert(e)
        }

    }
}
// display info in github info block
function displayInfo(infoObject){
    console.log('downloaded obj'+JSON.stringify(infoObject))
    let img_link = infoObject.avatar_url;
    document.getElementById('github_picture').src = img_link
    document.getElementById('github_picture').style.display="block";

    info_list_div = document.getElementById('info_list')
    let ul = document.createElement('ul');
    info_list_div.appendChild(ul);
    var info_arr = ['bio','name','loc','blog']

    info_arr.forEach(function(item){
        if (infoObject[item]){
            let info = `${item}: ${infoObject[item]}`
        
            li = document.createElement('li'); // create a new list item
            li.appendChild(document.createTextNode(info)); // append the text to the li
            ul.appendChild(li); // append the list item to the ul
        }
    });

    info_card.style.display="block";
}


search_button = document.querySelector('.search');
search_button.addEventListener('click', getInfo) // register function to button