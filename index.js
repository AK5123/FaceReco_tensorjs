require('@tensorflow/tfjs-node');
const nodeFetch = require("node-fetch");
const canvas = require('canvas');
const faceapi = require('face-api.js');
const { Canvas, Image, ImageData } = canvas
faceapi.env.monkeyPatch({ Canvas, Image, ImageData, fetch: nodeFetch});
var faceMatcher;
Promise.all([
    faceapi.nets.faceRecognitionNet.loadFromDisk('./model'),
    faceapi.nets.faceLandmark68Net.loadFromDisk('./model'),
    faceapi.nets.ssdMobilenetv1.loadFromDisk('./model')
]).then(async () => {
    console.log("loaded");
    init();
    // const loadedLabels =await startup();
    // console.log("trained")
    // faceMatcher = new faceapi.FaceMatcher(loadedLabels,0.6);
    // const img1 = await canvas.loadImage("./assets/amy/amy5.png");
    // const detect = await faceapi.detectSingleFace(img1).withFaceLandmarks().withFaceDescriptor();
    // const bestmatch = faceMatcher.bestMatch(detect.descriptor);
    // console.log(bestmatch.toString());
}).catch(e => {
    console.log(e)
});

async function init(){
    try{
        let description = [];
        const img1 = await canvas.loadImage('./assets/messi/messi1.jpg')
        const detection1 =  await faceapi.detectSingleFace(img1).withFaceLandmarks().withFaceDescriptor()
        const img2 = await canvas.loadImage("./assets/messi/messi2.jpg");
        const detection2 =  await faceapi.detectSingleFace(img2).withFaceLandmarks().withFaceDescriptor();
        description.push(detection1.descriptor);
        description.push(detection2.descriptor);
        // console.log(detection2);
        Promise.all([new faceapi.LabeledFaceDescriptors("messi",description)]).then(async res => {
            const faceMatcher = new faceapi.FaceMatcher(res,0.6);
            const img3 = await canvas.loadImage('./assets/messi/messi3.jpg');
            const detection3 =  await faceapi.detectSingleFace(img3).withFaceLandmarks().withFaceDescriptor();
            const bestMatch = faceMatcher.findBestMatch(detection3.descriptor);
            console.log("ans",bestMatch);
        })

    } catch(e){
        console.log("here",e);
    }
   
}

async function startup(){
    return Promise.all(
        arr.map(async label => {
            const desc = [];
            for(let i = 1; i < 5; i++){
                console.log(`./assets/${label}/${label}${i}.png`);
                const img = await canvas.loadImage(`./assets/${label}/${label}${i}.png`);
                const detect = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor();
                desc.push(detect.descriptor)
            }
            return new faceapi.LabeledFaceDescriptors(label,desc)
        })
    );
}

var arr = ["amy","bernadette","howard","leonard","penny","raj","sheldon","stuart"]