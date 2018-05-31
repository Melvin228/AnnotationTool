riot.tag2('actionbar', '', '', '', function(opts) {
});
riot.tag2('facepp', '', '', '', function(opts) {
});
riot.tag2('images-slider', '<div class="float-left" style="width: 50px; height: 100%; text-align: center; padding: 10px; border-left: 1px solid grey;"> <label class="btn-bs-file"> <img class="file-input-icon" src="img/icons/files-white.png"> <input type="file" class="filebutton" accept="image/*" onchange="{readImageFiles}" multiple> </label> <label class="btn-bs-file"> <img class="file-input-icon" src="img/icons/open.png"> <input type="file" id="image_folder" webkitdirectory mozdirectory msdirectory odirectory directory onchange="readImageFiles(this)"> </label> </div> <div class="float-left left-paddle " style="width: 50px; height: 100%;" onclick="{slideleft}"></div> <div class="float-left photolist-wrapper " style="width: calc(100% - 160px); height: 100%;"> <div name="photolist" class="photolist"> <img each="{this.thumbnails}" riot-src="{src}" label="{name}" title="{name}" width="{this.thumbnailWidth}" onclick="{loadIntoWorkArea}"> </div> </div> <div class="right-paddle" style="width: 50px; height: 100%;" onclick="{slideright}"></div>', '', '', function(opts) {
        tag = this;
        tag.readImageFiles = readImageFiles;
        tag.readImageFile = readImageFile;
        tag.slideleft = slideleft;
        tag.slideright = slideright;
        tag.deleteThumbnail = deleteThumbnail;
        tag.loadIntoWorkArea = loadIntoWorkArea;

        function readImageFiles(e) {
            var input = e.srcElement;
            if (input.files && input.files[0]) {
                for(i=0;i<input.files.length;i++){
                    this.readImageFile(input.files[i]);
                }
            }
        }
        this.thumbnails = [];
        this.thumbnailWidth= this.opts.thumbnail_width || "80px"
        function readImageFile(f) {
            if(f.type.startsWith("image")){
                var reader = new FileReader();
                reader.onload = e => {
                    var imgData = {
                        name : f.name,
                        src: e.target.result
                    };
                    updateDimentions(e.target.result,imgData);
                    this.thumbnails.push(imgData);
                    this.trigger("uploadimages");
                }
                reader.onloadend = e => {
                    this.update();
                }
                reader.readAsDataURL(f);
            }
        }

        function updateDimentions(imgFileSrc, imageDataObject){
            var img = new Image();
            img.onload = function() {
                imageDataObject.size = {
                    width : this.width,
                    height : this.height
                }
            };
            img.src = imgFileSrc;
        }

        this.sliding = false;
        this.sliderMove = "80px";
        function slideleft(e) {
            var photolist = $(e.target.nextElementSibling.children[0]);
            if (this.sliding === false) {
                this.sliding = true;
                photolist.css({ left: "-"+this.sliderMove })
                    .prepend(photolist.children('img:last-child'))
                    .animate({ left: 0 }, 200, 'linear', () => {
                        this.sliding = false;
                    });
            }
        };
        function slideright(e) {
            var photolist = $(e.target.previousElementSibling.children[0]);
            if (this.sliding === false) {
                this.sliding = true;
                photolist.animate({ left: "-"+this.sliderMove }, 200, 'linear', () => {
                    photolist.css({ left: 0 })
                        .append(photolist.children('img:first-child'));
                    this.sliding = false;
                });
            }
        };

        function deleteThumbnail(e){
            var thumbnail = $(e.target.nextElementSibling);
            for(var thumbnail_i in this.thumbnails){
                if(this.thumbnails[thumbnail_i].name === $(thumbnail[0]).attr("title")){
                    this.thumbnails.splice(thumbnail_i,1);
                    break;
                }
            }
            this.update();
        }

        function loadIntoWorkArea(e){
            riot.mount("workarea",{ img : e.item});
        }
});
riot.tag2('menu', '', '', '', function(opts) {
});
riot.tag2('statusbar', '', '', '', function(opts) {
});
riot.tag2('toolbox', '<div each="{tool,toolid in tools[opts.tools]}" id="{toolid}" class="tool-button" onclick="{selectme}"> <img class="tool-icon" riot-src="img/icons/{tool.icon}"> <div>{tool.title}</div> </div>', 'toolbox .tool-button,[data-is="toolbox"] .tool-button{ text-align: center; margin: 14px 0px; font-size: 0.9em; } toolbox .tool-icon,[data-is="toolbox"] .tool-icon{ width: 40%; margin: 3px 0px; } toolbox .tool-selected,[data-is="toolbox"] .tool-selected{ background: coral; } toolbox .tool-button:not(.tool-selected):hover,[data-is="toolbox"] .tool-button:not(.tool-selected):hover{ background: grey; }', '', function(opts) {

        var tag = this;

        tag.selectme = function (e){

            $(".tool-selected").removeClass("tool-selected");
            $(e.currentTarget).addClass("tool-selected");
            selectedTool = tools[opts.tools][e.item.toolid];

        }
});

