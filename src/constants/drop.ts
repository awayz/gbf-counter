/* eslint-disable camelcase */
interface DropMapI {
  [index: string]: string[];
}

export interface DropItemI {
  id: string;
  name: string;
  imgPath: string;
}

interface DropItemsI {
  [index: string]: DropItemI;
}

export const DropItems: DropItemsI = {
  ffj: {
    id: 'ffj',
    name: '绯绯金',
    imgPath: 'statics/ffj.jpg',
  },
  red_ring: {
    id: 'red_ring',
    name: '红戒指',
    imgPath: 'statics/red_ring.jpg',
  },
  black_ring: {
    id: 'black_ring',
    name: '黑戒指',
    imgPath: 'statics/black_ring.jpg',
  },
  white_ring: {
    id: 'white_ring',
    name: '白戒指',
    imgPath: 'statics/white_ring.jpg',
  },
  silver_centrum: {
    id: 'silver_centrum',
    name: 'KMRの宝物',
    imgPath: 'statics/silver_centrum.jpg',
  },
  red_paper: {
    id: 'red_paper',
    name: '红纸',
    imgPath: 'statics/red_paper.jpg',
  },
  black_paper: {
    id: 'black_paper',
    name: '黑纸',
    imgPath: 'statics/black_paper.jpg',
  },
  white_paper: {
    id: 'white_paper',
    name: '白纸',
    imgPath: 'statics/white_paper.jpg',
  },
  hollow_key: {
    id: 'hollow_key',
    name: '阿卡夏钥匙',
    imgPath: 'statics/hollow_key.jpg',
  },
  mirage_munition: {
    id: 'mirage_munition',
    name: '加蛋',
    imgPath: 'statics/mirage_munition.png',
  },
  verdant_azurite: {
    id: 'verdant_azurite',
    name: '海胆',
    imgPath: 'statics/verdant_azurite.jpg',
  },
  empty: {
    id: 'empty',
    name: '我蓝箱呢',
    imgPath: 'statics/empty.jpg',
  },
};

export const DropItemMap: DropMapI = {
  proto_bahamut: ['ffj', 'red_ring', 'black_ring', 'white_ring', 'empty'],
  akasha: [
    'ffj',
    'red_ring',
    'black_ring',
    'white_ring',
    'silver_centrum',
    'red_paper',
    'black_paper',
    'white_paper',
    'hollow_key',
    'mirage_munition',
  ],
  grand_order: [
    'ffj',
    'red_ring',
    'black_ring',
    'white_ring',
    'silver_centrum',
    'red_paper',
    'black_paper',
    'white_paper',
    'verdant_azurite',
  ],
};

export const RaidList = [
  {
    id: 'proto_bahamut',
    name: '大巴',
    img_path: 'statics/proto_bahamut.png',
    route: '/counter/proto_bahamut',
  },
  {
    id: 'akasha',
    name: '阿卡夏',
    img_path: 'statics/akasha.png',
    route: '/counter/akasha',
  },
  {
    id: 'grand_order',
    name: '大公',
    img_path: 'statics/grand_order.jpg',
    route: '/counter/grand_order',
  },
];
