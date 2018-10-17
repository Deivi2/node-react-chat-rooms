import Peer from 'peerjs';
import $ from "jquery";


export const peerjs = (function () {

    var peer, fsConnection;

        // $('#make-call').click(function(){
        //     // Initiate a call!
        //     var call = peer.call(callingId, window.localStream);
        //     step3(call);
        // });
        // $('#end-call').click(function(){
        //     window.existingCall.close();
        //     step2();
        // });
        // // Retry if getUserMedia fails
        // $('#step1-retry').click(function(){
        //     $('#step1-error').hide();
        //     step1();
        // });
        // // Get things started

        let endCall = () => {
            if (window.existingCall) {
                window.existingCall.close();
            }
            window.localStream = null;
            document.querySelector('#my-video').srcObject = null;
            document.querySelector('#my-video').pause();
            document.querySelector('#their-video').srcObject = null;
            document.querySelector('#their-video').pause();
            step2();
        };

        let makeCall = (callingId) =>{
            var call = peer.call(callingId, window.localStream);
            step3(call);
        };

        let connect = (connId) => {
            if(connId !== peer){
                fsConnection = peer.connect(connId);
            }

        };

        let sendFile = (file) => {
            fsConnection.send(file);
        };


        let exec = (userId,callback) => {

            navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

            if(!peer){
                peer = new Peer(userId);
            }

            peer.on('open', function(){
                $('#my-id').text(peer.id);
            });

// Receiving a call
            peer.on('call', function(call){
                // Answer the call automatically (instead of prompting user) for demo purposes
                call.answer(window.localStream);
                step3(call);
            });
            peer.on('error', function(err){
                alert(err.message);
                // Return to step 2 if error occurs
                step2();
            });


            peer.on('connection', function (connection) {

                console.log('connected')
                connection.on('data', function(data) {

                    console.log('Received');

                    var blob = new Blob([data.file], {type: data.filetype});
                    var url = URL.createObjectURL(blob);

                    let file = {name: data.filename, url: url};
                    if(url){
                        callback(null, file)
                    }
                });

            });



        };

        let openCamera = () =>{
            step1();
        };




// Click handlers setup

        function step1 () {
            // Get audio/video stream
            navigator.getUserMedia({audio: true, video: true}, function(stream){
                // Set your video displays
                document.querySelector('#my-video').srcObject = stream;
                window.localStream = stream;
                step2();
            }, function(){ $('#step1-error').show(); });
        }
        function step2 () {
            $('#step1, #step3').hide();
            $('#step2').show();
        }
        function step3 (call) {
            // Hang up on an existing call if present
            if (window.existingCall) {
                window.existingCall.close();
            }
            // Wait for stream on the call, then set peer video display
            call.on('stream', function(stream){
                document.querySelector('#their-video').srcObject = stream;
            });

            window.existingCall = call;

        }

    return{
        exec: exec,
        makeCall:makeCall,
        endCall: endCall,
        connect: connect,
        sendFile: sendFile,
        openCamera: openCamera
    }

})();


