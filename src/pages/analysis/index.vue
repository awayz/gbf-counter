<template>
  <q-page class="page-container">
    <div class="q-pa-md">
      <div class="row justify-evenly">
        <q-card class="summary">
          <q-card-section>
            <div class="text-h6">生涯</div>
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
              个，其中：
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
          <q-card-section>
            <div id="summary-pie"></div>
          </q-card-section>
        </q-card>
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
      <div class="row justify-evenly"></div>
    </div>
  </q-page>
</template>
<script lang="ts">
import { countAll, sumDropInfo, RaidDropCount, DropInfo } from 'src/utils/gbfUtil';
import { defineComponent, onMounted } from 'vue';
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

export default defineComponent({
  name: 'Analysis',
  setup() {
    const initSummaryPie = (data: RaidDropCount) => {
      const d = [];
      for (const [item, c] of Object.entries(data)) {
        d.push({
          value: c,
          name: item,
        });
      }
      const summary: HTMLDivElement = document.getElementById('summary-pie') as HTMLDivElement;
      const summaryPieChart = echarts.init(summary);
      // 通过 ComposeOption 来组合出一个只有必须组件和图表的 Option 类型
      type SummaryPieChartOption = echarts.ComposeOption<
        PieSeriesOption | TitleComponentOption | LegendComponentOption | GridComponentOption | TooltipComponentOption
      >;
      const summaryPieChartOption: SummaryPieChartOption = {
        title: {
          text: '掉落分布',
          top: '10%',
          left: 'center',
        },
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
            name: '访问来源',
            type: 'pie',
            radius: ['40%', '70%'],
            avoidLabelOverlap: false,
            data: d,
            label: {
              show: false,
              position: 'center',
            },
            labelLine: {
              show: false,
            },
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)',
              },
              label: {
                show: true,
                fontSize: '20',
                fontWeight: 'bold',
              },
            },
          },
        ],
      };
      summaryPieChart.setOption(summaryPieChartOption);
    };

    onMounted(async () => {
      const dropInfo: DropInfo = await countAll();
      const sumDropCount: RaidDropCount = sumDropInfo(dropInfo);
      initSummaryPie(sumDropCount);
    });

    return {
      raidDayCount: 1234,
      blueTreasureCount: 1243,
      akashaCount: 1244,
      protoBahamutCount: 1231,
      ffjCount: 0,
    };
  },
});
</script>

<style lang="scss" scoped>
.summary {
  min-width: 350px;
  max-width: 350px;
  .description {
    height: 130px;
    .num {
      font-size: 24px;
      margin: 0 5px 0 5px;
      color: $primary;
    }
  }

  #summary-pie {
    height: 400px;
  }
}
.ffj {
  min-width: 350px;
  max-width: 350px;
  height: 400px;

  .ffj-background {
    height: 380px;
    background-image: url('~assets/oh-ffj.jpg');
    background-repeat: no-repeat;
    background-size: 350px 330px;

    .ffj-num {
      color: #ffe474;
      position: relative;
      top: 120px;
      left: 41px;
      font-size: 80px;
      margin: 0 5px 0 0;
    }

    .ffj-unit {
      color: #ffe474;
      position: relative;
      top: 114px;
      left: 41px;
      font-size: 30px;
    }
  }
}
</style>
