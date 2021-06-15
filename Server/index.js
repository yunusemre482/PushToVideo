const express=require('express');
const http = require('http');
var path = require('path');
var url = require('url');
var minimist = require('minimist');
var ws = require('ws');
var kurento = require('kurento-client');
var fs = require('fs');
var https = require('https');
const app = express();
const authRoutes = require('./routes/auth');
const mongoose = require('mongoose');
const dotenv = require('dotenv'); 

dotenv.config();
//connect to DB
mongoose.connect(process.env.DB_CONNECT ,{ useNewUrlParser: true  , useUnifiedTopology: true } ,()=>{
    console.log("connected to DB");
});

const server = http.createServer(app);

app.use(express.json());
//middleware of  routes
app.use("/api/user/" ,authRoutes);

var argv = minimist(process.argv.slice(2), {
	default: {
		as_uri: 'https://localhost:8555',
		ws_uri: 'ws://localhost:8888/kurento'
	}
});
var options =
{
	key: fs.readFileSync('keys/server.key'),
	cert: fs.readFileSync('keys/server.crt'),
	
};
var idCounter = 0;
var candidatesQueue = {};
var kurentoClient = null;
var presenter = null;
var viewers = [];
var sessionId;
var viewersList = [];
presenterWS = null

var asUrl = url.parse(argv.as_uri);
var port = asUrl.port;
var server = https.createServer(options, app).listen(port, function () {
	

	console.log('Open ' + url.format(asUrl));
});

var wss = new ws.Server({
	server: server,
	
});

function nextUniqueId() {
	idCounter++;
	return idCounter.toString();
}

/*
 * Management of WebSocket messages
 */
wss.on('connection', function (ws) {


	sessionId = nextUniqueId();
	console.log("Connection ");
	viewersList[sessionId] = {
		"sessionID": sessionId,
		"ws": ws
	}
	ws.send(JSON.stringify({
		id: 'setSessionId',
		sessionID: sessionId
	}))
	
	ws.on('message', function (_message) {
		var message = JSON.parse(_message);
		
		switch (message.id) {
			case 'presenter':

				startPresenter(message.sessionID, ws, message.sdpOffer, function (error, sdpAnswer) {
					//console.info(sessionId);
					if (error) {
						return ws.send(JSON.stringify({
							id: 'presenterResponse',
							response: 'rejected',
							message: error
						}));
					}
					presenterWS = ws
					ws.send(JSON.stringify({
						id: 'presenterResponse',
						response: 'accepted',
						sdpAnswer: sdpAnswer
					}));
					console.log(message.sessionID)
				});

				break;

			case 'viewer':
				
				startViewer(message.sessionID, ws, message.sdpOffer, function (error, sdpAnswer) {
					if (error) {
						return ws.send(JSON.stringify({
							id: 'viewerResponse',
							response: 'rejected',
							message: error
						}));
					}
					ws.send(JSON.stringify({
						id: 'viewerResponse',
						response: 'accepted',
						sdpAnswer: sdpAnswer
					}));
				});
				break;

			case 'stop':
				stop(message.sessionID);
				break;

			case 'onIceCandidate':
				onIceCandidate(message.sessionID, message.candidate);
				break;
			
			case 'presenterStart':
				
				for (var i in viewersList) {
					var viewer = viewersList[i];
				
					if (viewer.ws && viewer.ws != presenterWS) {
						console.log(viewer.sessionID)
						viewer.ws.send(JSON.stringify({
							id: 'canStartViewer'
						}));
					}
				}
				break;

			case 'close':
				console.log("Connection Closed " + message.sessionId);
				viewersList.splice(message.sessionId, 1)
				break;

			default:
				ws.send(JSON.stringify({
					id: 'error',
					message: 'Invalid message ' + message
				}));
				break;
		}
	});
});

/*
 * Definition of functions
 */

// Recover kurentoClient for the first time.
function getKurentoClient(callback) {
	if (kurentoClient !== null) {
		return callback(null, kurentoClient);
	}

	kurento(argv.ws_uri, function (error, _kurentoClient) {
		if (error) {
			console.log("Could not find media server at address " + argv.ws_uri);
			return callback("Could not find media server at address" + argv.ws_uri
				+ ". Exiting with error " + error);
		}

		kurentoClient = _kurentoClient;
		callback(null, kurentoClient);
	});
}

