// Grab elements, create settings, etc.
let tensorflowjs_model = null;
let isObjectDetectionEnabled = false;
let ShowingObjectDetection = false;
let isRecordingEnabled = false;
let isPersondetectionRecordingEnabled = false;

init();

// Utils
function init() {
  cam_start();
}

function sleep(time) {
  return new Promise(resolve => setTimeout(resolve, time));
}

function format_date(date) {
  let d = new Date(date);
  let year = d.getFullYear();
  let month = "" + (d.getMonth() + 1);
  let day = "" + d.getDate();
  let hour = "" + d.getHours();
  let minute = "" + d.getMinutes();
  let second = "" + d.getSeconds();
  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;
  if (hour.length < 2) hour = "0" + hour;
  if (minute.length < 2) minute = "0" + minute;
  if (second.length < 2) second = "0" + second;

  return (
    year + "/" + month + "/" + day + "_" + hour + ":" + minute + ":" + second
  );
}

/// LOADER ///
function open_loader_effect(text) {
  let loader_modal = document.getElementById("loader_modal");
  document.getElementById("loader_message").innerHTML = text;
  loader_modal.style.display = "block";
}

function close_loader_effect() {
  let loader_modal = document.getElementById("loader_modal");
  loader_modal.style.display = "none";
}

// controlling buttons
this.icons_ = document.getElementById("icons");

function activate_(element) {
  element.classList.add("active");
}

function deactivate_(element) {
  element.classList.remove("active");
}

function showIcons_() {
  if (!this.icons_.classList.contains("active")) {
    this.activate_(this.icons_);
    this.setIconTimeout_();
  }
}

function hideIcons_() {
  if (this.icons_.classList.contains("active")) {
    this.deactivate_(this.icons_);
  }
}

function setIconTimeout_() {
  if (this.hideIconsAfterTimeout) {
    window.clearTimeout.bind(this, this.hideIconsAfterTimeout);
  }
  this.hideIconsAfterTimeout = window.setTimeout(
    function() {
      this.hideIcons_();
    }.bind(this),
    5000
  );
}
window.onmousemove = this.showIcons_.bind(this);

// Smart Recording
function toggleSmartHumanVideoRecording_() {
  if (isPersondetectionRecordingEnabled) {
    stop_smart_human_video_recording();
  } else {
    start_smart_human_video_recording();
  }
}

function start_smart_human_video_recording() {
  if (!isPersondetectionRecordingEnabled) {
    isPersondetectionRecordingEnabled = true;
    start_detection();
    document.getElementById("smart-recording").classList.add("on");
  } else {
    console.log("start_smart_human_video_recording is already running");
  }
}

function stop_smart_human_video_recording() {
  isPersondetectionRecordingEnabled = false;
  if (isRecordingEnabled) {
    stop_recording();
  }
  if (isObjectDetectionEnabled && !ShowingObjectDetection) {
    stop_detection();
  }
  document.getElementById("smart-recording").classList.remove("on");
}

// OBJECT DETECTION
function flipImage(img, ctx, width, height, flipH, flipV) {
  let scaleH = flipH ? -1 : 1; // Set horizontal scale to -1 if flip horizontal
  let scaleV = flipV ? -1 : 1; // Set verical scale to -1 if flip vertical
  let posX = flipH ? width * -1 : 0; // Set x position to -100% if flip horizontal
  let posY = flipV ? height * -1 : 0; // Set y position to -100% if flip vertical

  ctx.save(); // Save the current state
  ctx.scale(scaleH, scaleV); // Set scale to flip the image
  ctx.drawImage(img, posX, posY, width, height); // draw the image
  ctx.restore(); // Restore the last saved state
}

async function load_model_effect() {
  open_loader_effect("Camera is setting up . . . .");
  tensorflowjs_model = await cocoSsd.load();
  close_loader_effect();
}

