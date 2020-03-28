const express = require('express')
const memory=require('./memoryManager')
const turf=require('@turf/turf')
var bodyParser = require('body-parser')

const app = express()

// parse application/json
app.use(bodyParser.json())

const initialization=(req,res,next)=>{
  memory.init()
  next()
}

app.use(initialization);

app.get('/gis/testpoint/:lat/:long', function (req, res) {
  var point=turf.point([req.params.long,req.params.lat])
  var result=memory.search(point)
  res.send(result)
})

app.put('/gis/addpolygon', function(req,res){
  var err=memory.add(req.body)
  if(err==='500')
    res.send('500')
  else
    res.send(memory.print()+ "\n 200 OK")

})
 
let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}
app.listen(port);
console.log('App Is Ready...')