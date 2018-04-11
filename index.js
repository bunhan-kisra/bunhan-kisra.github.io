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
var myId = 'id'+ (Math.floor(Math.random() * 1000000) + 1)

microgear.on('connected', function() {
    console.log('Connected...');
    // var myId = 'id'+ (Math.floor(Math.random() * 1000000) + 1)
    microgear.setAlias(myId);
    console.log('my id %s', myId)
    // setInterval(function() {
    //     microgear.chat('mygear', 'Hello world.'+ new Date());
    // },1000);

    // document.querySelector('#btn1').addEventListener('click', function (ev) {
    //     ev.preventDefault()
    //     // p.signal(JSON.parse(document.querySelector('#incoming').value))
    //     // console.log(document.querySelector('#myTextarea').value)
    //     var input = document.querySelector('#myTextarea').value.toString()
    //     console.log(input)
    //     microgear.chat(input, 'Hello world.'+ new Date());
    // })

});

// microgear.on('message', function(topic,body) {
//     console.log('incoming : '+topic+' : '+body);
//     if (body.toString().indexOf('getSinnal') > -1) {
//         var aname = body.toString().split(':')
//         var senderName = aname[1]
//         microgear.chat(senderName, sinnalData);
//     }
// });

microgear.on('closed', function() {
    console.log('Closed...');
});

var sinnalData;
var hostS;
// get video/voice stream
navigator.getUserMedia({ video: true, audio: true }, gotMedia, function () {})

function gotMedia (stream) {
    var p = new Peer({ initiator: location.hash === '#1', trickle: false, stream: stream})

    p.on('error', function (err) { console.log('error', err) })

    p.on('signal', function (data) {
        sinnalData = JSON.stringify(data)
        console.log('SIGNAL', sinnalData)
        document.querySelector('#outgoing').textContent = sinnalData
        if (location.hash !== '#1') {
            microgear.chat(hostS, sinnalData);
        }
    })

    document.querySelector('form').addEventListener('submit', function (ev) {
        ev.preventDefault()
        p.signal(JSON.parse(document.querySelector('#incoming').value))
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

    //
    microgear.on('message', function(topic,body) {
    console.log('incoming : '+topic+' : '+body);
    if (body.toString().indexOf('getSinnal') > -1) {
        var aname = body.toString().split(':')
        var senderName = aname[1]
        microgear.chat(senderName, sinnalData);
    } else {
        p.signal(JSON.parse(body.toString()))
    }
});

}


document.querySelector('#btn1').addEventListener('click', function (ev) {
        ev.preventDefault()
        // p.signal(JSON.parse(document.querySelector('#incoming').value))
        // console.log(document.querySelector('#myTextarea').value)
        var input = document.querySelector('#myTextarea').value.toString()
        console.log(input)
        hostS = input
        microgear.chat(input, 'getSinnal:'+ myId);
    })
