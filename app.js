const express = require('express')
const memory=require('./memoryManager')
const turf=require('@turf/turf')
const bodyParser = require('body-parser')
const GJV=require('geojson-validation')


//----------------------------Server Initialization------------------------------//
const app = express()
const getErrMsg='Invalid Request : Please pass the lat and long in the URL. ex:/gis/testpoint/35.322456/50.23445';
const putErrMsg={
  bodyMissing:'Bad Request : Body is missing!',
  wrongFormat:'Bad Request : Wrong format - No polygon has been added',
  internal:'Internal Error'
};


// parse application/json to fix the put requests
app.use(bodyParser.json())


//Load the initial file
const initialization=(req,res,next)=>{
  memory.init()
  next()
}

app.use(initialization);


//-------------------Request Handling-------------------//
//GET Request Handling
app.get('/gis/testpoint/:lat/:long', function (req, res) {
    var point=turf.point([req.params.long,req.params.lat])
    var result=memory.search(point)
    res.header("Content-Type",'application/json');
    res.send(JSON.stringify(result)) 
})

//Error Handling In GET Request
app.get('/gis/testpoint/',function(req,res){
  res.header("Content-Type",'application/json');
  res.send(errGen(400,getErrMsg))
})

app.get('/gis/testpoint/:prop',function(req,res){
  res.header("Content-Type",'application/json');
  res.send(errGen(400,getErrMsg))
})

//PUT Request Handling
app.put('/gis/addpolygon', function(req,res){
  res.header("Content-Type",'application/json');
  if(req.body==undefined){
    res.send(errGen(400,putErrMsg.bodyMissing))
  }else if(!GJV.valid(req.body)){
    res.send(errGen(400,putErrMsg.wrongFormat))
  }else{
    var err=memory.add(req.body)
    if(err==='500')
      res.send(errGen(500,putErrMsg.internal))
    else
      res.send({
        "code" : 200,
        "result" :memory.print()
      })
  }

})
 
let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}
app.listen(port);
console.log('App Is Ready...')


//-------------------Tools---------------------//
const errGen=(errcode,errmsg)=>{
  return JSON.stringify({
    code:errcode,
    msg:errmsg
  })
}


