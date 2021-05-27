<template>
  <q-page class="page-container">
    <div class="q-pa-md">
      <div class="row justify-evenly">
        <div class="col-7 q-gutter-md" style="min-width: 400px">
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

          <q-card class="drop-count">
            <q-card-section>
              <div class="text-h6">掉落分布</div>
            </q-card-section>
            <q-card-section>
              <q-tabs v-model="selectedRaidTab" inline-label shrink stretch align="justify" class="bg-grey-1">
                <q-tab
                  v-for="tab in raidTabs"
                  class="text-primary"
                  :key="tab.name"
                  v-bind="tab"
                  @click="loadDropData(tab.name)"
                />
              </q-tabs>
              <div id="summary-pie"></div>
            </q-card-section>
          </q-card>
        </div>

        <div class="col-5 q-gutter-md" style="min-width: 300px">
          <q-card class="ffj">
            <q-card-section>
              <div class="text-h6">FFJ</div>
            </q-card-section>

            <q-card-section class="ffj-background">
              <span class="ffj-num">
                {{ ffjCount }}
              </span>
              <span class="ffj-unit">个</span>
            </q-card-section>
          </q-card>
        </div>
      </div>
    </div>
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

export default defineComponent({
  name: 'Analysis',
  setup() {
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
            radius: ['30%', '50%'],
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
    console.log('raidTabs', raidTabs);

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
});
</script>

<style lang="scss" scoped>
.summary {
  .description {
    height: 140px;
    .num {
      font-size: 26px;
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
    height: 400px;
  }
}

.ffj {
  height: 350px;

  .ffj-background {
    height: 380px;
    background-image: url('~assets/oh-ffj.jpg');
    background-repeat: no-repeat;
    background-size: 320px 280px;

    .ffj-num {
      color: #ffe474;
      position: relative;
      top: 140px;
      left: 41px;
      font-size: 80px;
      margin: 0 5px 0 0;
    }

    .ffj-unit {
      color: #ffe474;
      position: relative;
      top: 134px;
      left: 41px;
      font-size: 30px;
    }
  }
}
</style>
