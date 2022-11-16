function FadingEillipse(x,y,initalSize,r,g,b,br,bg,bb,step){
  push();
  noFill();
  strokeWeight(3);
    for(var fading=0;fading<initalSize;fading=fading+1){
      // let colorFadingR=fading*step;
      // let colorFadingG=fading*step;
      // let colorFadingB=fading*step;
      // if(r>br){
      //   if(colorFadingR>(r-br)){
      //   colorFadingR=(r-br);
      //   }
      // }else{
      //   colorFadingR=colorFadingR*-1
      //   if(colorFadingR<(r-br)){
      //   colorFadingR=(r-br);
      //   }
      // }

      // if(g>bg){
      //   if(colorFadingG>(g-bg)){
      //   colorFadingG=(g-bg);
      //   }
      // }else{
      //   colorFadingG=colorFadingG*-1
      //   if(colorFadingG<(g-bg)){
      //   colorFadingG=(g-bg);
      //   }
      // }
      
      // if(b>bb){
      //   if(colorFadingB>(b-bb)){
      //   colorFadingB=(b-bb);
      //   }
      // }else{
      //   colorFadingB=colorFadingB*-1
      //   if(colorFadingB<(b-bb)){
      //   colorFadingB=(b-bb);
      //   }
      // }
      stroke(r,g,b,255-fading*step);
      var fadingSize=initalSize-3*fading;
      if(fadingSize>0&&(255-fading*step)>0){
        ellipse(x,y,fadingSize,fadingSize);
      }
    }
 
  pop();
}