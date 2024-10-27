const video = document.getElementById("video");
const input = document.querySelector(".input");
//let mBlinkSound = new Audio("/sound/shotgun-firing1.mp3");
const MODEL_URL = "./facemodels";
Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
  faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
  faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
  faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
]).then(startVideo);

function startVideo() {
  if (navigator.userAgent.match(/iPhone|iPad|Android/)) {
    ///iPhone|Android.+Mobile/
    console.log("Mobile");
    video.width = 400; //1080;

    navigator.mediaDevices
      .getUserMedia({ video: true, audio: false })
      .then((localMediaStream) => {
        if ("srcObject" in video) {
          video.srcObject = localMediaStream;
        } else {
          video.src = window.URL.createObjectURL(localMediaStream);
        }
        video.play();
      })
      .catch((err) => {
        console.error(`Not available!!!!`, err);
      });
  } else {
    console.log("PC");
    navigator.getUserMedia(
      { video: {} },
      (stream) => (video.srcObject = stream),
      (err) => console.error(err)
    );
  }
  console.log("video:" + [video.width, video.height]);

  // let div = document.createElement('div')
  // div.innerText = 'video size:'+video.width+', '+video.height
  // console.log(div.innerText);
  // document.body.appendChild(div)
}
let mili = 33;
video.addEventListener("play", () => {
  let canvas_bg = document.createElement("canvas");
  canvas_bg.width = video.width;
  canvas_bg.height = video.height;
  document.body.append(canvas_bg);
  let ctx_bg = canvas_bg.getContext("2d");
  // ctx_bg.fillStyle = "rgb(0,0,0)";
  // ctx_bg.fillRect(0, 0, video.width, video.height/2);

  let canvas_face = document.createElement("canvas");
  canvas_face.width = video.width;
  canvas_face.height = video.height;
  let ctx_face = canvas_face.getContext("2d");

  const canvas = faceapi.createCanvasFromMedia(video);
  document.body.append(canvas);
  const displaySize = { width: video.width, height: video.height };
  faceapi.matchDimensions(canvas, displaySize);

  let t1 = performance.now();
  let irisC = [];
  let nowBlinking = false;
  let blinkCount = 0;
  let count = 0;
  let cerrados = 0;
  let miliClose = 0;

  setInterval(async () => {
    //const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions()
    const detections = await faceapi
      .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks();
    const resizedDetections = faceapi.resizeResults(detections, displaySize);
    canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
    //faceapi.draw.drawDetections(canvas, resizedDetections)
    faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
    //faceapi.draw.drawFaceExpressions(canvas, resizedDetections)

    //console.log(resizedDetections.length);
    if (resizedDetections.length == 0) return;
    const landmarks = resizedDetections[0].landmarks;
    //console.log(landmarks);
    const landmarkPositions = landmarks.positions;

    //--- Iric mark ---//
    ctx_bg.clearRect(0, 0, canvas_bg.width, canvas_bg.height);
    let x_ = landmarkPositions[38 - 1].x;
    let y_ = landmarkPositions[38 - 1].y;
    let w_ = landmarkPositions[39 - 1].x - landmarkPositions[38 - 1].x;
    let h_ = landmarkPositions[42 - 1].y - landmarkPositions[38 - 1].y;
    //ctx_bg.fillStyle = "rgb(255,0,0)";
    //ctx_bg.fillRect(x_, y_, w_, h_);

    x_ = landmarkPositions[44 - 1].x;
    y_ = landmarkPositions[44 - 1].y;
    w_ = landmarkPositions[45 - 1].x - landmarkPositions[44 - 1].x;
    h_ = landmarkPositions[48 - 1].y - landmarkPositions[44 - 1].y;
    //ctx_bg.fillRect(x_, y_, w_, h_);

    //--- Face mask ---//
    //ctx_bg.fillStyle = "rgb(0,200,0)";
    //ctx_bg.beginPath();
    //ctx_bg.moveTo(landmarkPositions[0].x, landmarkPositions[0].y);
    for (let i = 1; i < 17; i++) {
      //ctx_bg.lineTo(landmarkPositions[i].x, landmarkPositions[i].y);
    }
    //ctx_bg.fill();

    //ctx_bg.moveTo(landmarkPositions[0].x, landmarkPositions[0].y);
    // ctx_bg.lineTo(landmarkPositions[17].x, landmarkPositions[17].y);
    // ctx_bg.lineTo(landmarkPositions[27].x, landmarkPositions[17].y);
    // ctx_bg.lineTo(landmarkPositions[27].x, landmarkPositions[0].y);
    //ctx_bg.lineTo(landmarkPositions[26].x, landmarkPositions[26].y);
    // ctx_bg.lineTo(landmarkPositions[16].x, landmarkPositions[16].y);
    // ctx_bg.lineTo(landmarkPositions[16].x, landmarkPositions[16].y - 200);
    // ctx_bg.lineTo(landmarkPositions[0].x, landmarkPositions[0].y - 200);
    // ctx_bg.lineTo(landmarkPositions[0].x, landmarkPositions[0].y);
    // ctx_bg.fill();

    //--- Iris value ---//
    ctx_face.clearRect(0, 0, canvas_face.width, canvas_face.height);
    ctx_face.drawImage(video, 0, 0, video.width, video.height);
    let frame = ctx_face.getImageData(0, 0, video.width, video.height);
    let p_ = Math.floor(x_ + w_ / 2) + Math.floor(y_ + h_ / 2) * video.width;
    //console.log("eye_RGB:"+[frame.data[p_*4+0], frame.data[p_*4+1], frame.data[p_*4+2]]);
    let v_ = Math.floor(
      (frame.data[p_ * 4 + 0] +
        frame.data[p_ * 4 + 1] +
        frame.data[p_ * 4 + 2]) /
        3
    );
    //console.log("irisC:" + v_);

    irisC.push(v_);
    if (irisC.length > 100) {
      irisC.shift();
    } //

    let meanIrisC = irisC.reduce(function (sum, element) {
      return sum + element;
    }, 0);
    meanIrisC = meanIrisC / irisC.length;
    let vThreshold = 1.5;

    let currentIrisC = irisC[irisC.length - 1];
    if (irisC.length == 100) {
      if (nowBlinking == false) {
        if (currentIrisC >= meanIrisC * vThreshold) {
          nowBlinking = true;
          miliClose = 0;
          letra = letraActual;
          // console.clear();
          //console.log("Cerrados", miliClose);
        } //
      } //
      else {
        if (currentIrisC < meanIrisC * vThreshold) {
          if (meanIrisC * vThreshold < 40) return;

          //console.log("Abiertos", miliClose);
          nowBlinking = false;
          blinkCount += 1;

          if (miliClose > 150) {
            count++;
            console.log(
              "Parpadeo",
              cerrados,
              "miliClose:",
              miliClose,
              count,
              blinkCount,
              letraActual
            );
            letraActual = letra;
            escribir();
            blinkCount = 0;
            cerrados = 0;
            miliClose = 0;
          }
          //mBlinkSound.pause();
          //mBlinkSound.currentTime = 0;
          //mBlinkSound.play();
        } //
        else {
          cerrados++;
          miliClose += mili;
          // console.log("cerrados", cerrados, currentIrisC, meanIrisC);
        }
      } //
    } //

    // //--- Iris position ---// 36 -> 39
    // let horizontal_eye = [];
    // let x_s = Math.floor( landmarkPositions[36].x )
    // let x_e = Math.floor( landmarkPositions[39].x )
    // let py = Math.floor( landmarkPositions[36].y )
    // for(let x=x_s;x<=x_e;x++){
    //     p_ = x + py * video.width
    //     v_ = (frame.data[p_*4+0] + frame.data[p_*4+1] + frame.data[p_*4+2])/3
    //     horizontal_eye.push(v_)
    // }

    //--- Graph ---//
    return;
    ctx_bg.strokeStyle = "red";
    ctx_bg.lineWidth = 5;
    let Ox = 0;
    let Oy = canvas_bg.height / 2;
    let Lx = canvas_bg.width;
    let Ly = canvas_bg.height / 2;
    let vx = (0 / irisC.length) * Lx;
    let vy = (irisC[0] / 255) * Ly;
    ctx_bg.beginPath();
    ctx_bg.moveTo(Ox + vx, Oy - vy);
    for (let i = 1; i < irisC.length; i++) {
      vx = (i / irisC.length) * Lx;
      vy = (irisC[i] / 255) * Ly;
      ctx_bg.lineTo(Ox + vx, Oy - vy);
    }
    ctx_bg.stroke();

    //--- mean value x threshold(1.X)
    ctx_bg.strokeStyle = "rgb(0,255,0)";
    ctx_bg.lineWidth = 2;
    ctx_bg.beginPath();
    vx = 0 * Lx;
    vy = ((meanIrisC * vThreshold) / 255) * Ly;
    ctx_bg.moveTo(Ox + vx, Oy - vy);
    vx = 1 * Lx;
    ctx_bg.lineTo(Ox + vx, Oy - vy);
    ctx_bg.stroke();

    // //--- Graph ---//
    // Ox = 0;
    // Oy = canvas_bg.height;
    // Lx = canvas_bg.width/2;
    // Ly = canvas_bg.height/2;
    // vx = 0;
    // vy = horizontal_eye[0]/255 * Ly;
    // ctx_bg.beginPath();
    // ctx_bg.moveTo(Ox+vx, Oy-vy);
    // for(let i=1;i<horizontal_eye.length;i++){
    //   vx = i/horizontal_eye.length * Lx;
    //   vy = horizontal_eye[i]/255 * Ly;
    //   ctx_bg.lineTo(Ox+vx, Oy-vy);
    // }
    // ctx_bg.stroke();

    let ctx = canvas.getContext("2d");
    let t2 = performance.now(); //ms
    ctx.font = "48px serif";
    ctx.fillText("FPS:" + Math.floor(1000.0 / (t2 - t1)), 10, 50);
    ctx.fillText("Count:" + blinkCount, 10, 100);
    if (nowBlinking) {
      ctx.fillText("Blinking", 10, 150);
    }
    //ctx.fillText("FPS:"+ (t2-t1), 10, 50);
    t1 = t2;
  }, mili);
});
