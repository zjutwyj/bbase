'use strict';
/**
 * @description 模块功能说明
 * @class BbasePhotoGallery
 * @author yongjin<zjut_wyj@163.com> 2016/2/6
 */
define('BbasePhotoGallery', [], function(require, exports, module){
  var BbasePhotoGallery, template;

  template = `
    <div class="BbasePhotoGallery-wrap bbase-component-photogallery">
    <main class="om-main-container-gallery" ng-switch="$ctrl.mediaType === 'image' &amp;&amp; $ctrl.items.length === 0">
      <div class="om-main" data-hook="om-items-display" aria-hidden="false">
        <div class="om-main-header" ng-switch="$ctrl.mediaType">
          <span data-hook="om-subtitle">拖动可自由排序.</span>
          <!---->
          <!---->
          <!---->
          <!---->
        </div>
        <!---->
        <!---->
        <div class="om-items-list" data-hook="om-active-container" dnd-drop="$ctrl.move(index, item)" dnd-horizontal-list="true" dnd-list="$ctrl.items" ng-switch-when="false" ng-switch="$ctrl.viewMode">
          <!----><!----><image-item class="media-item image-item" data-hook="om-media-item" dnd-draggable="item" dnd-effect-allowed="move" index="$index" item="item" ng-click="$ctrl.selected = item" ng-repeat="item in $ctrl.items track by item.relativeUri" ng-selected="item === $ctrl.selected" ng-switch-when="image" on-remove="$ctrl.makeInactive(item)" role="button" tabindex="0" draggable="true" selected="selected"><figure>
  <span class="image-container">
    <img ng-src="https://static.wixstatic.com/media/82bfd7c2e34943aaa52cc61663ea59b0.jpg_srz_p_120_120_75_22_0.50_1.20_0.00_jpg_srz" src="https://static.wixstatic.com/media/82bfd7c2e34943aaa52cc61663ea59b0.jpg_srz_p_120_120_75_22_0.50_1.20_0.00_jpg_srz">
  </span>
  <figcaption class="item-media-label" data-hook="om-item-index">1</figcaption>
  <div class="item-media-menu">
    <image-preview-popup data-hook="om-image-preview-popup-target" item="$ctrl.item"><div class="om-image-preview-popup-button" data-hook="om-image-preview-popup-button" ng-mouseenter="$ctrl.showPopup()" ng-mouseleave="$ctrl.removePopup()">
  <div ng-transclude="">
      <div class="menu-item" data-hook="om-image-preview-popup-icon">
        <svg class="bm-icon" height="16px" version="1.1" viewBox="0 0 16 16" width="16px" xmlns:sketch="http://www.bohemiancoding.com/sketch/ns" xmlns="http://www.w3.org/2000/svg">
          <g fill-rule="evenodd" fill="none" sketch:type="MSPage" stroke-width="1" stroke="none">
            <path d="M8,5 L7,5 L7,7 L5,7 L5,8 L7,8 L7,10 L8,10 L8,8 L10,8 L10,7 L8,7 L8,5 L8,5 Z M12.646,11.895 C13.711,10.675 14.262,9.167 14.262,7.469 C14.262,3.718 11.221,0.677 7.469,0.677 C3.718,0.677 0.677,3.718 0.677,7.469 C0.677,11.221 3.718,14.262 7.469,14.262 C9.159,14.262 10.733,13.746 11.958,12.697 L14.938,15.677 L15.677,14.938 L12.646,11.895 L12.646,11.895 Z M7.469,13.217 C4.3,13.217 1.722,10.639 1.722,7.469 C1.722,4.3 4.3,1.722 7.469,1.722 C10.639,1.722 13.217,4.3 13.217,7.469 C13.217,10.639 10.639,13.217 7.469,13.217 L7.469,13.217 Z" fill="#FFFFFF" id="L_Zoom-In" sketch:type="MSShapeGroup"></path>
          </g>
        </svg>
      </div>
    </div>
</div>
</image-preview-popup>
    <div cc-tooltip-position="top" cc-tooltip="remove_image" class="menu-item tooltipstered" data-hook="om-make-inactive" ng-click="$ctrl.onRemove({item: $ctrl.item})" role="button" tabindex="0">
      <svg height="15px" viewBox="0 0 13 15" width="13px">
        <g fill-rule="evenodd" fill="none" stroke-width="1" stroke="none">
          <path d="M4,11 L5,11 L5,5 L4,5 L4,11 Z M8,11 L9,11 L9,5 L8,5 L8,11 Z M6,11 L7,11 L7,5 L6,5 L6,11 Z M9,2 L9,1.5 C9,0.701 8.248,0 7.392,0 L5.525,0 C4.684,0 4,0.673 4,1.5 L4,2 L0,2 L0,3 L1,3 L1,12 C1,13.657 2.343,15 4,15 L9,15 C10.657,15 12,13.657 12,12 L12,3 L13,3 L13,2 L9,2 L9,2 Z M5,1.5 C5,1.229 5.24,1 5.525,1 L7.392,1 C7.693,1 8,1.252 8,1.5 L8,2 L5,2 L5,1.5 L5,1.5 Z M11,12 C11,13.105 10.105,14 9,14 L4,14 C2.895,14 2,13.105 2,12 L2,3 L11,3 L11,12 L11,12 Z" fill="#FFFFFF"></path>
        </g>
      </svg>
    </div>
  </div>
</figure>
</image-item><!----><!---->
          <!---->
          <!----><add-more-button data-hook="om-open-media-gallery" dnd-nodrag="" item-type="images" ng-click="$ctrl.openMediaGallery()" ng-if="$ctrl.mediaType === 'image' &amp;&amp; $ctrl.selectionMode === 'gallery'" role="button" tabindex="0" draggable="true"><div class="om-add-more-button media-item image-item">
  <figure>
    <div class="om-add-more-button-container">
      <div class="om-add-more-button-plus">+</div>
      <div class="om-add-more-button-text bold">Add More</div>
      <div class="om-add-more-button-text">images</div>
    </div>
  </figure>
</div>
</add-more-button><!---->
        </div><!---->
      </div>


<aside class="om-main-details" ng-switch-when="false" ng-switch="$ctrl.viewMode">
        <!---->
        <!----><image-item-details class="om-item-details" item="$ctrl.selected" link-details-handler="$ctrl.linkDetailsHandler" ng-switch-when="image" on-next="$ctrl.next()" on-prev="$ctrl.prev()" show-carousel-nav="$ctrl.items.length > 1 &amp;&amp; $ctrl.selected"><cc-panel-frame data-hook="om-item-details-panel" label="图片设置" aria-hidden="false"><div class="cc-panel-frame cc-container" ng-class="{ '-with-p18-footer': $ctrl.hasFooter() }">
  <p16-panel-header data-hook="panel-header" help-tooltip="" label="图片设置" number="" on-close="$ctrl.onClose()" on-help="$ctrl.onHelp()" on-return="$ctrl.onReturn()" show-close-button="$ctrl.showCloseButton" show-help-button="$ctrl.showHelpButton" show-return-button="$ctrl.showReturnButton"><div class="p16-panel-header">
  <div class="cc-headline">
    <div class="cc-aux-menu -left">
      <!---->
    </div>
    <span data-hook="label">图片设置</span>
    <!---->
    <div class="cc-aux-menu -right">
      <!---->
      <!---->
      <!---->
    </div>
  </div>
</div>
</p16-panel-header>
  <!---->
  <!----><ng-transclude cc-scrollbar="" cc-scrollbar-disable="" class="cc-panel-body cc-scrollbar ps-container ps-theme-default" data-hook="default-transclude" ng-class="{'scroll-disabled': $ctrl.scrollDisabled}" ng-if="!$ctrl.usesPanelBody()" data-ps-id="ea710df4-ff5e-d252-a85c-3eaf9234d0fe">
  <div class="om-carousel-label">
    <div class="p8-label">预览</div>
  </div>
  <image-carousel data-hook="om-image-carousel" item="$ctrl.item" on-next="$ctrl.onNext()" on-prev="$ctrl.onPrev()" show-nav="$ctrl.showCarouselNav"><div class="om-image-carousel-current">
  <!----><c4-media-preview media="[$ctrl.getItemForMediaPreview($ctrl.item)]" ng-if="$ctrl.item !== null" no-hover="true" show-edit-panel="false" show-tabs="false"><div class="c4-media-preview -active" data-hook="container" ng-class="{ '-active': $ctrl.active }">

  <div class="c4-preview-wrapper" data-hook="preview-content" ng-mouseenter="$ctrl.hoveringEditPanel = true;" ng-mouseleave="$ctrl.hoveringEditPanel = false;" ng-show="$ctrl.active" style="width:100%" aria-hidden="false">
    <!----><img alt="Blue Nails on Green" class="preview is-image" data-hook="single-image-thumb" ng-if="$ctrl.imageSelected" ng-src="https://static.wixstatic.com/media/82bfd7c2e34943aaa52cc61663ea59b0.jpg_srz_p_240_144_75_22_0.50_1.20_0.00_jpg_srz" title="Blue Nails on Green - 2134x1354px" src="https://static.wixstatic.com/media/82bfd7c2e34943aaa52cc61663ea59b0.jpg_srz_p_240_144_75_22_0.50_1.20_0.00_jpg_srz"><!---->
    <!---->
    <!---->
    <!---->
    <!---->
    <!---->
    <div class="c4-overlay preview ng-hide" ng-show="!$ctrl.noHover &amp;&amp; ($ctrl.showEditPanel || $ctrl.hoveringEditPanel)" aria-hidden="true">
      <!----><div class="c4-overlay-default-buttons" ng-if="!$ctrl.gallerySelected"><!----><button class="p9c-primary cc-x-height" data-hook="replace-menu" ng-class="{'-disabled': $ctrl.disableMediaChangeButton}" ng-click="$ctrl.replaceMedia()" ng-disabled="$ctrl.disableMediaChangeButton" ng-if="$ctrl.replaceButtonText != &quot;&quot;"><span class="cc-x-height font-t2" ng-bind-html="$ctrl.replaceButtonText">Replace</span></button><!----><button class="p9c-primary -icon-only" data-hook="crop-menu" ng-click="$ctrl.onCrop()" ng-show="$ctrl.imageSelected &amp;&amp; $ctrl.imageCrop" aria-hidden="false"><i cc-tooltip-position="top" cc-tooltip="crop" class="cc-icon-circle cc-icon-crop tooltipstered"></i></button><!----></div><!---->
      <!---->
    </div>
  </div>
  <p17-divider class="cc-hidden-marker"><hr class="p17-divider" ng-class="{ 'shorter-divider': $ctrl.shorterDivider}">
</p17-divider>
</div>
</c4-media-preview><!---->
  <!---->
  <!---->
</div>
</image-carousel>
  <c2-text-input data-hook="om-item-details-title" disable-toggle="true" is-disabled="$ctrl.item === null" label="Title (alt text)" on-change-value="$ctrl.onTitleChange(value)" placeholder="'Add your title here'" value="$ctrl.item.Title"><div class="c2-text-input -active" data-hook="container" ng-class="{ '-active': $ctrl.active, '-suggestions-visible': $ctrl.showMediaAutocomplete &amp;&amp; $ctrl.matchCount > 0 || $ctrl.showTextAutocomplete, '-prefixed': $ctrl.prefix, '-c2e': ($ctrl.showIcon || $ctrl.showButton) }">
  <p6-control-header active="$ctrl.active" data-hook="p6-control-header" help-tooltip="" hide-toggle-button="$ctrl.disableToggle" label="$ctrl.label" on-help="$ctrl.onHelp()" on-toggle="$ctrl.toggle()" show-help-button="$ctrl.showHelpButton"><div class="p8-label" data-hook="control-header-container" ng-class="{ '-toggleable': !$ctrl.hideToggleButton }" ng-click="$ctrl.toggle($event)" role="button" tabindex="0">
  <div cc-tooltip="" class="p8-label-text" data-hook="label">
    Title (alt text)
  </div>
  <div class="cc-aux-menu">
    <button cc-tooltip-position="top" cc-tooltip="" class="cc-aux-btn ng-hide" data-hook="help-button" ng-click="$ctrl.onHelp()" ng-show="$ctrl.showHelpButton" aria-hidden="true">
      <i class="cc-icon-info"></i>
    </button>
    <button cc-tooltip="hide_item" class="cc-aux-btn tooltipstered ng-hide" data-hook="toggle-button" data-name="toggle-button" ng-hide="$ctrl.hideToggleButton" aria-hidden="true">
      <i data-hook="toggle-icon" ng-class="$ctrl.active ? 'cc-icon-show' : 'cc-icon-hide'" class="cc-icon-show"></i>
    </button>
    <!---->
  </div>
</div>
</p6-control-header>
  <div class="cc-action" ng-class="{ '-long': $ctrl.long }">
    <!---->
    <p1-text-input change-value-on-blur="$ctrl.changeValueOnBlur" data-hook="p1-text-input" debounce-delay="$ctrl.debounceDelay" focused="$ctrl.focused" is-disabled="$ctrl.isDisabled" is-show-validator-error="$ctrl.isShowValidatorError" long="$ctrl.long" max-length="" ng-keydown="$event.stopPropagation()" on-blur="$ctrl.onInputBlur($event)" on-change-value="$ctrl.onChange(value)" on-focus="$ctrl.onInputFocus($event)" on-keyup="$ctrl.onKeyUp($event)" on-submit="$ctrl.onSubmit()" placeholder="$ctrl.placeholder" validation="$ctrl.validation" value="$ctrl.value"><!----><input cc-select-on-focus="true" class="p1-input short cc-ellipsis ng-pristine ng-valid ng-not-empty ng-valid-maxlength ng-touched" data-hook="text-input" focus-delay="500" focus-if="$ctrl.focused" maxlength="" ng-blur="$ctrl.onBlur({ $event: $event })" ng-change="$ctrl.onChange()" ng-class="{ 'text-invalid': !$ctrl.isInputValid(), 'unselectable': $ctrl.isDisabled }" ng-disabled="$ctrl.isDisabled" ng-focus="$ctrl.onFocus({ $event: $event })" ng-if="!$ctrl.long" ng-keyup="$ctrl.onTextKeyUp($event)" ng-model-options="$ctrl.modelOptions" ng-model="$ctrl.value" placeholder="Add your title here" aria-invalid="false" style=""><!---->
<!---->
<!---->
<p17-divider class="cc-control-divider" shorter-divider="!$ctrl.isInputValid() &amp;&amp; !!$ctrl.validationTooltip"><hr class="p17-divider" ng-class="{ 'shorter-divider': $ctrl.shorterDivider}">
</p17-divider>
</p1-text-input>
    <!---->
    <!---->
    <!---->
    <!---->
  </div>
  <p17-divider ng-class="{'cc-hidden-marker': !$ctrl.showIcon &amp;&amp; !$ctrl.showButton}" class="cc-hidden-marker"><hr class="p17-divider" ng-class="{ 'shorter-divider': $ctrl.shorterDivider}">
</p17-divider>
</div>
</c2-text-input>
  <c2-text-input data-hook="om-item-details-description" disable-toggle="true" is-disabled="$ctrl.item === null" label="Description" on-change-value="$ctrl.onDescriptionChange(value)" placeholder="'Describe your image'" value="$ctrl.item.Description"><div class="c2-text-input -active" data-hook="container" ng-class="{ '-active': $ctrl.active, '-suggestions-visible': $ctrl.showMediaAutocomplete &amp;&amp; $ctrl.matchCount > 0 || $ctrl.showTextAutocomplete, '-prefixed': $ctrl.prefix, '-c2e': ($ctrl.showIcon || $ctrl.showButton) }">
  <p6-control-header active="$ctrl.active" data-hook="p6-control-header" help-tooltip="" hide-toggle-button="$ctrl.disableToggle" label="$ctrl.label" on-help="$ctrl.onHelp()" on-toggle="$ctrl.toggle()" show-help-button="$ctrl.showHelpButton"><div class="p8-label" data-hook="control-header-container" ng-class="{ '-toggleable': !$ctrl.hideToggleButton }" ng-click="$ctrl.toggle($event)" role="button" tabindex="0">
  <div cc-tooltip="" class="p8-label-text" data-hook="label">
    Description
  </div>
  <div class="cc-aux-menu">
    <button cc-tooltip-position="top" cc-tooltip="" class="cc-aux-btn ng-hide" data-hook="help-button" ng-click="$ctrl.onHelp()" ng-show="$ctrl.showHelpButton" aria-hidden="true">
      <i class="cc-icon-info"></i>
    </button>
    <button cc-tooltip="hide_item" class="cc-aux-btn tooltipstered ng-hide" data-hook="toggle-button" data-name="toggle-button" ng-hide="$ctrl.hideToggleButton" aria-hidden="true">
      <i data-hook="toggle-icon" ng-class="$ctrl.active ? 'cc-icon-show' : 'cc-icon-hide'" class="cc-icon-show"></i>
    </button>
    <!---->
  </div>
</div>
</p6-control-header>
  <div class="cc-action" ng-class="{ '-long': $ctrl.long }">
    <!---->
    <p1-text-input change-value-on-blur="$ctrl.changeValueOnBlur" data-hook="p1-text-input" debounce-delay="$ctrl.debounceDelay" focused="$ctrl.focused" is-disabled="$ctrl.isDisabled" is-show-validator-error="$ctrl.isShowValidatorError" long="$ctrl.long" max-length="" ng-keydown="$event.stopPropagation()" on-blur="$ctrl.onInputBlur($event)" on-change-value="$ctrl.onChange(value)" on-focus="$ctrl.onInputFocus($event)" on-keyup="$ctrl.onKeyUp($event)" on-submit="$ctrl.onSubmit()" placeholder="$ctrl.placeholder" validation="$ctrl.validation" value="$ctrl.value"><!----><input cc-select-on-focus="true" class="p1-input short cc-ellipsis ng-pristine ng-valid ng-empty ng-valid-maxlength ng-touched" data-hook="text-input" focus-delay="500" focus-if="$ctrl.focused" maxlength="" ng-blur="$ctrl.onBlur({ $event: $event })" ng-change="$ctrl.onChange()" ng-class="{ 'text-invalid': !$ctrl.isInputValid(), 'unselectable': $ctrl.isDisabled }" ng-disabled="$ctrl.isDisabled" ng-focus="$ctrl.onFocus({ $event: $event })" ng-if="!$ctrl.long" ng-keyup="$ctrl.onTextKeyUp($event)" ng-model-options="$ctrl.modelOptions" ng-model="$ctrl.value" placeholder="Describe your image" aria-invalid="false" style=""><!---->
<!---->
<!---->
<p17-divider class="cc-control-divider" shorter-divider="!$ctrl.isInputValid() &amp;&amp; !!$ctrl.validationTooltip"><hr class="p17-divider" ng-class="{ 'shorter-divider': $ctrl.shorterDivider}">
</p17-divider>
</p1-text-input>
    <!---->
    <!---->
    <!---->
    <!---->
  </div>
  <p17-divider ng-class="{'cc-hidden-marker': !$ctrl.showIcon &amp;&amp; !$ctrl.showButton}" class="cc-hidden-marker"><hr class="p17-divider" ng-class="{ 'shorter-divider': $ctrl.shorterDivider}">
</p17-divider>
</div>
</c2-text-input>
  <c5-link-input data-hook="om-item-details-link" disable-toggle="true" label="Link" link="$ctrl.linkAsILink" on-edit-link="$ctrl.openLinkEditor()"><div class="c5-link-input -active" data-hook="link-input" ng-class="{ '-active': $ctrl.active }" ng-mouseenter="$ctrl.setIsHover(true)" ng-mouseleave="$ctrl.setIsHover(false)">
  <p6-control-header active="$ctrl.active" help-tooltip="" hide-toggle-button="$ctrl.disableToggle" label="$ctrl.label" on-help="$ctrl.onHelp()" on-toggle="$ctrl.toggle()" show-help-button="$ctrl.showHelpButton"><div class="p8-label" data-hook="control-header-container" ng-class="{ '-toggleable': !$ctrl.hideToggleButton }" ng-click="$ctrl.toggle($event)" role="button" tabindex="0">
  <div cc-tooltip="" class="p8-label-text" data-hook="label">
    Link
  </div>
  <div class="cc-aux-menu">
    <button cc-tooltip-position="top" cc-tooltip="" class="cc-aux-btn ng-hide" data-hook="help-button" ng-click="$ctrl.onHelp()" ng-show="$ctrl.showHelpButton" aria-hidden="true">
      <i class="cc-icon-info"></i>
    </button>
    <button cc-tooltip="hide_item" class="cc-aux-btn tooltipstered ng-hide" data-hook="toggle-button" data-name="toggle-button" ng-hide="$ctrl.hideToggleButton" aria-hidden="true">
      <i data-hook="toggle-icon" ng-class="$ctrl.active ? 'cc-icon-show' : 'cc-icon-hide'" class="cc-icon-show"></i>
    </button>
    <!---->
  </div>
</div>
</p6-control-header>
  <p20-link data-hook="p20-link" is-hover="$ctrl.isHover" link="$ctrl.link" on-link-click="$ctrl.onEditLink({ link: link })"><div class="c5-link cc-action cc-x-height" data-hook="link" ng-class="{'hovered':$ctrl.isHover}" ng-click="$ctrl.onLinkClick({ link: $ctrl.link.value })" role="button" tabindex="0" style="">
  <span class="c5-link-label cc-x-height cc-ellipsis">
    <span class="cc-pointer" data-hook="linkDescription">Not Connected</span>
  </span>
  <!---->
  <!----><cc-svg-icon class="c5-link-negative-validation" icon="misc:negative-validation-outline" ng-if="!$ctrl.link.state &amp;&amp; !$ctrl.isHover"><svg data-hook="svg-icon" ng-class="[{'cc-svg-icon': $ctrl.addCcSvgIconClass, 'cc-svg-corner-icon': $ctrl.isCornerIcon, '-offhover': !!$ctrl.hoverIconData.name}, $ctrl.iconData.iconClass]" class="cc-svg-icon cc-svg-icon-negative-validation-outline">
                 <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#misc-negative-validation-outline"></use>
               </svg>
               <!---->
              </cc-svg-icon><!---->
</div>
<p17-divider class="cc-control-divider"><hr class="p17-divider" ng-class="{ 'shorter-divider': $ctrl.shorterDivider}">
</p17-divider>
</p20-link>
</div>
</c5-link-input>
<div class="ps-scrollbar-x-rail" style="left: 0px; bottom: 6px;"><div class="ps-scrollbar-x" tabindex="0" style="left: 0px; width: 0px;"></div></div><div class="ps-scrollbar-y-rail" style="top: 0px; right: 6px;"><div class="ps-scrollbar-y" tabindex="0" style="top: 0px; height: 0px;"></div></div></ng-transclude><!---->
  <!---->
  <!---->
</div>
</cc-panel-frame>
</image-item-details><!---->
        <!---->
      </aside>
      </main>
    </div>
  `;

  BbasePhotoGallery = BbaseView.extend({
    initialize: function(){
      this._super({
        template: template
      });
    },
    initData: function(){
      return {
      }
    }
  });

  module.exports = BbasePhotoGallery;
});