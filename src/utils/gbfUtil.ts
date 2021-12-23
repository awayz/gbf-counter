import dayjs from 'dayjs';

/* 物品掉落情况
 * { itemName1: count1, itemName2: count2 }
 */
export interface ItemCount {
  [index: string]: number;
}

/* 所有 raid 的掉落情况
 * { raidName1 : { itemName1: count1, itemName2: count2 }, raidName2: { xxx }}
 */
export interface AllRaidsItemCount {
  [index: string]: ItemCount;
}

export interface RaidDetail {
  raidId: string;
  itemId: string;
  itemName: string;
  num: number;
  damage: number;
  duration: number;
  time: string;
}

export interface DropInfoDTO {
  totalItemCount: ItemCount;
  blueTreasureCount: number;
  akashaTreasureCount: number;
  protoBahamutTreasureCount: number;
  grandOrderTreasureCount: number;
  ffjCount: number;
}

export interface YearRaidCount {
  [index: string]: number;
}

// 所有 raid 的掉落情况（按 raidId 分开记录）
export async function countAll(): Promise<AllRaidsItemCount> {
  const data = (await (window as any).api.countAll()) as AllRaidsItemCount;
  return data;
}

// 单个 raid 的掉落情况
export async function count(raidId: string): Promise<ItemCount> {
  return (await (window as any).api.count(raidId)) as ItemCount;
}

// 所有 raid 的掉落情况（按物品 sum）
export function getDropInfo(allRaidsItemCount: AllRaidsItemCount): DropInfoDTO {
  if (!allRaidsItemCount) {
    return {
      totalItemCount: {},
      blueTreasureCount: 0,
      akashaTreasureCount: 0,
      grandOrderTreasureCount: 0,
      protoBahamutTreasureCount: 0,
      ffjCount: 0,
    };
  }

  const totalItemCount: ItemCount = {};
  let blueTreasure = 0;
  let akasha = 0;
  let protoBahamut = 0;
  let grandOrder = 0;
  let ffjCount = 0;
  const AKASHA = 'akasha';
  const PROTOBAHAMUT = 'proto_bahamut';
  const GRANDORDER = 'grand_order';
  const FFJ = 'ffj';
  const EMPTY = 'empty';

  for (const [raidId, raidItemCount] of Object.entries(allRaidsItemCount)) {
    for (const [item, c] of Object.entries(raidItemCount)) {
      if (item === EMPTY) {
        continue;
      }

      if (Object.prototype.hasOwnProperty.call(totalItemCount, item)) {
        totalItemCount[item] += c;
      } else {
        totalItemCount[item] = c;
      }

      blueTreasure += c;
      if (raidId === AKASHA) {
        akasha += c;
      } else if (raidId === PROTOBAHAMUT) {
        protoBahamut += c;
      } else if (raidId === GRANDORDER) {
        grandOrder += c;
      }
      if (item === FFJ) {
        ffjCount += c;
      }
    }
  }
  const result = {
    totalItemCount,
    blueTreasureCount: blueTreasure,
    akashaTreasureCount: akasha,
    protoBahamutTreasureCount: protoBahamut,
    grandOrderTreasureCount: grandOrder,
    ffjCount,
  };
  return result;
}

// 所有 raid 的掉落详情
export async function listDetails(): Promise<RaidDetail[]> {
  const data = (await (window as any).api.list()) as RaidDetail[];
  // console.log('detail data: ', data);
  return data;
}

// 计算 detail 记录里有多少不同的日期
export function countRaidDays(details: RaidDetail[]): number {
  const daySet = new Set();

  for (let i = 0; i < details.length; i += 1) {
    const d = details[i];
    if (d && d.time) {
      const t = d.time;
      const date = dayjs(t).format('DD/MM/YYYY');
      // console.log('data in count raid', date);
      daySet.add(date);
    }
  }
  return daySet.size;
}

// 每年每天打了几次
export function yearRaidCountGroupByDay(year: string, details: RaidDetail[]): YearRaidCount {
  const yearRaidCount: YearRaidCount = {};
  for (let i = 0; i < details.length; i += 1) {
    const d = details[i];
    if (d && d.time) {
      const t = d.time;
      const date = dayjs(t);
      const y = date.get('year');
      if (y !== +year) {
        continue;
      }
      const dateStr = date.format('YYYY-MM-DD');
      if (Object.prototype.hasOwnProperty.call(yearRaidCount, dateStr)) {
        yearRaidCount[dateStr] += 1;
      } else {
        yearRaidCount[dateStr] = 1;
      }
    }
  }
  return yearRaidCount;
}
