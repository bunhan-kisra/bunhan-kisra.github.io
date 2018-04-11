var Peer = require('simple-peer')
//
var MicroGear = require('microgear');

const APPID  = 'kisramodul';
const KEY    = 'heLwJbuvST8Wjm7';
const SECRET = 'VZ4a6MTsJLdZp8Opv9YKhnlMJ';

var microgear = MicroGear.create({
    key : KEY,
    secret : SECRET
});

microgear.connect(APPID);

microgear.on('connected', function() {
    console.log('Connected...');
    microgear.setAlias("mygear");
    setInterval(function() {
        microgear.chat('mygear', 'Hello world.'+ new Date());
    },1000);
});

microgear.on('message', function(topic,body) {
    console.log('incoming : '+topic+' : '+body);
});

microgear.on('closed', function() {
    console.log('Closed...');
});

// get video/voice stream
navigator.getUserMedia({ video: true, audio: true }, gotMedia, function () {})

function gotMedia (stream) {
var p = new Peer({ initiator: location.hash === '#1', trickle: false, stream: stream})

p.on('error', function (err) { console.log('error', err) })

p.on('signal', function (data) {
  console.log('SIGNAL', JSON.stringify(data))
  document.querySelector('#outgoing').textContent = JSON.stringify(data)
})

document.querySelector('form').addEventListener('submit', function (ev) {
  ev.preventDefault()
  p.signal(JSON.parse(document.querySelector('#incoming').value))
})
document.querySelector('button').addEventListener('click', function (ev) {
  ev.preventDefault()
  // p.signal(JSON.parse(document.querySelector('#incoming').value))
    console.log(document.querySelector('#myTextarea').value)
})

p.on('connect', function () {
  console.log('CONNECT')
  p.send('whatever' + Math.random())
})

p.on('data', function (data) {
  console.log('data: ' + data)
})

p.on('stream', function (stream) {
    // got remote video stream, now let's show it in a video tag
    var video = document.querySelector('video')
    video.src = window.URL.createObjectURL(stream)
    video.play()
  })

}
