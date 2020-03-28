const fileManager=require('./fileManager')
const turf=require('@turf/turf')

var memory;

const initialMemory=()=>{
    var memoryInitial=fileManager.initial();
    return memoryInitial;
}

const getMemory=()=>{
    if(!memory){
        memory=initialMemory();
    }
    return memory;
}

const addToMemory=(polygon)=>{
    memory.features.push(polygon);
    try{
        fileManager.write(memory,"./memory.json");
    }catch(err){
        console.log(err)
        return '500'
    }
}

const searchInMemory=(point)=>{
    var result=[];
    console.log(memory)
    memory.features.forEach(polygon => {
        if(turf.booleanPointInPolygon(point,polygon.geometry))
        {
            result.push(polygon)
        }
    });

    return turf.featureCollection(result);
}

const print=()=>{
    var str="";
    memory.features.forEach(polygon=>{
        str+=polygon.properties.name + '\t'
    })
    return str;
}

module.exports={
    init:getMemory,
    add:addToMemory,
    search:searchInMemory,
    print:print
}