function startPresenter(sessionId, ws, sdpOffer, callback) {
	clearCandidatesQueue(sessionId);

	if (presenter !== null) {
		stop(sessionId);
		return callback("Another user is currently acting as presenter. Try again later ...");
	}

	presenter = {
		id: sessionId,
		pipeline: null,
		webRtcEndpoint: null
	}

	getKurentoClient(function (error, kurentoClient) {
		if (error) {
			stop(sessionId);
			return callback(error);
		}

		if (presenter === null) {
			stop(sessionId);
			return callback();
		}

		kurentoClient.create('MediaPipeline', function (error, pipeline) {
			if (error) {
				stop(sessionId);
				return callback(error);
			}

			if (presenter === null) {
				stop(sessionId);
				return callback();
			}

			presenter.pipeline = pipeline;
			pipeline.create('WebRtcEndpoint', function (error, webRtcEndpoint) {
				if (error) {
					stop(sessionId);
					return callback(error);
				}

				if (presenter === null) {
					stop(sessionId);
					return callback();
				}

				presenter.webRtcEndpoint = webRtcEndpoint;

				if (candidatesQueue[sessionId]) {
					while (candidatesQueue[sessionId].length) {
						var candidate = candidatesQueue[sessionId].shift();
						webRtcEndpoint.addIceCandidate(candidate);
					}
				}

				webRtcEndpoint.on('OnIceCandidate', function (event) {
					var candidate = kurento.getComplexType('IceCandidate')(event.candidate);
					ws.send(JSON.stringify({
						id: 'iceCandidate',
						candidate: candidate
					}));
				});

				webRtcEndpoint.processOffer(sdpOffer, function (error, sdpAnswer) {
					if (error) {
						stop(sessionId);
						return callback(error);
					}

					if (presenter === null) {
						stop(sessionId);
						return callback();
					}

					callback(null, sdpAnswer);
				});

				webRtcEndpoint.gatherCandidates(function (error) {
					if (error) {
						stop(sessionId);
						return callback(error);
					}
				});
			});
		});
	});
}

function startViewer(sessionId, ws, sdpOffer, callback) {
	console.info('start viewer');
	//console.log('start viewer');
	//clearCandidatesQueue(sessionId);

	if (presenter === null) {
		stop(sessionId);
		return callback();
	}

	presenter.pipeline.create('WebRtcEndpoint', function (error, webRtcEndpoint) {

		if (error) {
			console.log('error');
			stop(sessionId);
			return callback(error);
		}
		viewers[sessionId] = {
			"webRtcEndpoint": webRtcEndpoint,
			"ws": ws
		}

		if (presenter === null) {
			stop(sessionId);
			return callback();
		}
		
		if (candidatesQueue[sessionId]) {
			while (candidatesQueue[sessionId].length) {
				var candidate = candidatesQueue[sessionId].shift();
				webRtcEndpoint.addIceCandidate(candidate);
			}
		}

		webRtcEndpoint.on('OnIceCandidate', function (event) {
			var candidate = kurento.getComplexType('IceCandidate')(event.candidate);
			ws.send(JSON.stringify({
				id: 'iceCandidate',
				candidate: candidate
			}));
		});

		webRtcEndpoint.processOffer(sdpOffer, function (error, sdpAnswer) {
			if (error) {
				stop(sessionId);
				return callback(error);
			}
			if (presenter === null) {
				stop(sessionId);
				return callback();
			}
			

			presenter.webRtcEndpoint.connect(webRtcEndpoint, function (error) {
				if (error) {
					stop(sessionId);
					return callback(error);
				}
				if (presenter === null) {
					stop(sessionId);
					return callback();
				}

				callback(null, sdpAnswer);
				webRtcEndpoint.gatherCandidates(function (error) {
					if (error) {
						stop(sessionId);
						return callback(error);
					}
				});
			});
		});
	});
}

function clearCandidatesQueue(sessionId) {
	if (candidatesQueue[sessionId]) {
		delete candidatesQueue[sessionId];
	}
}

function stop(sessionId) {
	if (presenter !== null && presenter.id == sessionId) {
		for (var i in viewers) {
			var viewer = viewers[i];
			if (viewer.ws) {
				viewer.ws.send(JSON.stringify({
					id: 'stopCommunication'
				}));
			}
		}
		presenter.pipeline.release();
		presenter = null;
		viewers = [];

	} else if (viewers[sessionId]) {
		viewers[sessionId].webRtcEndpoint.release();
		delete viewers[sessionId];
	}

	clearCandidatesQueue(sessionId);

	if (viewers.length < 1 && !presenter) {
		//console.log('Closing kurento client');
		kurentoClient.close();
		kurentoClient = null;
	}
}

function onIceCandidate(sessionId, _candidate) {
	var candidate = kurento.getComplexType('IceCandidate')(_candidate);

	if (presenter && presenter.id === sessionId && presenter.webRtcEndpoint) {
		//console.info('Sending presenter candidate');
		presenter.webRtcEndpoint.addIceCandidate(candidate);
	}
	else if (viewers[sessionId] && viewers[sessionId].webRtcEndpoint) {
		//console.info('Sending viewer candidate');
		viewers[sessionId].webRtcEndpoint.addIceCandidate(candidate);
	}
	else {
		//console.info('Queueing candidate');
		if (!candidatesQueue[sessionId]) {
			candidatesQueue[sessionId] = [];
		}
		candidatesQueue[sessionId].push(candidate);
	}
}

app.use(express.static(path.join(__dirname, 'static')));