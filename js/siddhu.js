(function (w) {
  function merge_options(obj1,obj2){
    var obj3 = {};
    for (var attrname in obj1) { obj3[attrname] = obj1[attrname]; }
    for (var attrname in obj2) { obj3[attrname] = obj2[attrname]; }
    return obj3;
  }

  w.siddhu = function (config) {
    var options = merge_options({
      quotes: [
        "Experience is like a comb that life gives you when you are bald.",
        "This quote was made after Ganguly called Dravid for a run and midway sent him back and Dravid was run out in the third test against the West Indies at Barbados.'Ganguly has thrown a drowning man both ends of the rope.'",
        "Sri Lankan score is running like an Indian taximeter.",
        "Statistics are like miniskirts, they reveal more than what they hide.",
        "Wickets are like wives - you never know which way they will turn!",
        "He is like Indian three-wheeler, which will suck a lot of diesel but cannot go beyond 30!",
        "The Indians are going to beat the Kiwis! Let me tell you, my friend that the Kiwi is the only bird in the whole world, which does not have wings!",
        "As uncomfortable as a bum on a porcupine.",
        "The ball whizzes past like a bumble -bee and the Indians are in the sea.",
        "The Indians are finding the gaps like a pin a haystack.",
        "The pitch is as dead as a dodo.",
        "Deep Dasgupta is as confused as a child is in a topless bar!",
        "The way Indian wickets are falling reminds of the cycle stand at Rajendra Talkies in Patiala one falls and everything else falls!",
        "Indian team without Sachin is like giving Kiss without a Squeeze.",
        "You cannot make Omelets without breaking the eggs.",
        "Deep Dasgupta is not a Wicket Keeper, he is a goalkeeper. He must be given a free transfer to Manchester United.",
        "He will fight a rattlesnake and give it the first two bites too.",
        "One, who doesn't throw the dice, can never expect to score a six.",
        "This quote was made after Eddie Nichols, the third umpire, ruled Shivnarine Chanderpaul 'NOT OUT' in the second test at Port of Spain T&T 'Eddie ichols is a man who cannot find his own buttocks with his two hands.'",
        "Anybody can pilot a ship when the sea is calm.",
        "Nobody travels on the road to success without a puncture or two.",
        "You got to choose between tightening your belt or losing your pants.",
        "The cat with gloves catches no mice.",
        "Age has been perfect fire extinguisher for flaming youth.",
        "You may have a heart of gold, but so does a hard-boiled egg.",
        "He is like a one-legged man in a bum kicking competition.",
        "The third umpires should be changed as often as nappies and for the same reason.",
        "Kumble's bowling at the moment is flat as a Dosa."],
      duration: null
    }, config || {});

    (function siddhuCommentry() {
      var time = options.duration || Math.round(Math.random() * (3000 - 500)) + 500;

      setTimeout(function() {
        alert(options.quotes[Math.floor(Math.random() * options.quotes.length)]);
        siddhuCommentry();
      }, time);
    }());
  };
})(window);