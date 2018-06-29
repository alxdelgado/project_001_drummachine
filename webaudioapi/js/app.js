console.log('JS is working'); 


const audio = new AudioContext();

function createSineWave(audio, duration, currentTime){
  let oscillator = audio.createOscillator(); 
  oscillator.type = 'sine';
  oscillator.start(currentTime);
  oscillator.stop(audio.currentTime + duration);  

  return oscillator;

};

function rampDown(audio, item, startValue, duration){
  item.setValueAtTime(startValue, duration); 
  item.exponentialRampToValueAtTime(0.01, audio.currentTime + duration); 

};

function createAmplifier(audio, startValue, duration){
  let amplifier = audio.createGain(); 
  rampDown(audio, amplifier.gain, startValue, duration);
  return amplifier;
};

function chain(items){
  for (let i = 0; i < items.length - 1; i++){
    items[i].connect(items[i + 1]); 
  }
};

function note(audio, frequency){
 return function(){
  let duration = 1;
  let sineWave = createSineWave(audio, duration);
  sineWave.frequency.value = frequency; 

  chain([sineWave, 
    createAmplifier(audio, 0.2, duration),
    audio.destination]); 
 }
};

function kick(audio){
 return function(){
  let duration = 2;
  let sineWave = createSineWave(audio, duration);
  rampDown(audio, sineWave.frequency, 60, duration);

  chain([sineWave, 
    createAmplifier(audio, 0.4, duration),
    audio.destination]); 
 }
};

function clap(audio){
 return function(){
  let duration = 2;
  let sineWave = createSineWave(audio, duration);
  rampDown(audio, sineWave.frequency, 440, duration);

  chain([sineWave, 
    createAmplifier(audio, 0.4, duration),
    audio.destination]); 
 }
};

function hat(audio){
 return function(){
  let duration = 2;
  let sineWave = createSineWave(audio, duration);
  rampDown(audio, sineWave.frequency, 440, duration);

  chain([sineWave, 
    createAmplifier(audio, 0.4, duration),
    audio.destination]); 
 }
};

function snare(audio){
 return function(){
  let duration = 2;
  let sineWave = createSineWave(audio, duration);
  rampDown(audio, squareWave.frequency, 440, duration);

  chain([sineWave, 
    createAmplifier(audio, 0.4, duration),
    audio.destination]); 
 }
};

function createTrack(color, playSound){
  let steps = []; 
  for (let i = 0; i < 16; i++){
    steps.push(false); 
  }
  return {steps: steps, color: color, playSound: playSound}; 
};


let data = {
  step: 0, 
  tracks: [createTrack("gold", note(audio, 440)),
           createTrack("black", kick(audio)),
           createTrack("blue", clap(audio)),
           createTrack("green", hat(audio)),
           createTrack("grey", snare(audio))]
          

}; 

let screen = document.getElementById("screen").getContext("2d"); 

let BUTTON_SIZE = 26; 

function buttonPosition(column, row){
  return {
    x: BUTTON_SIZE / 2 + column * BUTTON_SIZE * 1.5, 
    y: BUTTON_SIZE / 2 + row * BUTTON_SIZE * 1.5
  };
};

function drawButton(screen, column, row, color){
  let position = buttonPosition(column, row); 
  screen.fillStyle = color; 
  screen.fillRect(position.x, position.y, BUTTON_SIZE, BUTTON_SIZE); 
};

function drawTracks(screen, data){
  data.tracks.forEach(function(track, row){
    track.steps.forEach(function(on, column){
      drawButton(screen, column, row, on ? track.color: 'lightgray');
    });
  });
};

// update loop 

setInterval(function(){
  data.step = (data.step + 1) % data.tracks[0].steps.length; 
  console.log(data.step);

  data.tracks.filter(function(track){return track.steps[data.step];})
  .forEach(function(track){track.playSound(); }); 
}, 100);




// draw 
(function draw(){
  // draw some stuff
  screen.clearRect(0, 0, screen.canvas.width, screen.canvas.height);
  drawTracks(screen, data);
  drawButton(screen, data.step, data.tracks.length, "orange");  
  requestAnimationFrame(draw); 
})(); 

function isPointInButton(p, column, row){
  let b = buttonPosition(column, row); 
  return !(p.x < b.x || p.y < b.y || p.x > b.x + BUTTON_SIZE || p.y > b.y + BUTTON_SIZE); 
}

// EVENT HANDLERS // 
(function setupButtonClicking(){
  addEventListener("click", function(e){
    let p = {x: e.clientX, y: e.clientY}; 
    data.tracks.forEach(function(track, row){
    track.steps.forEach(function(on, column){
      if (isPointInButton(p, column, row)) {
        track.steps[column] = !on;
        }
      });
    });
  });
})();


note(audio, 440)();
























