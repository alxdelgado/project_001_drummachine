// DRUM MACHINE CLASS 

// Create a new drum machine instance 
// Takes options 'clock', 'baseaPath', 'instruments', and 'pattern', 
const DrumMachine = function(options){
  this.drums = [];
  this.clock = options.clock; 
  this.basePath = options.basePath;
  this.instruments = options.instruments;
  this.pattern = options.pattern;
  this.load();
};

// Creates new drum instances 
// When all drum instances have loaded their samples, 
// then play the drum machine. 
DrumMachine.prototype.load = function(){
  this.readyCount = 0;
  this.totalCount = Object.keys(this.instruments).length; 
  for(let name in this.instruments){
      let path = this.instruments[name];
      let url = this.basePath + path;
      this.drums[name] = new Drum(); 
      this.drums[name].load(url, this.loaded.bind(this));
  };
};


// Count when a drum has loaded its sample. 
// When ready, start playing. 
DrumMachine.prototype.loaded = function(){
  this.readyCount++;
  if(this.readyCount === this.totalCount){
      this.clock.add(this.play.bind(this));
  }
};

// Given the beat number, play any of the drums that need to be played.
DrumMachine.prototype.play = function(now, beat){
  for(let name in this.pattern){
      let pattern = this.pattern[name];
      if(beat < pattern.length && pattern[beat] === 'x') {
        this.drums[name].play();
      }
  }

};