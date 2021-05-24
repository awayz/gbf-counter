/* eslint-disable camelcase */
interface DropMapI {
  [index: string]: string[];
}

export interface DropItemI {
  id: string;
  imgPath: string;
}

interface DropItemsI {
  [index: string]: DropItemI;
}

export const DropItems: DropItemsI = {
  ffj: {
    id: 'ffj',
    imgPath: 'statics/ffj.jpg',
  },
  red_ring: {
    id: 'red_ring',
    imgPath: 'statics/red_ring.jpg',
  },
  black_ring: {
    id: 'black_ring',
    imgPath: 'statics/black_ring.jpg',
  },
  white_ring: {
    id: 'white_ring',
    imgPath: 'statics/white_ring.jpg',
  },
  silver_centrum: {
    id: 'silver_centrum',
    imgPath: 'statics/silver_centrum.jpg',
  },
  red_paper: {
    id: 'red_paper',
    imgPath: 'statics/red_paper.jpg',
  },
  black_paper: {
    id: 'black_paper',
    imgPath: 'statics/black_paper.jpg',
  },
  white_paper: {
    id: 'white_paper',
    imgPath: 'statics/white_paper.jpg',
  },
  hollow_key: {
    id: 'hollow_key',
    imgPath: 'statics/hollow_key.jpg',
  },
  mirage_munition: {
    id: 'mirage_munition',
    imgPath: 'statics/mirage_munition.png',
  },
};

export const DropItemMap: DropMapI = {
  proto_bahamut: ['ffj', 'red_ring', 'black_ring', 'white_ring'],
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
};
