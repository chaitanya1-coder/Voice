// Define our labelmap
const labelMap = {
  1:{name:'A', color:'white'},
  2:{name:'B', color:'white'},
  3:{name:'C', color:'white'},
  4:{name:'D', color:'white'},
  5:{name:'E', color:'white'},
  // 6:{name:'F', color:'white'},
  // 7:{name:'G', color:'white'},
  // 8:{name:'H', color:'white'},
  // 9:{name:'I', color:'white'},
  // 10:{name:'J', color:'white'},
  // 11:{name:'K', color:'white'},
  // 12:{name:'L', color:'white'},
  // 13:{name:'M', color:'white'},
  // 14:{name:'N', color:'white'},
  // 15:{name:'O', color:'white'},
  // 16:{name:'P', color:'white'},
  // 17:{name:'Q', color:'white'},
}

// Define a drawing function
export const drawRect = (boxes, classes, scores, threshold, imgWidth, imgHeight, ctx)=>{
  for(let i=0; i<=boxes.length; i++){
      if(boxes[i] && classes[i] && scores[i]>threshold){
          // Extract variables
          const [y,x,height,width] = boxes[i]
          const text = classes[i]
          
          // Set styling
          ctx.strokeStyle = labelMap[text]['color']
          ctx.lineWidth = 5
          ctx.fillStyle = 'white'
          ctx.font = '30px Arial'         
          
          // DRAW!!
          ctx.beginPath()
          ctx.fillText(labelMap[text]['name'] + ' - ' + Math.round(scores[i]*100)/100, x*imgWidth, y*imgHeight-10)
          ctx.rect(x*imgWidth, y*imgHeight, width*imgWidth/2, height*imgHeight/1.5);
          ctx.stroke()
      }
  }
}