riot.tag2('workarea', '<div id="canvas-container"> <img id="img" riot-src="{opts.img.src}" width="{opts.img.size.width}" height="{opts.img.size.height}"> <div id="work-canvas" width="{opts.img.size.width}" height="{opts.img.size.height}"></div> <span id="tooltip-span"></span> <div id="v_line"></div> <div id="h_line"></div> </div>', 'workarea #work-canvas,[data-is="workarea"] #work-canvas{ position: absolute; z-index: 1; } workarea #canvas-container,[data-is="workarea"] #canvas-container{ height: calc(100vh - 150px); display: block; overflow: auto; position: relative; }', '', function(opts) {
        $(document).on('click', function(event){
            deselectAll();
            selectedLabels = [];
        });

        $(document).keyup(function(e){
            if(e.keyCode == 46){
                selectedLabels.forEach(el => {
                    $("[for="+ el.node.id+"]").remove();
                    el.selectize(false, {deepSelect:true})
                    el.parent().remove();
                    el.remove();
                });

                selectedLabels = [];

            }else if(e.keyCode == 65 && e.shiftKey){

                selectAll();
            }else if(e.keyCode == 65){

            }

        });

        this.on('mount',function() {

            myCanvas = new SVG('work-canvas').size(opts.img.size.width, opts.img.size.height);

            myCanvas.on('mousedown', function(event){
                deselectAll();
                if(selectedTool && selectedTool.type !== "point" && !alreadyDrawing && selectedTool.drawable){
                    var currentTool = selectedTool.create(event,myCanvas);

                    currentTool.on('drawstart', function(){
                        alreadyDrawing = true;
                    });

                    currentTool.on('drawcancel', function(){
                        console.log("canceled")
                    });
                    currentTool.on('drawstop', function(){
                        alreadyDrawing = false;
                        if( !selectedTool.validate(currentTool)){
                            currentTool.parent().remove();
                            currentTool.remove();
                        }else{
                            currentTool.parent().on("click", function(e) {
                                if(selectedTool.type === "point"){
                                    var point = selectedTool.create(e,currentTool);
                                    point.attr({
                                        for: currentTool.node.id
                                    })
                                    point.on("click", function(e) {
                                        if(!e.ctrlKey){
                                            deselectAll();
                                        }
                                        point.selectize({ rotationPoint: false});
                                        selectedLabels.push(point);
                                        e.stopPropagation();
                                    });
                                }else if(e.altKey){
                                        deselectAll();
                                        currentTool.selectize({ rotationPoint: false, deepSelect:true});
                                        selectedLabels.push(currentTool);
                                }else{
                                    if(!e.ctrlKey){
                                        deselectAll();
                                    }

                                    currentTool.selectize({ rotationPoint: false});
                                    selectedLabels.push(currentTool);
                                }
                                e.stopPropagation();
                            });
                        }
                    });

                    currentTool.draw(event);
                    selectedElement = currentTool;
                }
            });
            myCanvas.on('mouseup', function(event){
                if(selectedTool && selectedElement)   selectedElement.draw(event);
            });

        } );

        function deselectAll(){
            selectedLabels.forEach(el => {
                el.selectize(false, {deepSelect:true});
                el.selectize(false);
            });
            selectedLabels = [];
        }

        function selectAll(){
            myCanvas.each(function(i,shapeEl){
                shapeEl.forEach(function(el){
                    el.selectize({rotationPoint: false});
                    selectedLabels.push(el);
                })
            });
        }
});