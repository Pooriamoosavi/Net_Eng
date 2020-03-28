const fs = require('fs')
const turf=require('@turf/turf')


const storeData = (data, path) => {
  try {
    fs.writeFileSync(path, JSON.stringify(data))
  } catch (err) {
    throw err
  }
}

const loadData = (path) => {
    try {
      return fs.readFileSync(path, 'utf8')
    } catch (err) {
      console.error(err)
      return false
    }
}

// const jsonToPolygons=(json)=>{
//   var multiPolygon=[];
//   json.features.forEach(element => {
//     multiPolygon.push(element.geometry.coordinates)
//   });
//   var polygons=turf.multiPolygon(multiPolygon)
//   return polygons;
// }

const fileInitialization=()=>{
  var initial=JSON.parse(loadData('./memory.json'))
  return initial;
}


module.exports={
      initial:fileInitialization,
      read:loadData,
      write:storeData
  }