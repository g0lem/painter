//load the script in the <head> tag, but only load it after everything on the page has rendered
window.onload = function() {

    var canvas = document.getElementById('mainCanvas');
    var context = canvas.getContext('2d');

    const defaultColor = [255,255,255,255]; //white, since you delete it with white
    var paintColor;                         //current brush color


    //declaring the elements for further use
    var widthInputElement = document.getElementById('width');
    var heightInputElement = document.getElementById('height');

    //setting the default values of the cells
    var cellWidth = widthInputElement.value;
    var cellHeight = heightInputElement.value;


    //update the cells if values change
    widthInputElement.onchange = function(){
        cellWidth = this.value;
    }

    heightInputElement.onchange = function(){
        cellHeight= this.value;
    }


    //converts a hex color string into a rgba array
    var hexToRGB = function(hex, alpha=255) {
        var r = parseInt(hex.slice(1, 3), 16);
        var g = parseInt(hex.slice(3, 5), 16);
        var b = parseInt(hex.slice(5, 7), 16);

        return [r,g,b,alpha];
    }

    //sees if two color arrays are alike
    var compareColors = function(color1, color2){
        for(var i=0; i<4; i++){
            if(color1[i] != color2[i]){
                return false;
            }
        }
        return true;
    }

    //colors a pixel on the canvas
    ImageData.prototype.colorPixel = function(color, index = 0){
        for(var i=0;i<color.length;i++){
            this.data[index+i] = color[i];  
        }
    }

    //get the color of a pixel of the canvas
    ImageData.prototype.getColor = function(index = 0){
        var color = [];
        for(var i=0;i<4;i++){
            color.push(this.data[index+i]);  
        }
        return color;
    }


    var colorCell = function(position, imageData, color){
        for(var i=0; i<cellHeight; i++){
            for(var j=0; j<cellWidth; j++){
                imageData.colorPixel(color, getIndex(position.x + j, position.y + i));
            }
        }
        return imageData;
    }

    //converts (x,y) coordonates into an index, since the data is an array
    var getIndex = function(x,y){
        return 4 * (x + y * canvas.offsetHeight);
    };

    //gets mouse (x,y) coordonates in the canvas
    var getMousePosition = function(event) {
        var rect = canvas.getBoundingClientRect();
        return {
            x: event.clientX - rect.left,
            y: event.clientY - rect.top
        };
    };

    // this rounds up the mouse coords to reflect the cell clicked
    var roundUpMousePosition = function(position){
        position.x = Math.floor(position.x/cellWidth)*cellWidth;
        position.y = Math.floor(position.y/cellHeight)*cellHeight;
        return position;
    }

    var evaluateProperColor = function(mousePos, imageData){
        var normalColor = hexToRGB(document.getElementById('color').value);
        var cellColor = imageData.getColor(getIndex(mousePos.x, mousePos.y));
        paintColor = compareColors(normalColor, cellColor) ? defaultColor : normalColor;
    }


    //this handles the color picking process and fills the current cell
    var onMouseDownEvent = function(event){
        var imageData = context.getImageData(0,0,canvas.offsetWidth,canvas.offsetHeight);
        var mousePos = roundUpMousePosition(getMousePosition(event));
        evaluateProperColor(mousePos,imageData);
        context.putImageData(colorCell(mousePos, imageData, paintColor), 0, 0);       
    }


    //this handles mouse movement and the coloring of the cells you run over
    var onMouseMoveEvent = function(event){
        var imageData = context.getImageData(0,0,canvas.offsetWidth,canvas.offsetHeight);
        var mousePos = roundUpMousePosition(getMousePosition(event));
        if(event.buttons != 0){
            context.putImageData(colorCell(mousePos, imageData, paintColor), 0, 0);
        }

    }

    canvas.addEventListener('mousemove', onMouseMoveEvent);

    canvas.addEventListener('mousedown', onMouseDownEvent);

/*    var drawBackUp = function(event){
        var mousePos = roundUpMousePosition(getMousePosition(event));
        var imageData = context.getImageData(mousePos.x,mousePos.y,mousePos.x+cellWidth,mousePos.y+cellHeight);
        var color = hexToRGB(document.getElementById('color').value);
        //imageData.colorPixel(color);
        context.putImageData(colorCell(mousePos, imageData), mousePos.x, mousePos.y);
    }*/

/*    (function(){
        var canvasSize = canvas.offsetWidth;
        var numberOfBoxes= 10;
        drawing = new Image() 
        drawing.src = "draw.png" 
        context.drawImage(drawing,0,0);
        for(var i = 0; i<canvas.offsetHeight/cellHeight; i++){
            for(var j = 0; j<canvas.offsetWidth/cellWidth; j++){
                context.beginPath();
                context.lineWidth=1;
                context.strokeStyle="black";
                context.rect(j*cellWidth,i*cellHeight,(j+1)*cellWidth,(i+1)*cellHeight);
                context.stroke();
            }
        }
    })();*/

};