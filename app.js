//Arguments passed in to a node command are part of the process.argv array
//The 0 index in the array is where your Node installation is stored
//The 1 index in the array is where the file you ran Node on is stored
//The 2 index in the array is the first argument you pass to the Node command after the file name
//See documentation here - https://nodejs.org/docs/latest/api/process.html#process_process_argv
const fetch = require('node-fetch');
var type = process.argv[2]
var fs = require('fs');
const { resolve } = require('path');

/*
function gettypes accepts 'pokemon' that is a json obj of a single pokemon
returns the moves of the pokemon if they are the same type as the arg passed
*/
function movesFromType(pokemon){ 
    let types = pokemon.types ;
    let typearray = types.map (x => x.type.name) 
    if (typearray.includes(type)){
        return getmoves (pokemon);
    }
    else{
        return null;
    }
}

/*
function gettypes accepts 'pokemon' that is a json obj of a single pokemon
returns a string moves of the pokemon if they are the 
*/
function getmoves(pokemon){
    let moves = pokemon.moves;
    let movesarray =  moves.map( x => x.move.name);
    if (movesarray.length === 0 ){
        return ""
    }
    else{
        return movesarray.join(", ")
    }
}

function fetchTypes(){ //returns a promise that resolves to a list of types
    return fetch('https://pokeapi.co/api/v2/type/')
    .then(res => res.json())
    .then (data => {return data.results})
    .then (validtypes => {return validtypes.map( x => x.name)})
}

function writePokemonToFile (){
    return fetch('https://pokeapi.co/api/v2/pokemon/?limit=100')
    .then(res => res.json())
    .then(data => {return data.results})
    .then(async obj => {
        await Promise.all(obj.map(x => {                        
            return fetch(x.url)                          
                .then(response => {return response.json()})       
                .then(data =>  {           
                    let moves = movesFromType(data)      
                    if (moves !== null){
                        console.log(x.name + '\n' + moves + '\n')
                        if ( moves === ""){
                            return x.name + '\n' + 'no moves found for this pokemon' + '\n'
                        }
                        else{
                            return x.name + '\n' + moves + '\n'
                        }
                    }
                })
        }))
        .then (strArr => {
            fs.writeFile('output.txt', strArr.join(""), (err) =>{  //have the join not have too many commas
            if (err){
                console.log('error writing file')
            }
            else{
                console.log('file written successfully')
            }
        })}) 
    })
}

async function checkValidType(){
    let types = await fetchTypes(); //wait for our types array to resolve

    return new Promise((resolve, reject) => {
        if(types.includes(type)){
            console.log('success')
            resolve("success")
        }
        else{
            console.log('failed')
            reject("No matching type found for ")
        }
    })
}

//Main part of code
checkValidType()
.then(result => writePokemonToFile()) 
.catch(message => fs.writeFile('output.txt', message + type, (err) =>{ 
    if (err){
        console.log('error writing file')
    }
    else{
        console.log('file written successfully')
    }
}))










