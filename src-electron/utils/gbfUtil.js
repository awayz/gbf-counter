// 找到 itemId 对应的列表中距离现在最近的那一个，并删除，返回删除后的 record
export function removeClosest(record, raidId, itemId) {
  let result = [];
  if (record) {
    // 跳过找到的第一个，其他的复制进新的数组
    let find = false;
    for (let i = record.length - 1; i >= 0; i-=1 ) {
      let t = record[i];
      if (!find && t && t.raidId === raidId && t.itemId === itemId) {
        find = true;
        continue;
      }
      result.unshift({...t});
    }
  }
  return result;
}

export function findByRaidId(record, raidId) {
  let result = [];
  if (record) {
    for (let i = 0; i < record.length; i += 1 ) {
      let t = record[i];
      if (t && t.raidId === raidId) {
        result.push({...t});
      }
    }
  }
  return result;
}