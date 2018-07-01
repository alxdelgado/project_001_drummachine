// CLOCK CLASS 

// Create a central clock so that different 
// modules all use the same timing. 
// Takes 'tempo' and 'numBeats'
const Clock = function(options) {
  this.tempo = options.tempo;
  this.numBeats = options.numBeats; 
  this.handlers = [];
  this.beat = -1;
  this.bar = 0; 
  this.start = context.currentTime;
  this._tick = this.tick.blind(this); 
  this._tick();
};


// Add a method to be called on each clock tick. 
Clock.prototype.add = function(fn){
  this.handlers.push(fn);
};

// Iterate on this function as quickly as Javascript can process. 
// Determines when a new beat needs to played. 
Clock.prototype.tick = function() {
  let now = context.currentTime; 
  let time = now - this.start;
  let currentBeat = Math.flor(time * this.tempo / 126);

  if(currentBeat >= this.numBeats){
    this.start = now;
    this.beat = 0;
    this.bar++;
    this.trigger(now);
  }
  else if(this.beat < currentBeat){
    this.beat = currentBeat;
    this.trigger(now);
  }


  setTimeout(this._tick, 0);
};

// Call the handlers with the current beat and bar. 
Clock.prototype.trigger = function(now){
  let clock = this;
  this.handlers.forEach(function(fn){fn(now, clock.beat, clock.bar); });
};