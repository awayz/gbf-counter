<template>
  <q-page class="page-container">
    <q-scroll-area
      class="page-scroll"
      :thumb-style="thumbStyle"
      :content-style="contentStyle"
      :content-active-style="contentActiveStyle"
    >
      <div class="q-pa-md">
        <div class="row justify-between">
          <div class="col-7 q-gutter-sm" style="min-width: 400px">
            <q-card class="summary">
              <q-card-section>
                <div class="text-h6">概览</div>
              </q-card-section>

              <q-card-section class="description">
                <div>
                  你已经农了
                  <span class="num">{{ raidDayCount }} </span>
                  天肝报废
                </div>
                <div>
                  掉落蓝箱
                  <span class="num">{{ blueTreasureCount }}</span>
                  个，其中
                </div>
                <div>
                  阿卡夏
                  <span class="num"> {{ akashaCount }} </span>
                  个，大巴
                  <span class="num">
                    {{ protoBahamutCount }}
                  </span>
                  个
                </div>
              </q-card-section>
            </q-card>
          </div>

          <div class="col-5 q-gutter-sm" style="min-width: 300px">
            <q-card class="ffj">
              <q-card-section class="ffj-background" style="padding: 0">
                <span class="ffj-num">
                  {{ ffjCount }}
                </span>
                <span class="ffj-unit">个</span>
              </q-card-section>
            </q-card>
          </div>
        </div>
        <div style="margin-top: 20px">
          <q-card class="drop-count">
            <q-card-section>
              <div class="row">
                <span class="col-2 text-h6">掉落分布</span>
                <q-space />
                <div class="col-4">
                  <q-tabs v-model="selectedRaidTab" inline-label shrink stretch align="justify" class="bg-grey-1">
                    <q-tab
                      v-for="tab in raidTabs"
                      class="text-primary"
                      :key="tab.name"
                      v-bind="tab"
                      @click="loadDropData(tab.name)"
                    />
                  </q-tabs>
                </div>
              </div>
            </q-card-section>
            <q-card-section>
              <div id="summary-pie"></div>
            </q-card-section>
          </q-card>
        </div>
        <div style="margin-top: 20px">
          <q-card class="check-in">
            <q-card-section>
              <span class="text-h6">每日记录</span>
            </q-card-section>
            <q-card-section>
              <div id="daily-check-in"></div>
            </q-card-section>
          </q-card>
        </div>
      </div>
    </q-scroll-area>
  </q-page>
</template>
<script lang="ts">
import {
  countAll,
  getDropInfo,
  ItemCount,
  AllRaidsItemCount,
  countRaidDays,
  listDetails,
  DropInfoDTO,
  count,
} from 'src/utils/gbfUtil';
import { DropItems, RaidList } from 'src/constants/drop';
import { defineComponent, onMounted, ref } from 'vue';
import * as echarts from 'echarts/core';
import { PieChart, PieSeriesOption } from 'echarts/charts';
import {
  TitleComponent,
  TitleComponentOption,
  TooltipComponent,
  TooltipComponentOption,
  LegendComponent,
  LegendComponentOption,
  GridComponent,
  GridComponentOption,
} from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';

// 注册必须的组件
echarts.use([TitleComponent, LegendComponent, TooltipComponent, GridComponent, PieChart, CanvasRenderer]);

const ALL_RAIDS = 'all';

const updateSummaryPie = (data: ItemCount) => {
  const d = [];
  for (const [item, cnt] of Object.entries(data)) {
    const { name } = DropItems[item];
    d.push({
      value: cnt,
      name,
    });
  }
  const summary: HTMLDivElement = document.getElementById('summary-pie') as HTMLDivElement;
  const summaryPieChart = echarts.init(summary);
  // 通过 ComposeOption 来组合出一个只有必须组件和图表的 Option 类型
  type SummaryPieChartOption = echarts.ComposeOption<
    PieSeriesOption | TitleComponentOption | LegendComponentOption | GridComponentOption | TooltipComponentOption
  >;
  const summaryPieChartOption: SummaryPieChartOption = {
    tooltip: {
      trigger: 'item',
    },
    legend: {
      orient: 'horizontal',
      left: 'left',
      top: 'bottom',
    },
    series: [
      {
        type: 'pie',
        radius: ['35%', '75%'],
        avoidLabelOverlap: true,
        itemStyle: {
          borderRadius: 4,
          borderColor: '#fff',
          borderWidth: 2,
        },
        data: d,
        label: {
          show: true,
          position: 'outer',
        },
        labelLine: {
          show: true,
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)',
          },
          label: {
            show: true,
            fontSize: '16',
            fontWeight: 'bold',
          },
        },
      },
    ],
  };
  summaryPieChart.setOption(summaryPieChartOption);
};

