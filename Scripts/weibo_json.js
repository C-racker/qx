/***********************************************
> 应用名称：墨鱼自用微博&微博国际版净化脚本
> 脚本作者：@ddgksf2013
> 微信账号：墨鱼手记
> 更新时间：2024-01-26
> 通知频道：https://t.me/ddgksf2021
> 贡献投稿：https://t.me/ddgksf2013_bot
> 问题反馈：ddgksf2013@163.com
> 特别提醒：如需转载请注明出处，谢谢合作！
> 脚本声明：本脚本是在[https://github.com/zmqcherish]原创基础上优化自用
> 脚本声明：若有侵犯原作者权利，请邮箱联系删除

***********************************************/

const version = "V2.0.136";

const mainConfig = {
  isDebug: true,
  author: "ddgksf2013",
  removeHomeVip: true,
  removeHomeCreatorTask: true,
  removeRelate: true,
  removeGood: true,
  removeFollow: true,
  modifyMenus: true,
  removeRelateItem: false,
  removeRecommendItem: true,
  removeRewardItem: true,
  removeLiveMedia: true,
  removeNextVideo: false,
  removePinedTrending: true,
  removeInterestFriendInTopic: false,
  removeInterestTopic: false,
  removeInterestUser: true,
  removeLvZhou: true,
  removeSearchWindow: true,
  profileSkin1: null,
  profileSkin2: null,
  tabIconVersion: 0,
  tabIconPath: "",
};
const itemMenusConfig = {
  creator_task: false,
  mblog_menus_custom: false,
  mblog_menus_video_later: true,
  mblog_menus_comment_manager: true,
  mblog_menus_avatar_widget: false,
  mblog_menus_card_bg: false,
  mblog_menus_long_picture: true,
  mblog_menus_delete: true,
  mblog_menus_edit: true,
  mblog_menus_edit_history: true,
  mblog_menus_edit_video: true,
  mblog_menus_sticking: true,
  mblog_menus_open_reward: true,
  mblog_menus_novelty: false,
  mblog_menus_favorite: true,
  mblog_menus_promote: true,
  mblog_menus_modify_visible: true,
  mblog_menus_copy_url: true,
  mblog_menus_follow: true,
  mblog_menus_video_feedback: true,
  mblog_menus_shield: true,
  mblog_menus_report: true,
  mblog_menus_apeal: true,
  mblog_menus_home: true,
};
const modifyCardsUrls = ["/cardlist", "video/community_tab", "searchall"];
const modifyStatusesUrls = [
  "statuses/friends/timeline",
  "statuses_unread_hot_timeline",
  "statuses/unread_friends_timeline",
  "statuses/unread_hot_timeline",
  "groups/timeline",
  "statuses/friends_timeline",
];
const otherUrls = {
  "/profile/me": "removeHome",
  "/statuses/extend": "itemExtendHandler",
  "/video/remind_info": "removeVideoRemind",
  "/checkin/show": "removeCheckin",
  "/live/media_homelist": "removeMediaHomelist",
  "/comments/build_comments": "removeComments",
  "/container/get_item": "containerHandler",
  "/profile/container_timeline": "userHandler",
  "/video/tiny_stream_video_list": "nextVideoHandler",
  "/2/statuses/video_mixtimeline": "nextVideoHandler",
  "video/tiny_stream_mid_detail": "nextVideoHandler",
  "/!/client/light_skin": "tabSkinHandler",
  "/littleskin/preview": "skinPreviewHandler",
  "/search/finder": "removeSearchMain",
  "/search/container_timeline": "removeSearch",
  "/search/container_discover": "removeSearch",
  "/2/messageflow": "removeMsgAd",
  "/2/page?": "removePage",
  "/statuses/unread_topic_timeline": "topicHandler",
  "/square&pageDataType/": "squareHandler",
  "/statuses/container_timeline_topic": "removeMain",
  "/statuses/container_timeline": "removeMainTab",
  "wbapplua/wbpullad.lua": "removeLuaScreenAds",
  "interface/sdk/sdkad.php": "removePhpScreenAds",
  "a=trends": "removeTopics",
  user_center: "modifiedUserCenter",
  "a=get_coopen_ads": "removeIntlOpenAds",
  "php?a=search_topic": "removeSearchTopic",
  "ad/realtime": "removeRealtimeAd",
  "ad/preload": "removeAdPreload",
  "php?a=open_app": "removeAdBanner",
};
function getModifyMethod(url) {
  // 检查是否匹配卡片类URL
  for (const cardUrl of modifyCardsUrls) {
    if (url.indexOf(cardUrl) > -1) {
      return "removeCards";
    }
  }

  // 检查是否匹配状态类URL
  for (const statusUrl of modifyStatusesUrls) {
    if (url.indexOf(statusUrl) > -1) {
      return "removeTimeLine";
    }
  }

  // 检查是否匹配其他特定URL
  for (const [otherUrl, handlerName] of Object.entries(otherUrls)) {
    if (url.indexOf(otherUrl) > -1) {
      return handlerName;
    }
  }

  // 没有匹配到任何处理方法
  return null;
}
function removeRealtimeAd(response) {
  delete response.ads;
  response.code = 4016;
  return response;
}
function removeAdBanner(response) {
  if (response.data.close_ad_setting) {
    delete response.data.close_ad_setting;
  }

  if (response.data.detail_banner_ad) {
    response.data.detail_banner_ad = [];
  }

  return response;
}
function removeAdPreload(response) {
  if (!response.ads) return response;

  response.last_ad_show_interval = 86400;

  for (let adItem of response.ads) {
    adItem.start_time = 2681574400;
    adItem.end_time = 2681660799;
    adItem.display_duration = 0;
    adItem.daily_display_cnt = 0;
    adItem.total_display_cnt = 0;
  }

  return response;
}
function removeIntlOpenAds(response) {
  if (response.data) {
    response.data = { display_ad: 1 };
  }
  return response;
}
function removeSearchTopic(response) {
  if (response.data && response.data.search_topic?.cards.length !== 0) {
    // 过滤搜索话题卡片，移除searchtop类型
    response.data.search_topic.cards = Object.values(
      response.data.search_topic.cards
    ).filter((card) => card.type !== "searchtop");

    // 删除热门话题
    if (response.data.trending_topic) {
      delete response.data.trending_topic;
    }
  }

  return response;
}
function modifiedUserCenter(response) {
  if (response.data && response.data.length !== 0) {
    if (response.data.cards) {
      // 过滤掉个人VIP相关的卡片
      response.data.cards = Object.values(response.data.cards).filter(
        (card) => card.items[0].type !== "personal_vip"
      );
    }
  }
  return response;
}
function removeTopics(response) {
  if (response.data) {
    // 只保留search_topic类型
    response.data.order = ["search_topic"];
  }
  return response;
}
function isAd(item) {
  if (!item) return false;

  // 检查是否有广告标志
  const hasAdTypeName =
    item.mblogtypename === "广告" || item.mblogtypename === "热推";
  const hasAdPromotion = item.promotion?.type === "ad";
  const hasAdPageInfo = item.page_info?.actionlog?.source === "ad";
  const hasAdContentAuth =
    item.content_auth_info?.content_auth_title === "广告";

  return hasAdTypeName || hasAdPromotion || hasAdPageInfo || hasAdContentAuth;
}
function squareHandler(response) {
  return response.items ? response : response;
}
function removeMainTab(response) {
  // 删除头部信息
  if (response.loadedInfo && response.loadedInfo.headers) {
    delete response.loadedInfo.headers;
  }

  // 如果没有items，直接返回
  if (!response.items) return response;

  let filteredItems = [];

  for (let item of response.items) {
    // 过滤广告内容
    if (isAd(item.data)) {
      continue;
    }

    // 删除视频限制信息
    if (item.data?.page_info?.video_limit) {
      delete item.data.page_info.video_limit;
    }

    // 删除通用结构
    if (item.data?.common_struct) {
      delete item.data.common_struct;
    }

    // 根据类别过滤
    if (item.category) {
      if (item.category === "group") {
        // 只保留包含profile_top的组
        if (JSON.stringify(item.items).indexOf("profile_top") !== -1) {
          filteredItems.push(item);
        }
      } else {
        filteredItems.push(item);
      }
    } else {
      filteredItems.push(item);
    }
  }

  response.items = filteredItems;
  log("removeMainTab success");
  return response;
}
function removeMain(response) {
  // 删除头部信息
  if (response.loadedInfo && response.loadedInfo.headers) {
    delete response.loadedInfo.headers;
  }

  // 如果没有items，直接返回
  if (!response.items) return response;

  let filteredItems = [];

  for (let item of response.items) {
    if (item.category === "feed") {
      // 对feed类别，过滤广告
      if (!isAd(item.data)) {
        filteredItems.push(item);
      }
    } else if (item.category === "group") {
      // 处理group类别
      if (
        item.items.length > 0 &&
        item.items[0].data?.itemid?.includes("search_input")
      ) {
        // 搜索输入相关，保留特定项目
        item.items = item.items.filter(
          (subItem) =>
            subItem?.data?.itemid?.includes("mine_topics") ||
            subItem?.data?.itemid?.includes("search_input") ||
            subItem?.data?.card_type === 202
        );

        // 设置热词
        item.items[0].data.hotwords = [{ word: "搜索超话", tip: "" }];
        filteredItems.push(item);
      } else if (
        item.items.length > 0 &&
        item.items[0].data?.itemid?.includes("top_title")
      ) {
        // 跳过顶部标题
        continue;
      } else if (item.items.length > 0) {
        // 过滤其他组项目
        item.items = Object.values(item.items).filter(
          (subItem) =>
            subItem.category === "feed" || subItem.category === "card"
        );
        filteredItems.push(item);
      } else {
        filteredItems.push(item);
      }
    } else if (
      item.data?.card_type &&
      [202, 200].indexOf(item.data.card_type) > -1
    ) {
      // 跳过特定卡片类型
      continue;
    } else {
      filteredItems.push(item);
    }
  }

  response.items = filteredItems;
  log("removeMain success");
  return response;
}
function topicHandler(response) {
  const cards = response.cards;
  if (!cards) return response;

  // 如果不需要移除未关注话题和未使用部分，直接返回
  if (!mainConfig.removeUnfollowTopic && !mainConfig.removeUnusedPart)
    return response;

  let filteredCards = [];

  for (let card of cards) {
    let shouldKeep = true;

    if (card.mblog) {
      // 处理微博类型卡片
      let buttons = card.mblog.buttons;
      // 如果配置了移除未关注话题且按钮的第一项类型是follow，则移除
      if (
        mainConfig.removeUnfollowTopic &&
        buttons &&
        buttons[0].type === "follow"
      ) {
        shouldKeep = false;
      }
    } else {
      // 处理非微博类型卡片
      if (!mainConfig.removeUnusedPart) {
        continue;
      }

      // 根据不同条件过滤
      if (card.itemid === "bottom_mix_activity") {
        shouldKeep = false;
      } else if (card?.top?.title === "正在活跃") {
        shouldKeep = false;
      } else if (card.card_type === 200 && card.group) {
        shouldKeep = false;
      } else {
        let cardGroup = card.card_group;
        if (!cardGroup) continue;

        let firstCard = cardGroup[0];
        // 过滤特定类型的卡片组
        const filterItemIds = [
          "guess_like_title",
          "cats_top_title",
          "chaohua_home_readpost_samecity_title",
        ];

        if (filterItemIds.indexOf(firstCard.itemid) > -1) {
          shouldKeep = false;
        } else if (cardGroup.length > 1) {
          // 过滤卡片组中的特定项目
          let filteredCardGroup = [];
          for (let groupItem of cardGroup) {
            if (
              ["chaohua_discovery_banner_1", "bottom_mix_activity"].indexOf(
                groupItem.itemid
              ) === -1
            ) {
              filteredCardGroup.push(groupItem);
            }
          }
          card.card_group = filteredCardGroup;
        }
      }
    }

    if (shouldKeep) {
      filteredCards.push(card);
    }
  }

  response.cards = filteredCards;
  log("topicHandler success");
  return response;
}
function removeSearchMain(response) {
  let channels = response.channelInfo.channels;
  if (!channels) return response;

  let filteredChannels = [];

  for (let channel of channels) {
    if (channel.payload) {
      // 处理搜索内容
      removeSearch(channel.payload);

      // 删除标题相关信息
      delete channel.titleInfoAbsorb;
      delete channel.titleInfo;
      delete channel.title;

      filteredChannels.push(channel);
    }
  }

  response.channelInfo.channels = filteredChannels;

  // 处理头部数据
  if (response.header?.data) {
    removeHeader(response.header.data);
  }

  // 删除更多频道和频道配置
  if (response.channelInfo?.moreChannels) {
    delete response.channelInfo.moreChannels;
    delete response.channelInfo.channelConfig;
  }

  log("remove_search main success");
  return response;
}
function removeHeader(headerData) {
  if (!headerData.items) return headerData;

  let filteredItems = [];

  for (let item of headerData.items) {
    if (item.category === "group") {
      // 仅保留特定卡片类型的项目
      item.items = item.items.filter(
        (subItem) =>
          subItem.data?.card_type === null ||
          subItem.data?.card_type === 101 ||
          subItem.data?.card_type === 17
      );

      if (item.items.length > 0) {
        filteredItems.push(item);
      }
    }
  }

  log("remove Header success");
  headerData.items = filteredItems;
  return headerData;
}
function checkSearchWindow(item) {
  // 仅在需要移除搜索窗口时才进行检查
  if (!mainConfig.removeSearchWindow) {
    return false;
  }

  // 必须是card类别
  if (item.category !== "card") {
    return false;
  }

  // 检查是否为搜索窗口相关项目
  const searchWindowItemIds = [
    "finder_window",
    "discover_gallery",
    "more_frame",
  ];
  const searchWindowCardTypes = [208, 236, 247, 217, 101, 19];

  return (
    searchWindowItemIds.includes(item.data?.itemid) ||
    searchWindowCardTypes.includes(item.data?.card_type) ||
    item.data?.mblog?.page_info?.actionlog?.source?.includes("ad") ||
    item.data?.pic?.includes("ads")
  );
}
function removeSearch(response) {
  if (!response.items) return response;

  let filteredItems = [];

  for (let item of response.items) {
    if (item.category === "feed") {
      // 处理信息流
      if (!isAd(item.data)) {
        // 移除视频限制
        if (item.data?.page_info?.video_limit) {
          delete item.data.page_info.video_limit;
        }
        filteredItems.push(item);
      }
    } else if (item.category === "group") {
      // 处理组类型数据
      if (item.header?.type !== "guess") {
        // 过滤特定卡片类型
        item.items = item.items.filter(
          (subItem) =>
            subItem.data?.card_type === null ||
            subItem.data?.card_type === 17 ||
            subItem.data?.card_type === 10
        );

        if (item.items.length > 0) {
          filteredItems.push(item);
        }
      }
    } else if (!checkSearchWindow(item)) {
      // 非搜索窗口项目保留
      filteredItems.push(item);
    }
  }

  response.items = filteredItems;

  // 清理搜索栏内容和样式
  if (response.loadedInfo) {
    response.loadedInfo.searchBarContent = [];
    if (response.loadedInfo.headerBack) {
      response.loadedInfo.headerBack.channelStyleMap = {};
    }
  }

  log("remove_search success");
  return response;
}
function removeMsgAd(response) {
  if (response.messages) {
    // 过滤掉带有广告标签的消息
    let filteredMessages = [];
    for (let message of response.messages) {
      if (!message.msg_card?.ad_tag) {
        filteredMessages.push(message);
      }
    }
    response.messages = filteredMessages;
  }
  return response;
}
function removePage(response) {
  // 先移除卡片广告
  removeCards(response);

  // 移除置顶热搜
  if (
    mainConfig.removePinedTrending &&
    response.cards &&
    response.cards.length > 0 &&
    response.cards[0].card_group
  ) {
    response.cards[0].card_group = response.cards[0].card_group.filter(
      (item) =>
        !(
          item?.actionlog?.ext?.includes("ads_word") ||
          item?.itemid?.includes("t:51") ||
          item?.itemid?.includes("ads_word")
        )
    );
  }

  return response;
}
function removeCards(response) {
  // 清空热词
  if (response.hotwords) {
    response.hotwords = [];
  }

  // 处理卡片
  if (response.cards) {
    let filteredCards = [];

    for (let card of response.cards) {
      // 处理特定容器ID的卡片类型
      if (
        response.cardlistInfo?.containerid === "232082type=1" &&
        [17, 58, 11].includes(card.card_type)
      ) {
        let newCardType = card.card_type + 1;
        card = { card_type: newCardType };
      }

      let cardGroup = card.card_group;
      if (cardGroup && cardGroup.length > 0) {
        // 处理卡片组
        let filteredCardGroup = [];

        for (const groupCard of cardGroup) {
          let groupCardType = groupCard.card_type;
          // 过滤广告和特定类型
          if (
            groupCardType === 118 ||
            isAd(groupCard.mblog) ||
            JSON.stringify(groupCard).indexOf("res_from:ads") !== -1
          ) {
            continue;
          }
          filteredCardGroup.push(groupCard);
        }

        card.card_group = filteredCardGroup;
        filteredCards.push(card);
      } else {
        // 处理单个卡片
        let cardType = card.card_type;

        if ([9, 165].includes(cardType)) {
          // 微博类型卡片，过滤广告
          if (!isAd(card.mblog)) {
            filteredCards.push(card);
          }
        } else if ([1007, 180].includes(cardType)) {
          // 跳过特定类型卡片
          continue;
        } else {
          filteredCards.push(card);
        }
      }
    }

    response.cards = filteredCards;
  }

  // 处理items
  if (response.items) {
    log("data.items");
    removeSearch(response);
  }
}
function lvZhouHandler(weiboData) {
  if (mainConfig.removeLvZhou && weiboData) {
    let commonStruct = weiboData.common_struct;
    if (commonStruct) {
      // 过滤掉绿洲相关内容
      let filteredStruct = [];
      for (const item of commonStruct) {
        if (item.name !== "绿洲") {
          filteredStruct.push(item);
        }
      }
      weiboData.common_struct = filteredStruct;
    }
  }
}
function isBlock(weiboData) {
  let blockIds = mainConfig.blockIds || [];

  // 如果没有设置屏蔽ID列表，直接返回false
  if (blockIds.length === 0) {
    return false;
  }

  // 获取用户ID
  let userId = weiboData.user.id;

  // 检查用户ID是否在屏蔽列表中
  for (const blockId of blockIds) {
    if (blockId == userId) {
      return true;
    }
  }

  return false;
}
function removeTimeLine(response) {
  // 删除广告、趋势、头部等信息
  const fieldsToRemove = ["ad", "advertises", "trends", "headers"];
  for (const field of fieldsToRemove) {
    if (response[field]) {
      delete response[field];
    }
  }

  // 处理状态流
  if (response.statuses) {
    let filteredStatuses = [];

    for (const status of response.statuses) {
      // 跳过广告内容
      if (isAd(status)) {
        continue;
      }

      // 处理绿洲内容
      lvZhouHandler(status);

      // 删除通用结构
      if (status.common_struct) {
        delete status.common_struct;
      }

      // 根据分类过滤
      if (status.category) {
        if (status.category !== "group") {
          filteredStatuses.push(status);
        }
      } else {
        filteredStatuses.push(status);
      }
    }

    response.statuses = filteredStatuses;
  }
}
function removeHomeVip(response) {
  if (response.header) {
    if (response.header.vipView) {
      response.header.vipView = null;
    }
  }
  return response;
}
function removeVideoRemind(response) {
  // 移除视频提醒相关设置
  response.bubble_dismiss_time = 0;
  response.exist_remind = false;
  response.image_dismiss_time = 0;
  response.image = "";
  response.tag_image_english = "";
  response.tag_image_english_dark = "";
  response.tag_image_normal = "";
  response.tag_image_normal_dark = "";
}
function itemExtendHandler(response) {
  // 移除趋势标题
  if (response.trend?.titles?.title) {
    delete response.trend;
  }

  // 根据配置移除关注数据
  if (mainConfig.removeFollow && response.follow_data) {
    response.follow_data = null;
  }

  // 根据配置移除打赏项目
  if (mainConfig.removeRewardItem && response.reward_info) {
    response.reward_info = null;
  }

  // 移除头部卡片
  if (response.head_cards) {
    delete response.head_cards;
  }

  // 移除页面提醒
  if (response.page_alerts) {
    response.page_alerts = null;
  }

  // 尝试处理趋势广告
  try {
    let btnPicUrl = response.trend.extra_struct.extBtnInfo.btn_picurl;
    if (btnPicUrl.indexOf("timeline_icon_ad_delete") > -1) {
      delete response.trend;
    }
  } catch (error) {
    // 忽略错误
  }

  // 修改菜单
  if (mainConfig.modifyMenus && response.custom_action_list) {
    let modifiedActionList = [];

    for (const action of response.custom_action_list) {
      let actionType = action.type;
      let shouldKeep = itemMenusConfig[actionType];

      if (shouldKeep === undefined) {
        // 未定义的菜单项保留
        modifiedActionList.push(action);
      } else if (actionType === "mblog_menus_copy_url") {
        // 复制链接的菜单项放到最前面
        modifiedActionList.unshift(action);
      } else if (shouldKeep) {
        // 配置为保留的菜单项
        modifiedActionList.push(action);
      }
    }

    response.custom_action_list = modifiedActionList;
  }
}
function updateFollowOrder(profileData) {
  try {
    for (let item of profileData.items) {
      if (item.itemId === "mainnums_friends") {
        // 修改关注列表的排序方式
        let scheme = item.click.modules[0].scheme;
        item.click.modules[0].scheme = scheme.replace(
          "231093_-_selfrecomm",
          "231093_-_selffollowed"
        );

        log("updateFollowOrder success");
        return;
      }
    }
  } catch (error) {
    console.log("updateFollowOrder fail");
  }
}
function updateProfileSkin(profileData, skinConfigKey) {
  try {
    // 获取皮肤配置
    let skinConfig = mainConfig[skinConfigKey];
    if (!skinConfig) {
      return;
    }

    let skinIndex = 0;

    for (let item of profileData.items) {
      if (item.image) {
        try {
          // 修改暗黑模式设置
          let darkMode = item.image.style.darkMode;
          if (darkMode !== "alpha") {
            item.image.style.darkMode = "alpha";
          }

          // 更新图标URL
          item.image.iconUrl = skinConfig[skinIndex++];

          // 清空小红点
          if (item.dot) {
            item.dot = [];
          }
        } catch (error) {
          // 忽略错误
        }
      }
    }

    log("updateProfileSkin success");
  } catch (error) {
    console.log("updateProfileSkin fail");
  }
}
function removeHome(response) {
  if (!response.items) return response;

  let filteredItems = [];

  for (let item of response.items) {
    let itemId = item.itemId;

    if (itemId === "profileme_mine") {
      // 处理个人资料主页
      if (mainConfig.removeHomeVip) {
        item = removeHomeVip(item);
      }

      // 删除VIP图标
      if (item.header?.vipIcon) {
        delete item.header.vipIcon;
      }

      // 更新关注排序
      updateFollowOrder(item);

      filteredItems.push(item);
    } else if (itemId === "100505_-_top8") {
      // 处理顶部8个图标
      updateProfileSkin(item, "profileSkin1");
      filteredItems.push(item);
    } else if (itemId === "100505_-_newcreator") {
      // 处理创作者中心
      if (item.type === "grid") {
        updateProfileSkin(item, "profileSkin2");
        filteredItems.push(item);
      } else if (!mainConfig.removeHomeCreatorTask) {
        // 如果不移除创作者任务，保留
        filteredItems.push(item);
      }
    } else if (
      itemId === "100505_-_chaohua" ||
      itemId === "100505_-_manage" ||
      itemId === "100505_-_recentlyuser"
    ) {
      // 处理超话、管理、最近访问用户
      if (item.images?.length > 0) {
        item.images = item.images.filter(
          (image) =>
            image.itemId === "100505_-_chaohua" ||
            image.itemId === "100505_-_recentlyuser"
        );
      }
      filteredItems.push(item);
    } else {
      // 跳过其他类型
      continue;
    }
  }

  response.items = filteredItems;
  return response;
}
function removeCheckin(response) {
  log("remove tab1签到");
  response.show = 0;
}
function removeMediaHomelist(response) {
  if (mainConfig.removeLiveMedia) {
    log("remove 首页直播");
    response.data = {};
  }
}
function removeComments(response) {
  let commentDatas = response.datas || [];

  if (commentDatas.length) {
    let filteredDatas = [];

    for (const commentData of commentDatas) {
      // 过滤趋势、AI生成的评论
      if (
        commentData.item_category !== "trend" &&
        !commentData.data?.user?.is_vai &&
        !commentData.data.reply_ai_type
      ) {
        // 处理评论中的AI回复
        const processedData = removeAi(commentData);
        filteredDatas.push(processedData);
      }
    }

    log(`remove 评论区相关和推荐内容7`);
    response.datas = filteredDatas;
  }
}
function removeAi(commentData) {
  // 处理评论中的子评论
  if (commentData.data.comments?.length) {
    let filteredComments = [];

    for (const comment of commentData.data.comments) {
      // 过滤非AI评论
      if (!comment.user.is_vai && !comment.reply_ai_type) {
        filteredComments.push(comment);
      }
    }

    commentData.data.comments = filteredComments;
  }

  return commentData;
}
function containerHandler(response) {
  // 移除超话里的好友
  if (
    mainConfig.removeInterestFriendInTopic &&
    response.card_type_name === "超话里的好友"
  ) {
    log("remove 超话里的好友");
    response.card_group = [];
  }

  // 移除感兴趣的超话和超话好友关注
  if (mainConfig.removeInterestTopic && response.itemid) {
    if (response.itemid.indexOf("infeed_may_interest_in") > -1) {
      log("remove 感兴趣的超话");
      response.card_group = [];
    } else if (response.itemid.indexOf("infeed_friends_recommend") > -1) {
      log("remove 超话好友关注");
      response.card_group = [];
    }
  }
}
function userHandler(response) {
  // 先执行removeMainTab
  response = removeMainTab(response);

  // 如果不需要移除感兴趣用户，直接返回
  if (!mainConfig.removeInterestUser) {
    return response;
  }

  // 如果没有items，直接返回
  if (!response.items) {
    return response;
  }

  let filteredItems = [];

  for (let item of response.items) {
    let shouldKeep = true;

    // 检查是否为可能感兴趣的人分组
    if (item.category === "group") {
      try {
        if (item.items[0].data.desc === "可能感兴趣的人") {
          shouldKeep = false;
        }
      } catch (error) {
        // 忽略错误
      }
    }

    if (shouldKeep) {
      // 删除通用结构
      if (item.data?.common_struct) {
        delete item.data.common_struct;
      }

      filteredItems.push(item);
    }
  }

  response.items = filteredItems;
  log("removeMain sub success");
  return response;
}
function nextVideoHandler(response) {
  // 清空下一个视频推荐
  if (!response.statuses) return response;
  response.statuses = [];
  return response;
}
function tabSkinHandler(response) {
  try {
    // 获取标签图标版本
    let iconVersion = mainConfig.tabIconVersion;

    // 设置可用标志
    response.data.canUse = 1;

    // 如果没有图标版本或路径，直接返回
    if (!iconVersion || !mainConfig.tabIconPath) {
      return response;
    }

    // 如果版本号小于100，直接返回
    if (iconVersion < 100) {
      return response;
    }

    // 更新所有图标的版本和下载链接
    let iconList = response.data.list;
    for (let icon of iconList) {
      icon.version = iconVersion;
      icon.downloadlink = mainConfig.tabIconPath;
    }

    log("tabSkinHandler success");
  } catch (error) {
    log("tabSkinHandler fail");
  }

  return response;
}
function skinPreviewHandler(response) {
  response.data.skin_info.status = 1;
  return response;
}
function removeLuaScreenAds(response) {
  if (!response.cached_ad) return response;

  // 设置广告的时间范围为未来，使其不显示
  for (let ad of response.cached_ad.ads) {
    ad.start_date = 1893254400; // 设置未来的开始时间
    ad.show_count = 0; // 设置显示次数为0
    ad.duration = 0; // 设置显示时间为0
    ad.end_date = 1893340799; // 设置未来的结束时间
  }

  return response;
}
function removePhpScreenAds(response) {
  if (!response.ads) return response;

  // 禁用所有广告推送设置
  response.show_push_splash_ad = false;
  response.background_delay_display_time = 0;
  response.lastAdShow_delay_display_time = 0;
  response.realtime_ad_video_stall_time = 0;
  response.realtime_ad_timeout_duration = 0;

  // 修改所有广告的显示设置
  for (let ad of response.ads) {
    ad.displaytime = 0; // 展示时间
    ad.displayintervel = 86400; // 展示间隔
    ad.allowdaydisplaynum = 0; // 允许每天展示数量
    ad.displaynum = 0; // 展示数量
    ad.displaytime = 1; // 再次设置展示时间
    ad.begintime = "2029-12-30 00:00:00"; // 开始时间
    ad.endtime = "2029-12-30 23:59:59"; // 结束时间
  }

  return response;
}
function log(message, jsonData) {
  // 只在调试模式下输出日志
  if (mainConfig.isDebug) {
    console.log(message, jsonData || "");
  }
}
var body = $response.body;
var url = $request.url;

// 获取处理方法
let method = getModifyMethod(url);

if (method) {
  log(method);

  // 解析响应数据
  let data = JSON.parse(body.match(/\{.*\}/)[0]);

  // 执行对应的处理函数
  let handler = eval(method);
  data = new handler(data);

  // 将处理后的数据转回字符串
  body = JSON.stringify(data);

  // 处理PHP屏幕广告的特殊情况
  if (method === "removePhpScreenAds") {
    body = body + "OK";
  }
}

$done({ body });
