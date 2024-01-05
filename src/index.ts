import {parse} from "@vue/compiler-dom"

const content =`<template>
<div class="forge-tool-box">
  <template>
    <div
      v-for="(item, index) of configTool"
      :key="index"
      :class="[index == configTool.length - 1 ? '' : 'item']"
    >
      <ForgeToolItem :max-size="false" :item="item" />
    </div>
  </template>
  <div v-if="false" class="measure">
    <template v-if="false">
      <aside class="toback">
        <span class="text" @click="changeprofile(false)">返回</span>
      </aside>
      <div
        v-for="(item, index) of configType == 'profile'
          ? profileConfig
          : measureConfig"
        :key="index"
        :class="[
          index ==
            (configType == 'profile' ? profileConfig : measureConfig).length - 1
            ? ''
            : configType == 'profile'
              ? 'list'
              : 'cl-item',
        ]"
      >
        <ForgeToolItem :max-size="true" :item="item" />
      </div>
    </template>
  </div>
  <section v-if="showSet" class="measure-set-box measure-set-box-test">
    <ModelTtle title="测量工具设置" :calcel-model="closeSet" />
    <article class="main">
      <div class="box">
        <aside class="text-title">
          单位类型
        </aside>
        <Select
          :value="unitType"
          style="width: 280px"
          @change="changeUnitType"
        >
          <SelectOption
            v-for="item of unitList"
            :key="item.id"
            :value="item.id"
          >
            {{ item.text }}
          </SelectOption>
        </Select>
      </div>
      <div class="box">
        <aside class="text-title">
          单位精度
        </aside>
        <Select
          :value="accuracyType"
          style="width: 280px"
          @change="changeaccuracyType"
        >
          <SelectOption
            v-for="(item, index) of accuracyList"
            :key="item"
            :value="index"
          >
            {{ item }}
          </SelectOption>
        </Select>
      </div>

      <aside class="box-bottom" style="margin-bottom: 5px">
        <span class="text-title">隔离测量构件</span>
        <ASwitch :checked="isAccuracy" @click="changeisAccuracy" />
      </aside>
      <aside class="box-bottom">
        <span class="text-title">启用自由测量</span>
        <ASwitch :checked="isFree" @click="changeisFree" />
      </aside>
    </article>
  </section>
  <section
    v-if="isShowOther"
    class="other-box"
    :style="{ left: activeClickInfo.viewType == '3d' ? '250px' : '115px' }"
  >
    <div class="icon-top"></div>
    <div class="other-main">
      <aside
        v-for="(item, index) of configOther"
        :key="item.id"
        :class="[
          'item-box',
          index == configOther.length - 1 || index == configOther.length - 2
            ? 'noBottmo'
            : '',
        ]"
      >
        <ForgeToolItem :is-other="true" :item="item" />
      </aside>
    </div>
  </section>
  <section
    v-if="showMeasure"
    class="measure-box"
    :style="{ left: activeClickInfo.viewType == '3d' ? '100px' : '35px' }"
  >
    <div class="icon-top"></div>
    <div
      v-for="(item, index) of measureConfig"
      :key="index"
      style="width: 100%"
      :class="[
        'item-box',
        index == measureConfig.length - 1 ? 'noBottmo' : '',
      ]"
    >
      <ForgeToolItem :is-other="true" :item="item" />
    </div>
  </section>
  <section v-if="profileBox" style="left: 170px" class="measure-box">
    <div class="icon-top"></div>
    <div
      v-for="(item, index) of profileConfig"
      :key="index"
      style="width: 100%"
      :class="[
        'item-box',
        index == profileConfig.length - 1 ? 'noBottmo' : '',
      ]"
    >
      <ForgeToolItem :is-other="true" :item="item" />
    </div>
  </section>

  <hwSlider
  class="hw-slider-test"
    v-if="focalLengthInfo.show"
    :slider-data="focalLengthInfo"
    :change="setfocalLength"
    :close="clearfocalLengthandmodelDecompose.bind(null, 'focalLength')"
  />
  <hwSlider
    v-if="decomposeInfo.show"
    :slider-data="decomposeInfo"
    :change="setExplode"
    :close="clearfocalLengthandmodelDecompose.bind(null, 'modelDecompose')"
  />
</div>
</template>

<script>
import {
reactive, toRefs, onMounted, watch, 
} from 'vue';
import ForgeToolItem from '_app/qlhView/components/forgeToolItem.vue';
import { useForge } from '_app/qlhView/hook/forgeTool';
import ModelTtle from '_app/qlhView/components/modelTitle.vue';
import { Select, Switch } from 'ant-design-vue';
import hwSlider from '_app/qlhView/components/hwSlider.vue';

export default {
name: 'ForgeTool',
components: {
  ForgeToolItem,
  ModelTtle,
  Select,
  hwSlider,
  SelectOption: Select.Option,
  ASwitch: Switch,
},
props: {
  activeClickInfo: {
    default: () => {},
    type: Object,
  },
},
setup(props) {
  // configType: 'profile'
  const {
    configTool,
    profileConfig,
    changeprofile,
    showProfile,
    measureConfig,
    configType,
    showSet,
    closeSet,
    unitType,
    unitList,
    accuracyType,
    accuracyList,
    isAccuracy,
    isFree,
    changeUnitType,
    changeaccuracyType,
    changeisAccuracy,
    profileBox,
    changeisFree,
    isShowOther,
    configOther,
    closeOther,
    focalLengthInfo,
    clearfocalLengthandmodelDecompose,
    setfocalLength,
    decomposeInfo,
    setExplode,
    filterData,
    showMeasure,
    clearRoam,
    clearMeasurt,
  } = useForge();
  const state = reactive({});
  onMounted(() => {
    const { viewType } = props.activeClickInfo;
    filterData(viewType);
  });
  watch(
    () => props.activeClickInfo.viewType,
    (viewType) => {
      filterData(viewType);
    },
  );
  watch(() => props.activeClickInfo.viewableId, (viewType) => {
    setTimeout(() => {
      changeprofile(false);// 关闭测量
      clearRoam(); // 关闭漫游
      clearMeasurt();
      // 去除记忆测量的消息
    }, 500);
  });
  function isSanWei() {
    const { viewType } = props.activeClickInfo;
    return viewType == '3d';
  }
  return {
    ...toRefs(state),
    configTool,
    profileBox,
    changeprofile,
    showProfile,
    profileConfig,
    measureConfig,
    configType,
    showMeasure,
    showSet,
    closeSet,
    unitType,
    unitList,
    accuracyType,
    accuracyList,
    isAccuracy,
    isFree,
    changeaccuracyType,
    changeUnitType,
    changeisAccuracy,
    changeisFree,
    isShowOther,
    configOther,
    closeOther,
    setfocalLength,
    focalLengthInfo,
    clearfocalLengthandmodelDecompose,
    decomposeInfo,
    isSanWei,
    setExplode,
    clearMeasurt,
  };
},
};
</script>
<style scoped lang='scss'>
.forge-tool-box {
position: relative;
padding: 2px 12px;
display: flex;
align-items: center;
border-radius: 4px;
.item {
  margin-right: 35px;
  &:last-of-type {
    margin: 0;
  }
}
}
.measure {
position: absolute;
border: 1px solid #e8eaec;
left: -1px;
width: 453px;
padding: 2px 0;
z-index: 2;
background: white;
display: flex;
align-items: center;
border-radius: 4px;

.list {
  margin-right: 54px;
}
.cl-item {
  margin-right: 35px;
}
}
.toback {
cursor: pointer;
margin-right: 28px;
padding: 0px 20px;
border-right: 1px solid #e8eaec;

.text {
  font-size: 12px;
  color: #cc2d2d;
  &:hover {
    background: #f5f7fc;
    border-radius: 4px;
  }
}
}
.measure-set-box {
border-right: 1px solid #e8eaec;
height: 310px;
width: 320px;
z-index: 4;
border-radius: 4px;
background: #ffffff;
border: 1px solid #e8eaec;
position: absolute;
top: 80px;
right: 0px;
}
.main {
padding: 20px;
}
.text-title {
color: #87909d;
font-size: 14px;
margin-bottom: 10px;
}
.box {
margin-bottom: 20px;
}
.box-bottom {
display: flex;
justify-content: space-between;
}
.other-box {
border: 1px solid #e8eaec;
position: absolute;
top: 47px;
z-index: 2;
background: white;
border-radius: 4px;
width: 244px;
padding: 14px 12px;
}
.measure-box {
border: 1px solid #e8eaec;
position: absolute;
top: 47px;
z-index: 2;
background: white;
border-radius: 4px;
width: 132px;
padding: 14px 12px;
}
.other-main {
display: flex;
justify-content: space-around;
flex-wrap: wrap;
}
.item-box {
width: 50%;
display: flex;
align-items: center;
margin-bottom: 20px;
}
.noBottmo {
margin-bottom: 0;
}
.icon-top {
position: absolute;
margin-left: -5px;
width: 0;
height: 0;
border: 5px solid transparent;
border-bottom-color: #ffffff;
left: 50%;
top: -10px;
}
</style>
`
function traverseTemplateNode(node: any, classNameList: any[]) {

    if (node.props && node.props.length && node.props.find((prop: any) => prop.name === 'class')
    ){
    const className = node.props.find((prop: any) => prop.name === 'class').value.content;
    classNameList.push(className);
    }
    if (node.children) {
      // 递归遍历子节点
      node.children.forEach((item: any)=>{
        traverseTemplateNode(item, classNameList);
      });
    }
    return classNameList;

}
function parseVue(content: string) {
  const res =parse(content);
  const {children} = res;
  const template = children.find((item: any) => item.tag === 'template') as any;
  const classNameList = traverseTemplateNode(template, []);
}
parseVue(content);