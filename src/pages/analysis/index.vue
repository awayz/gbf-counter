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
                  <span class="num">
                    {{ akashaCount }}
                  </span>
                  个，大巴
                  <span class="num">
                    {{ protoBahamutCount }}
                  </span>
                  个
                </div>
                <div>
                  大公
                  <span class="num">
                    {{ grandOrderCount }}
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
                <div class="col-2 text-h6">掉落分布</div>
                <q-space />
                <div class="col-5">
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
              <div class="row">
                <div class="col text-h6">每日猎金次数</div>
                <div class="col-2">
                  <q-select
                    outlined
                    dense
                    v-model="selectedYear"
                    :options="yearsToSelect"
                    @update:model-value="loadYearRaidCount"
                  >
                    <template v-slot:before>
                      <q-icon name="event" color="primary" />
                    </template>
                  </q-select>
                </div>
              </div>
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
  yearRaidCountGroupByDay,
  YearRaidCount,
  RaidDetail,
} from 'src/utils/gbfUtil';
import { DropItems, RaidList } from 'src/constants/drop';
import { defineComponent, onMounted, ref } from 'vue';
import * as echarts from 'echarts/core';
import { PieChart, PieSeriesOption, HeatmapChart, HeatmapSeriesOption } from 'echarts/charts';
import {
  TitleComponent,
  TitleComponentOption,
  TooltipComponent,
  TooltipComponentOption,
  LegendComponent,
  LegendComponentOption,
  GridComponent,
  GridComponentOption,
  VisualMapComponent,
  VisualMapComponentOption,
  CalendarComponent,
  CalendarComponentOption,
} from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';

// 注册必须的组件
echarts.use([
  TitleComponent,
  LegendComponent,
  TooltipComponent,
  GridComponent,
  PieChart,
  CanvasRenderer,
  HeatmapChart,
  VisualMapComponent,
  CalendarComponent,
]);

const ALL_RAIDS = 'all';

