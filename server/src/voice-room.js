// const uuid = require('uuid');

const voiceRooms = [];

function VoiceRoom(id) {
  this.id = id;
  this.started = Date.now();
  this.peers = [];
}

VoiceRoom.prototype.toJSON = function() {
  return {id: this.id, started: this.started, peers: this.peers};
};

VoiceRoom.prototype.addPeer = function(peer) {
  this.peers.push(peer);
};

VoiceRoom.prototype.removePeer = function(userID) {
  let i = 0, found = false;
  while(!found && i < this.peers.length) {
    if (this.peers[i].userID === userID) found = true;
    else i++;
  }
  if (found) this.peers.splice(i, 1);
};

VoiceRoom.prototype.updateIsSharingScreen = function(peerID) {
  let i = 0, found = false;
  while(!found && i < this.peers.length) {
    if (this.peers[i].peerID === peerID) found = true;
    else i++;
  }
  if (found) {
    this.peers[i].isSharingScreen = true;
  }
};

VoiceRoom.create = function(id) {
  const voiceRoom = new VoiceRoom(id);
  voiceRooms.push(voiceRoom);
  return voiceRoom;
};

VoiceRoom.get = function(id) {
  let i = 0, found = false;
  while(!found && i < voiceRooms.length) {
    if (voiceRooms[i].id == id) found = true;
    else i++;
  }
  return (found) ? voiceRooms[i] : null;
};

VoiceRoom.getAll = function() {
  return voiceRooms;
};

module.exports = VoiceRoom;