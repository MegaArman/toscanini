//The purpose of this class is to find basic information about music scores

class ScoreSearcher
{
  constructor(musicObj) //a JS object from xml2js
  {
    this.musicObj = musicObj;
    // console.dir(this.musicObj)
  }

  findPitches()
  {
    //called with every property and it's value
    function process(key,value)
    {
        if (key == 'pitch')
        {
          console.log(value);
        }
    }

    function traverse(musicObj,func)
    {
        for (var i in musicObj) {
            func.apply(this,[i, musicObj[i]]);
            if (musicObj[i] !== null && typeof(musicObj[i])=="object") {
                //going on step down in the object tree!!
                traverse(musicObj[i],func);
            }
        }
    }

    traverse(this.musicObj,process);
  }
}

module.exports = ScoreSearcher;
