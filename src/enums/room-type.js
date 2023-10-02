export const RoomType = {
  EMPTY: 0,
  TREASURE: 1,
  KEY: 2,
  BOSS: 3,
};

export const isSpecialRoom = (roomType) => {
  switch (roomType) {
    case RoomType.TREASURE:
    case RoomType.KEY:
    case RoomType.BOSS:
      return true;
  }
  return false;
};
