<template>
  <div class="imglab">
    <prompt-restore></prompt-restore>
    <div class="container-fluid">
      <div id="menubar" class="row overlay-color align-items-center">
        <div class="col-3 col-sm-2 col-md-1 col-xl-1 no-pl">
          <app-menu></app-menu>
        </div>
        <div class="col-6 col-sm-6 col-md-7 col-xl-7 text-center">
          <!-- form-inline input-group -->
          <div class="row justify-content-center align-content-center">
            <a href="https://github.com/NaturalIntelligence/imglab">
			        <img src="./assets/imglab_logo.png" height="48px" style="margin-top: 2px">
              <span style="font-size: 2em; margin-top:5px;">Img Lab</span>
  					</a>
          </div>
        </div>
        <div class="col-3 col-sm-4 col-md-4 col-xl-4">
          <div class="form-inline flex-row-reverse float-right">
            <!-- <a class="btn btn-info" onclick="javascript:displayDonationPrompt()" style="margin: 0px 10px;">Donate</a> -->
            <!-- <shortcuts class="d-none d-md-block"></shortcuts>
            <plugins-menu class="d-none d-md-block"></plugins-menu> -->
          </div>
        </div>
      </div>
      <!-- End of Menubar -->
      <div class="row" style="height: 95vh">
        <div id="toolbar" class="col-1 overlay-color grey-border">
          <toolbox :toolType="LABEL_TAG"></toolbox>
          <toolbox :toolType="CANVAS_TAG" class="toolbox-border-top"></toolbox>
          <mouse-coord></mouse-coord>
        </div>
        <div class="col-9 base-color" style="height: 100%;">
          <div>
            <actionbar style="height: 10%"></actionbar>
          </div>
          <div style="height: 75%;">
            <workarea></workarea>
          </div>
          <div class="grey-border" style="height: 15%; width: 100%; margin: 0px 2px;">
            <image-slider thumbnail-width="90px"></image-slider>
          </div>
        </div>
        <div class="col-2 overlay-color grey-border">
          <label-panel style="flex: 1; overflow: auto;"></label-panel>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ActionBar from "./components/action-bar/action-bar";
import ToolBox from "./components/tools/toolbox";
import WorkArea from "./components/workarea/workarea";
import ImageSlider from "./components/image-slider/image-slider";
import LabelPanel from "./components/label-panel/label-panel";
import Menu from "./components/menu/menu";
import MouseCoord from "./components/mouse-coordinates/mouse-coordinates";
import PromptRestoreData from "./components/prompt-restore-data/restore-data";
import { LABEL_TAG, CANVAS_TAG } from "./utils/tool-names";

export default {
  components: {
    workarea: WorkArea,
    "image-slider": ImageSlider,
    toolbox: ToolBox,
    actionbar: ActionBar,
    "label-panel": LabelPanel,
    "app-menu": Menu,
    "prompt-restore": PromptRestoreData,
    "mouse-coord": MouseCoord
  },
  data() {
    return {
      LABEL_TAG,
      CANVAS_TAG
    };
  }
};
</script>

<style>
.imglab {
  height: 100vh;
}

.labelpolygon,
.labelcircle,
.labelbox {
  fill: yellow;
  stroke: green;
  stroke-width: 2px;
  fill-opacity: 0.1;
}

.svg_select_points {
  fill: black;
  fill-opacity: 0.1;
  stroke: grey;
}

.svg_select_points_point {
  cursor: move;
}

.svg_select_boundingRect {
  stroke-width: 1;
  fill: gray;
  stroke-dasharray: initial !important;
  stroke: #000;
  stroke-opacity: 0.8;
  fill-opacity: 0.1;
  pointer-events: none; /* This ons is needed if you want to deselect or drag the shape*/
}

#menubar {
  height: 5vh;
  min-height: 50px;
}
</style>