const updateDailyCheckIn = (data: any) => {
  const summary: HTMLDivElement = document.getElementById('summary-pie') as HTMLDivElement;
};

export default defineComponent({
  name: 'Analysis',
  setup() {
    const blueTreasureCount = ref(0);
    const akashaCount = ref(0);
    const protoBahamutCount = ref(0);
    const ffjCount = ref(0);

    onMounted(async () => {
      const allRaidsItemCount: AllRaidsItemCount = await countAll();
      const dropInfoDTO: DropInfoDTO = getDropInfo(allRaidsItemCount);
      updateSummaryPie(dropInfoDTO.totalItemCount);

      blueTreasureCount.value = dropInfoDTO.blueTreasureCount;
      akashaCount.value = dropInfoDTO.akashaTreasureCount;
      protoBahamutCount.value = dropInfoDTO.protoBahamutTreasureCount;
      ffjCount.value = dropInfoDTO.ffjCount;
    });

    const raidDayCount = ref(0);
    onMounted(async () => {
      const raidDetails = await listDetails();
      raidDayCount.value = countRaidDays(raidDetails);
    });

    const raidTabs = ref([
      {
        name: ALL_RAIDS,
        label: '全部',
      },
    ]);

    for (let i = 0; i < RaidList.length; i += 1) {
      const raid = RaidList[i];
      raidTabs.value.push({
        name: raid.id,
        label: raid.name,
      });
    }

    return {
      raidDayCount,
      blueTreasureCount,
      akashaCount,
      protoBahamutCount,
      ffjCount,
      raidTabs,
      selectedRaidTab: ref(ALL_RAIDS),
      loadDropData: async (id: string) => {
        let data;
        if (id === ALL_RAIDS) {
          const allRaidsItemCount: AllRaidsItemCount = await countAll();
          const dropInfoDTO: DropInfoDTO = getDropInfo(allRaidsItemCount);
          data = dropInfoDTO.totalItemCount;
        } else {
          data = await count(id);
        }
        updateSummaryPie(data);
      },
    };
  },
  data() {
    return {
      contentStyle: {
        backgroundColor: 'rgba(0,0,0,0.02)',
        color: '#555',
      },

      contentActiveStyle: {
        backgroundColor: '#eee',
        color: 'black',
      },

      thumbStyle: {
        right: '2px',
        borderRadius: '5px',
        backgroundColor: '#55CD85',
        width: '5px',
        opacity: 0.75,
      },
    };
  },
});
</script>

<style lang="scss" scoped>
.summary {
  .description {
    height: 180px;
    font-size: 17px;
    .num {
      font-size: 27px;
      margin: 0 5px 0 5px;
      color: $primary;
    }
  }
}
.summary::before {
  content: '';
  background: url('~assets/olb.png') right center no-repeat;
  background-size: contain;
  position: absolute;
  width: 100%;
  height: 100%;
}

.drop-count {
  #summary-pie {
    height: 380px;
  }
}

.ffj {
  height: 244px;

  .ffj-background {
    height: 244px;
    background-image: url('~assets/oh-ffj.jpg');
    background-repeat: no-repeat;
    background-size: 355px 246px;

    .ffj-num {
      color: #ffe474;
      position: relative;
      top: 136px;
      left: 80px;
      font-size: 80px;
      margin: 0 5px 0 0;
    }

    .ffj-unit {
      color: #ffe474;
      position: relative;
      top: 130px;
      left: 80px;
      font-size: 30px;
    }
  }
}

.page-scroll {
  height: 501px;
  width: 100%;
}
</style>
