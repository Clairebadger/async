//Arguments passed in to a node command are part of the process.argv array
//The 0 index in the array is where your Node installation is stored
//The 1 index in the array is where the file you ran Node on is stored
//The 2 index in the array is the first argument you pass to the Node command after the file name
//See documentation here - https://nodejs.org/docs/latest/api/process.html#process_process_argv
const fetch = require('node-fetch');
console.log(process.argv[2])
var type = process.argv[2]

let pokemon; 
let count;


function f (object){
    count = object.count
    let pokemonarr = []
    for (let i = 1; i < count; i++){
        let url = 'https://pokeapi.co/api/v2/pokemon/' + i + '/';
        pokemonarr.push(url);
    }
    return pokemonarr;
}

function gettypes(pokemon){ //make a function here to get the types of the pokemon based on theirurl 
    let types = pokemon.types
    let typearray = types.map (x => x.name)
    if (typearray.includes(type)){
        return 
    }
    else{
        return null;
    }
}

pokemon = fetch('https://pokeapi.co/api/v2/pokemon')
.then(res => res.json())
.then(data => data.results)// f func here 
.then(async obj => {
    await Promise.all(obj.map(x =>  { //takes the array of pokemon objs with their names and urls
        return fetch(x.url)
            .then(response => response.json())
            .then(data => {
                console.log(data)
            })
    }))
    console.log("new", data)
});





