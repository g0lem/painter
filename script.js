//load the script in the <head> tag, but only load it after everything on the page has rendered
window.onload = function() {

    var canvas = document.getElementById('mainCanvas');
    var context = canvas.getContext('2d');

    //it's supposed not to have anti aliasing, so it won't look terrible
    context.imageSmoothingEnabled = false;

    var cellWidth = 60;
    var cellHeight = 30;

    //converts a hex color string into a rgba array
    var hexToRGB = function(hex, alpha=255) {
        var r = parseInt(hex.slice(1, 3), 16);
        var g = parseInt(hex.slice(3, 5), 16);
        var b = parseInt(hex.slice(5, 7), 16);

        return [r,g,b,alpha];
    }

    //colors a pixel on the canvas
    ImageData.prototype.colorPixel = function(color=[0,0,0,255], index = 0){
        for(var i=0;i<color.length;i++){
            this.data[index+i] = color[i];
        }
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


    var roundUpMousePosition = function(position){
        position.x = Math.floor(position.x/cellWidth)*cellWidth;
        position.y = Math.floor(position.y/cellHeight)*cellHeight;
        return position;
    }

    var colorCell = function(position, imageData){
        var color = hexToRGB(document.getElementById('color').value);
        for(var i=0; i<=cellHeight; i++){
            for(var j=0; j<=cellWidth; j++){
                imageData.colorPixel(color, getIndex(position.x + j, position.y + i));
            }
        }
        return imageData;
    }

    //updates the canvas
    var draw = function(event){
        var mousePos = roundUpMousePosition(getMousePosition(event));
        var imageData = context.getImageData(0,0,canvas.offsetWidth,canvas.offsetHeight);
        var color = hexToRGB(document.getElementById('color').value);
        //imageData.colorPixel(color);
        context.putImageData(colorCell(mousePos, imageData), 0, 0);
    }

    var drawBackUp = function(event){
        var mousePos = roundUpMousePosition(getMousePosition(event));
        var imageData = context.getImageData(mousePos.x,mousePos.y,mousePos.x+cellWidth,mousePos.y+cellHeight);
        var color = hexToRGB(document.getElementById('color').value);
        //imageData.colorPixel(color);
        context.putImageData(colorCell(mousePos, imageData), mousePos.x, mousePos.y);
    }



    canvas.addEventListener('mousemove', function (event) {
        //if a mouse button is clicked
        if(event.buttons != 0){
            draw(event);
        }
    });

    canvas.addEventListener('click', draw);

    (function(){
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
    })();

};