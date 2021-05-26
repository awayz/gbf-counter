// 单个 raid 的掉落情况
export interface RaidDropCount {
  [index: string]: number;
}

// 所有 raid 的掉落情况
export interface DropInfo {
  [index: string]: RaidDropCount;
}

// 所有 raid 的掉落情况（分开记录）
export async function countAll(): Promise<DropInfo> {
  const data = (await (window as any).api.countAll()) as DropInfo;

  return data;
}

// 单个 raid 的掉落情况
export async function count(raidId: string): Promise<RaidDropCount> {
  return (await (window as any).api.count(raidId)) as RaidDropCount;
}

export function sumDropInfo(dropInfo: DropInfo): RaidDropCount {
  const result: RaidDropCount = {};
  if (!dropInfo) {
    return result;
  }
  // eslint-disable-next-line no-unused-vars
  for (const [_, dropCount] of Object.entries(dropInfo)) {
    for (const [item, c] of Object.entries(dropCount)) {
      if (Object.prototype.hasOwnProperty.call(result, item)) {
        result[item] += c;
      } else {
        result[item] = c;
      }
    }
  }
  return result;
}
