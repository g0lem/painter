window.onload = function() {

    var canvas = document.getElementById('mainCanvas');
    var context = canvas.getContext('2d');
    var color = document.getElementById('color').value;
    console.log(color);

    var cellWidth = 10;
    var cellHeight = 10;

    //converts a hex color string into a rgba array
    function hexToRGB(hex, alpha=255) {
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
    var getIndex = function({x,y}){
        return 4 * (x + y * 800);
    };

    //gets mouse (x,y) coordonates in the canvas
    var getMousePosition = function(event) {
        var rect = canvas.getBoundingClientRect();
        return {
            x: event.clientX - rect.left,
            y: event.clientY - rect.top
        };
    };


    var processMousePosition = function(obj){


    }

    var colorCell = function(obj){

        

    }

    //updates the canvas
    var draw = function(event){

        var mousePos = getMousePosition(event);
        var imageData = context.getImageData(mousePos.x,mousePos.y,mousePos.x+1,mousePos.y+1);
        var index = getIndex(mousePos);
        var color = hexToRGB(document.getElementById('color').value);

        imageData.colorPixel(color);
        context.putImageData(imageData, mousePos.x, mousePos.y);
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
        var boxSize = {
            x: 60,
            y: 60
        };
        for(var i = 0; i<numberOfBoxes; i++){
            for(var j = 0; j<numberOfBoxes; j++){
                context.beginPath();
                context.lineWidth=1;
                context.strokeStyle="black";
                context.rect(i*boxSize.y,j*boxSize.x,(i+1)*boxSize.y,(j+1)*boxSize.x);
                context.stroke();
            }
        }
    })();

};