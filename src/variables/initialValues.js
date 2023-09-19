const { v4 } = require("uuid");
const { ACTIVE } = require("./general");

const initialMasterCourierValue = [
  {
    courierName: "GOJEK",
    status: ACTIVE,
  },
  {
    courierName: "JNT",
    status: ACTIVE,
  },
  {
    courierName: "GRAB",
    status: ACTIVE,
  },
  {
    courierName: "EKSPEDISI LAINNYA",
    status: ACTIVE,
  },
];

const initialMasterCategoryValue = [
  {
    categoryName: "Pakaian",
    status: ACTIVE,
  },
  {
    categoryName: "Otomotif",
    status: ACTIVE,
  },
  {
    categoryName: "Peralatan Dapur",
    status: ACTIVE,
  },
  {
    categoryName: "Furnitur",
    status: ACTIVE,
  },
  {
    categoryName: "Aksesoris",
    status: ACTIVE,
  },
  {
    categoryName: "Hardware",
    status: ACTIVE,
  },
  {
    categoryName: "Aksesoris HP",
    status: ACTIVE,
  },
  {
    categoryName: "Lain - Lain",
    status: ACTIVE,
  },
];

const initialStoreChannelsValue = () => {
  // generate channel ids
  const storeInfoChannelID = v4();
  const LoungeChannelID = v4();
  const ReportingChannelID = v4();

  // generate room ids
  const announcementRoomID = v4();
  const generalChatRoomID = v4();
  const generalReportRoomID = v4();
  const privateConsultationRoomID = v4();

  // return the value in json format to store it as JSONB in the db
  return {
    [storeInfoChannelID]: {
      channelId: storeInfoChannelID,
      channelTitle: "Informasi Toko",
      channelRooms: {
        [announcementRoomID]: {
          roomId: announcementRoomID,
          roomTitle: "📢︱announcement",
          roomType: "TEXT",
          roomChats: {},
        },
      },
    },
    [LoungeChannelID]: {
      channelId: LoungeChannelID,
      channelTitle: "Lounge",
      channelRooms: {
        [generalChatRoomID]: {
          roomId: generalChatRoomID,
          roomTitle: "🪐︱General Chat",
          roomType: "TEXT",
          roomChats: {},
        },
      },
    },
    [ReportingChannelID]: {
      channelId: ReportingChannelID,
      channelTitle: "Pelaporan",
      channelRooms: {
        [generalReportRoomID]: {
          roomId: generalReportRoomID,
          roomTitle: "🖥︱Pelaporan umum",
          roomType: "TEXT",
          roomChats: {},
        },
        [privateConsultationRoomID]: {
          roomId: privateConsultationRoomID,
          roomTitle: "🎧「Bilik konsultasi Privat",
          roomType: "VOICE",
          roomMaxSocket: 10,
          roomSockets: {},
        },
      },
    },
  };
};

module.exports = {
  initialMasterCourierValue,
  initialMasterCategoryValue,
  initialStoreChannelsValue,
};