const updateSummaryPie = (data: ItemCount) => {
  const summary: HTMLDivElement = document.getElementById('summary-pie') as HTMLDivElement;
  summary.removeAttribute('_echarts_instance_');
  const summaryPieChart = echarts.init(summary);
  const d = [];
  for (const [item, cnt] of Object.entries(data)) {
    const { name } = DropItems[item];
    d.push({
      value: cnt,
      name,
    });
  }
  // 通过 ComposeOption 来组合出一个只有必须组件和图表的 Option 类型
  type SummaryPieChartOption = echarts.ComposeOption<
    PieSeriesOption | TitleComponentOption | LegendComponentOption | GridComponentOption | TooltipComponentOption
  >;
  const summaryPieChartOption: SummaryPieChartOption = {
    tooltip: {
      trigger: 'item',
    },
    legend: {
      orient: 'vertical',
      left: 'left',
      top: 'center',
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
          formatter: '{b} {c} ({d}%)',
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

function getYearData(year: string, raidDetails: RaidDetail[]) {
  const raidCount: YearRaidCount = yearRaidCountGroupByDay(year, raidDetails);
  const date = +echarts.time.parse(`${year}-01-01`);
  const end = +echarts.time.parse(`${+year + 1}-01-01`);
  const dayTime = 3600 * 24 * 1000;
  const data = [];
  for (let time = date; time < end; time += dayTime) {
    const d = echarts.time.format(time, '{yyyy}-{MM}-{dd}', false);
    if (Object.prototype.hasOwnProperty.call(raidCount, d)) {
      data.push([d, raidCount[d]]);
    } else {
      data.push([d, 0]);
    }
  }
  // console.log(data);
  return data;
}

const updateDailyCheckIn = (year: string, raidDetails: RaidDetail[]) => {
  const checkIn: HTMLDivElement = document.getElementById('daily-check-in') as HTMLDivElement;
  checkIn.removeAttribute('_echarts_instance_');
  const checkInChart = echarts.init(checkIn);
  console.log('checkInChart');
  type CheckInChartOption = echarts.ComposeOption<
    | HeatmapSeriesOption
    | VisualMapComponentOption
    | GridComponentOption
    | CalendarComponentOption
    | TooltipComponentOption
  >;
  const checkInChartOption: CheckInChartOption = {
    tooltip: {
      formatter: '{c0}次',
    },
    visualMap: {
      type: 'piecewise',
      orient: 'horizontal',
      left: 'center',
      top: 0,
      inRange: {
        color: ['#ebedf0', '#9be9a8', '#40c463', '#30a14e', '#216e39'],
      },
      pieces: [{ gte: 0, lt: 5 }, { gte: 5, lt: 10 }, { gte: 10, lt: 15 }, { gte: 15, lt: 20 }, { gte: 20 }],
    },
    calendar: {
      top: 50,
      left: 30,
      right: 30,
      cellSize: ['auto', 14],
      range: year,
      itemStyle: {
        borderWidth: 2,
        borderColor: '#ffffff',
      },
      yearLabel: { show: false },
      dayLabel: {
        nameMap: 'cn',
      },
      monthLabel: {
        nameMap: 'cn',
      },
      splitLine: {
        show: false,
      },
    },
    series: {
      type: 'heatmap',
      coordinateSystem: 'calendar',
      data: getYearData(year, raidDetails),
    },
  };
  checkInChart.setOption(checkInChartOption);
};

export default defineComponent({
  name: 'Analysis',
  setup() {
    const blueTreasureCount = ref(0);
    const akashaCount = ref(0);
    const protoBahamutCount = ref(0);
    const grandOrderCount = ref(0);
    const ffjCount = ref(0);

    onMounted(async () => {
      const allRaidsItemCount: AllRaidsItemCount = await countAll();
      const dropInfoDTO: DropInfoDTO = getDropInfo(allRaidsItemCount);
      updateSummaryPie(dropInfoDTO.totalItemCount);

      blueTreasureCount.value = dropInfoDTO.blueTreasureCount;
      akashaCount.value = dropInfoDTO.akashaTreasureCount;
      protoBahamutCount.value = dropInfoDTO.protoBahamutTreasureCount;
      grandOrderCount.value = dropInfoDTO.grandOrderTreasureCount;
      ffjCount.value = dropInfoDTO.ffjCount;
    });

    const raidDayCount = ref(0);
    const currentYear = `${new Date().getFullYear()}`;
    const selectedYear = ref(currentYear);
    const yearsToSelect = ref(['2021', '2022', '2023']);
    onMounted(async () => {
      const raidDetails = await listDetails();
      raidDayCount.value = countRaidDays(raidDetails);
      updateDailyCheckIn(currentYear, raidDetails);
    });

    const raidTabs = ref<Record<string, string>[]>([]);

    for (let i = 0; i < RaidList.length; i += 1) {
      const raid = RaidList[i];
      raidTabs.value.push({
        name: raid.id,
        label: raid.name,
      });
    }

    raidTabs.value.push({
      name: ALL_RAIDS,
      label: '全部',
    });

    return {
      raidDayCount,
      blueTreasureCount,
      akashaCount,
      protoBahamutCount,
      grandOrderCount,
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
      selectedYear,
      yearsToSelect,
      loadYearRaidCount: async () => {
        const data = await listDetails();
        updateDailyCheckIn(selectedYear.value, data);
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
  background: url('~assets/olb.png') 110% no-repeat;
  background-size: contain;
  position: absolute;
  width: 100%;
  height: 100%;
}

.drop-count {
  #summary-pie {
    height: 420px;
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
      left: 65px;
      font-size: 80px;
      margin: 0 5px 0 0;
    }

    .ffj-unit {
      color: #ffe474;
      position: relative;
      top: 130px;
      left: 65px;
      font-size: 30px;
    }
  }
}

.check-in {
  #daily-check-in {
    height: 200px;
  }
}
.page-scroll {
  height: 501px;
  width: 100%;
}
</style>