async function start_detection() {
  if (tensorflowjs_model == null) {
    await load_model_effect();
  }
  let canvas = document.getElementById("canvas");
  let ctx = canvas.getContext("2d");
  let video = document.getElementById("local-video");
  let last_detection_t;
  let window_height = window.innerHeight;
  let window_width = window.innerWidth;
  let cam_height = video.videoHeight;
  let cam_width = video.videoWidth;
  let width;
  let height;
  if (window_height > window_width) {
    width = window_width;
    height = (window_width * cam_height) / cam_width;
  } else {
    width = (window_height * cam_width) / cam_height;
    height = window_height;
  }
  video.width = canvas.width = width;
  video.height = canvas.height = height;
  isObjectDetectionEnabled = true;
  let gradient = ctx.createLinearGradient(0, 0, 250, 0);
  gradient.addColorStop("0", "red");
  gradient.addColorStop("0.5", "magenta");
  gradient.addColorStop("1.0", "blue");
  ctx.strokeStyle = gradient;
  ctx.lineWidth = 2;
  ctx.font = "24px Arial";
  doCapture = true;

  while (isObjectDetectionEnabled) {
    let predictions = await tensorflowjs_model.detect(video);
    ctx.clearRect(0, 0, width, height);
    ctx.beginPath();
    ctx.drawImage(video, 0, 0, width, height);

    predictions.forEach(value => {
      if (["person", "cat", "dog"].indexOf(value["class"]) > -1) {
        if (isPersondetectionRecordingEnabled && !isRecordingEnabled) {
          start_recording();
        }
        if (doCapture) {
          captureImage();
          doCapture = !doCapture;
          const a = setInterval(() => {
            doCapture = !doCapture;
            clearInterval(a);
          }, 15000);
        }

        let xmin = value["bbox"][0];
        let ymin = value["bbox"][1];
        let xmax = value["bbox"][2];
        let ymax = value["bbox"][3];
        ctx.rect(xmin, ymin, xmax, ymax);
        let class_score = value["class"] + " " + value["score"].toFixed(2);
        ctx.fillText(class_score, xmin + 5, ymin + 23);
        ctx.strokeText(class_score, xmin + 5, ymin + 25);
        ctx.stroke();
        last_detection_t = new Date();
      }
    });
    let detection_interval = (new Date() - last_detection_t) / 1000;
    // If there is nothing detected during 5 seconds, save recording.
    if (
      isPersondetectionRecordingEnabled &&
      isRecordingEnabled &&
      detection_interval > 3
    ) {
      stop_recording();
    }

    await sleep(100);
  }
}

function stop_detection() {
  isObjectDetectionEnabled = false;
}

async function show_dectection() {
  ShowingObjectDetection = true;
  if (!isObjectDetectionEnabled) {
    if (tensorflowjs_model == null) {
      await load_model_effect();
    }
    start_detection();
  }

  document.getElementById("local-video").setAttribute("hidden", "");
  document.getElementById("canvas").removeAttribute("hidden");
  document.getElementById("object-detection").classList.add("on");
}

function hide_detection() {
  ShowingObjectDetection = false;
  document.getElementById("local-video").removeAttribute("hidden");
  document.getElementById("canvas").setAttribute("hidden", "");
  document.getElementById("object-detection").classList.remove("on");
}

function toggleObjectDetection_() {
  if (ShowingObjectDetection) {
    hide_detection();
    if (!isPersondetectionRecordingEnabled) {
      stop_detection();
    }
  } else {
    show_dectection();
  }
}

// Webcam settings
function cam_start() {
  let video = document.getElementById("local-video");
  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices.getUserMedia({ video: true }).then(function(stream) {
      video.srcObject = stream;
      video.play();
    });
  }
  document.getElementById("webcam").classList.add("on");
}

function cam_stop() {
  let video = document.getElementById("local-video");
  if (video.srcObject == null) {
    return false;
  }
  let tracks = video.srcObject.getTracks();
  tracks.forEach(function(track) {
    track.stop();
  });
  video.srcObject = null;
  tracks = null;
  video = null;
  document.getElementById("webcam").classList.remove("on");
}

function toggleWebcam_() {
  if (document.getElementById("local-video").srcObject == null) {
    cam_start();
  } else {
    cam_stop();
  }
}

function IconSet_toggle(iconElement) {
  if (iconElement.classList.contains("on")) {
    iconElement.classList.remove("on");
  } else {
    iconElement.classList.add("on");
  }
}

/// Recording ///
let mediaRecorder;
let recordedBlobs;
function start_recording() {
  if (isRecordingEnabled) {
    return;
  }
  isRecordingEnabled = true;
  recordedBlobs = [];
  if (mediaRecorder == undefined) {
    let options = { mimeType: "video/webm" };
    let stream = document.getElementById("local-video").captureStream();
    try {
      mediaRecorder = new MediaRecorder(stream, options);
    } catch (e0) {
      try {
        options = { mimeType: "video/webm,codecs=vp9" };
        mediaRecorder = new MediaRecorder(stream, options);
      } catch (e1) {
        try {
          options = "video/vp8"; // Chrome 47
          mediaRecorder = new MediaRecorder(stream, options);
        } catch (e2) {
          return;
        }
      }
    }
    mediaRecorder.onstop = handleStop;
    mediaRecorder.ondataavailable = handleDataAvailable;
  }
  mediaRecorder.start();
  let record_start_t = new Date();
  let video_title = document.createElement("p");
  video_title.classList.add("title");
  video_title.innerHTML = "Time: " + format_date(record_start_t) + " ~ ";
  document.getElementById("recording").classList.add("on");
}

function handleDataAvailable(event) {
  if (event.data && event.data.size > 0) {
    recordedBlobs.push(event.data);
  }
}

function stop_recording() {
  mediaRecorder.stop();
  isRecordingEnabled = false;
  document.getElementById("recording").classList.remove("on");
}

function handleStop(event) {
  save_recording();
}

function save_recording() {
  let superBuffer = new Blob(recordedBlobs, { type: "video/webm" });
  let src_url = window.URL.createObjectURL(superBuffer);
  console.log("superBuffer", superBuffer);
  //get video
  savevideo(superBuffer);
}

async function restart_recording() {
  stop_recording();
  await sleep(100);
  start_recording();
}

function toggleRecording_() {
  if (!isRecordingEnabled) {
    start_recording();
  } else {
    stop_recording();
  }
  if (isPersondetectionRecordingEnabled) {
    stop_smart_human_video_recording();
  }
}
// video upload firebase storage
function savevideo(videoBlob) {
  var timestamp = Number(new Date());
  var file = videoBlob;
  let date = new Date();
  let time = format_date(date);
  var storageRef = firebase.storage().ref(timestamp.toString());
  // add video to firebase storege
  storageRef
    .put(file)
    .then(function(snapshot) {
      console.log("Uploaded a blob or file!");
      storageRef
        .getDownloadURL()
        .then(url => {
          // add video to firestore database
          firestore
            .collection("videoUrl")
            .doc(timestamp.toString())
            .set({
              videoUrl: url,
              vidName: "Video_" + time,
              vidtimestamp: timestamp.toString()
            })
            .then(res => {})
            .catch(error => {
              console.log(`Error *************** ${error}`);
            });
        })
        .catch(error => {
          console.log(error);
        });
    })
    .catch(error => {
      console.log(error);
    });
}

//image capture and upload firestore
function saveImage(image) {
  image = image.slice(22);
  let date = new Date();
  let name = format_date(date);
  name = "Img_" + name;
  let time = new Date().getTime().toString();
  firestore
    .collection("images")
    .add({
      imgName: name,
      imgUrl: image,
      timestamp: time
    })
    .then(res => {
      console.log("documented written with the refId " + res.id);
    })
    .catch(error => {
      console.log(`Error *************** ${error}`);
    });
}

async function captureImage() {
  var canvas = document.getElementById("canvas");
  var dl = document.createElement("a");
  dl.href = canvas.toDataURL();
  saveImage(canvas.toDataURL());
  dl.download = true;
  document.body.appendChild(dl);
  dl.click();
}

this.objectdetectionIconSet_ = document.getElementById("object-detection");
this.objectdetectionIconSet_.onclick = toggleObjectDetection_.bind(this);
this.webcamIconSet_ = document.getElementById("webcam");
this.webcamIconSet_.onclick = toggleWebcam_.bind(this);
this.recordingIconSet_ = document.getElementById("recording");
this.recordingIconSet_.onclick = toggleRecording_.bind(this);
this.smartrecordingIconSet_ = document.getElementById("smart-recording");
this.smartrecordingIconSet_.onclick = toggleSmartHumanVideoRecording_.bind(
  this
);
