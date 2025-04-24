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
  },
  itemMenusConfig = {
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
  },
  modifyCardsUrls = ["/cardlist", "video/community_tab", "searchall"],
  modifyStatusesUrls = [
    "statuses/friends/timeline",
    "statuses_unread_hot_timeline",
    "statuses/unread_friends_timeline",
    "statuses/unread_hot_timeline",
    "groups/timeline",
    "statuses/friends_timeline",
  ],
  otherUrls = {
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
  for (const pattern of modifyCardsUrls)
    if (-1 < url.indexOf(pattern)) return "removeCards";
  for (const pattern of modifyStatusesUrls)
    if (-1 < url.indexOf(pattern)) return "removeTimeLine";
  for (const [pattern, handler] of Object.entries(otherUrls))
    if (-1 < url.indexOf(pattern)) return handler;
  return null;
}
function removeRealtimeAd(data) {
  return delete data.ads, (data.code = 4016), data;
}
function removeAdBanner(data) {
  return (
    data.data.close_ad_setting && delete data.data.close_ad_setting,
    data.data.detail_banner_ad && (data.data.detail_banner_ad = []),
    data
  );
}
function removeAdPreload(data) {
  if (!data.ads) return data;
  data.last_ad_show_interval = 86400;
  for (let adItem of data.ads)
    (adItem.start_time = 2681574400),
      (adItem.end_time = 2681660799),
      (adItem.display_duration = 0),
      (adItem.daily_display_cnt = 0),
      (adItem.total_display_cnt = 0);
  return data;
}
function removeIntlOpenAds(data) {
  return data.data ? ((data.data = { display_ad: 1 }), data) : data;
}
function removeSearchTopic(data) {
  return data.data && 0 !== data.data.search_topic?.cards.length
    ? ((data.data.search_topic.cards = Object.values(
        data.data.search_topic.cards
      ).filter((card) => "searchtop" != card.type)),
      data.data.trending_topic && delete data.data.trending_topic,
      data)
    : data;
}
function modifiedUserCenter(data) {
  return data.data && 0 !== data.data.length
    ? (data.data.cards &&
        (data.data.cards = Object.values(data.data.cards).filter(
          (card) => "personal_vip" != card.items[0].type
        )),
      data)
    : data;
}
function removeTopics(data) {
  return data.data ? ((data.data.order = ["search_topic"]), data) : data;
}
function isAd(content) {
  return (
    !!content &&
    (!("广告" != content.mblogtypename && "热推" != content.mblogtypename) ||
      !("ad" != content.promotion?.type) ||
      !("ad" != content.page_info?.actionlog?.source) ||
      !("广告" != content.content_auth_info?.content_auth_title))
  );
}
function squareHandler(data) {
  return data.items ? data : data;
}
function removeMainTab(data) {
  if (
    (data.loadedInfo &&
      data.loadedInfo.headers &&
      delete data.loadedInfo.headers,
    !data.items)
  )
    return data;
  let filteredItems = [];
  for (let item of data.items)
    isAd(item.data) ||
      (item.data?.page_info?.video_limit &&
        delete item.data.page_info.video_limit,
      item.data?.common_struct && delete item.data.common_struct,
      item.category
        ? "group" == item.category
          ? -1 != JSON.stringify(item.items).indexOf("profile_top") &&
            filteredItems.push(item)
          : filteredItems.push(item)
        : filteredItems.push(item));
  return (data.items = filteredItems), log("removeMainTab success"), data;
}
function removeMain(data) {
  if (
    (data.loadedInfo &&
      data.loadedInfo.headers &&
      delete data.loadedInfo.headers,
    !data.items)
  )
    return data;
  let filteredItems = [];
  for (let item of data.items)
    if ("feed" == item.category) isAd(item.data) || filteredItems.push(item);
    else if ("group" == item.category) {
      if (
        0 < item.items.length &&
        item.items[0].data?.itemid?.includes("search_input")
      )
        (item.items = item.items.filter(
          (subItem) =>
            subItem?.data?.itemid?.includes("mine_topics") ||
            subItem?.data?.itemid?.includes("search_input") ||
            202 == subItem?.data?.card_type
        )),
          (item.items[0].data.hotwords = [{ word: "搜索超话", tip: "" }]),
          filteredItems.push(item);
      else if (
        0 < item.items.length &&
        item.items[0].data?.itemid?.includes("top_title")
      )
        continue;
      else
        0 < item.items.length
          ? ((item.items = Object.values(item.items).filter(
              (subItem) =>
                "feed" == subItem.category || "card" == subItem.category
            )),
            filteredItems.push(item))
          : filteredItems.push(item);
    } else if (
      item.data?.card_type &&
      -1 < [202, 200].indexOf(item.data.card_type)
    )
      continue;
    else filteredItems.push(item);
  return (data.items = filteredItems), log("removeMain success"), data;
}
function topicHandler(data) {
  const cards = data.cards;
  if (!cards) return data;
  if (!mainConfig.removeUnfollowTopic && !mainConfig.removeUnusedPart)
    return data;
  let filteredCards = [];
  for (let card of cards) {
    let shouldKeep = true;
    if (card.mblog) {
      let buttons = card.mblog.buttons;
      mainConfig.removeUnfollowTopic &&
        buttons &&
        "follow" == buttons[0].type &&
        (shouldKeep = false);
    } else {
      if (!mainConfig.removeUnusedPart) continue;
      if ("bottom_mix_activity" == card.itemid) shouldKeep = false;
      else if ("正在活跃" == card?.top?.title) shouldKeep = false;
      else if (200 == card.card_type && card.group) shouldKeep = false;
      else {
        let cardGroup = card.card_group;
        if (!cardGroup) continue;
        let firstCard = cardGroup[0];
        if (
          -1 <
          [
            "guess_like_title",
            "cats_top_title",
            "chaohua_home_readpost_samecity_title",
          ].indexOf(firstCard.itemid)
        )
          shouldKeep = false;
        else if (1 < cardGroup.length) {
          let filteredCardGroup = [];
          for (let groupItem of cardGroup)
            -1 ==
              ["chaohua_discovery_banner_1", "bottom_mix_activity"].indexOf(
                groupItem.itemid
              ) && filteredCardGroup.push(groupItem);
          card.card_group = filteredCardGroup;
        }
      }
    }
    shouldKeep && filteredCards.push(card);
  }
  return (data.cards = filteredCards), log("topicHandler success"), data;
}
function removeSearchMain(data) {
  let channels = data.channelInfo.channels;
  if (!channels) return data;
  let filteredChannels = [];
  for (let channel of channels)
    channel.payload &&
      (removeSearch(channel.payload),
      delete channel.titleInfoAbsorb,
      delete channel.titleInfo,
      delete channel.title,
      filteredChannels.push(channel));
  return (
    (data.channelInfo.channels = filteredChannels),
    data.header?.data && removeHeader(data.header.data),
    data.channelInfo?.moreChannels &&
      (delete data.channelInfo.moreChannels,
      delete data.channelInfo.channelConfig),
    log("remove_search main success"),
    data
  );
}
function removeHeader(headerData) {
  if (!headerData.items) return headerData;
  let filteredItems = [];
  for (let item of headerData.items)
    "group" == item.category &&
      ((item.items = item.items.filter(
        (subItem) =>
          null == subItem.data?.card_type ||
          101 === subItem.data?.card_type ||
          17 === subItem.data?.card_type
      )),
      0 < item.items.length && filteredItems.push(item));
  return (
    log("remove Header success"), (headerData.items = filteredItems), headerData
  );
}
function checkSearchWindow(item) {
  return (
    !!mainConfig.removeSearchWindow &&
    !("card" != item.category) &&
    ("finder_window" == item.data?.itemid ||
      "discover_gallery" == item.data?.itemid ||
      "more_frame" == item.data?.itemid ||
      208 == item.data?.card_type ||
      236 == item.data?.card_type ||
      247 == item.data?.card_type ||
      217 == item.data?.card_type ||
      101 == item.data?.card_type ||
      19 == item.data?.card_type ||
      item.data?.mblog?.page_info?.actionlog?.source?.includes("ad") ||
      item.data?.pic?.includes("ads"))
  );
}
function removeSearch(data) {
  if (!data.items) return data;
  let filteredItems = [];
  for (let item of data.items)
    "feed" == item.category
      ? isAd(item.data) ||
        (item.data?.page_info?.video_limit &&
          delete item.data.page_info.video_limit,
        filteredItems.push(item))
      : "group" == item.category
      ? "guess" !== item.header?.type &&
        ((item.items = item.items.filter(
          (subItem) =>
            null == subItem.data?.card_type ||
            17 === subItem.data?.card_type ||
            10 === subItem.data?.card_type
        )),
        0 < item.items.length && filteredItems.push(item))
      : checkSearchWindow(item) || filteredItems.push(item);
  return (
    (data.items = filteredItems),
    data.loadedInfo &&
      ((data.loadedInfo.searchBarContent = []),
      data.loadedInfo.headerBack &&
        (data.loadedInfo.headerBack.channelStyleMap = {})),
    log("remove_search success"),
    data
  );
}
function removeMsgAd(data) {
  if (data.messages) {
    let filteredMessages = [];
    for (let message of data.messages)
      message.msg_card?.ad_tag || filteredMessages.push(message);
    return (data.messages = filteredMessages), data;
  }
  return response;
}
function removePage(data) {
  return (
    removeCards(data),
    mainConfig.removePinedTrending &&
      data.cards &&
      0 < data.cards.length &&
      data.cards[0].card_group &&
      (data.cards[0].card_group = data.cards[0].card_group.filter(
        (cardItem) =>
          !(
            cardItem?.actionlog?.ext?.includes("ads_word") ||
            cardItem?.itemid?.includes("t:51") ||
            cardItem?.itemid?.includes("ads_word")
          )
      )),
    data
  );
}
function removeCards(data) {
  if ((data.hotwords && (data.hotwords = []), data.cards)) {
    let filteredCards = [];
    for (let card of data.cards) {
      if (
        "232082type=1" == data.cardlistInfo?.containerid &&
        (17 == card.card_type || 58 == card.card_type || 11 == card.card_type)
      ) {
        var modifiedCardType = card.card_type + 1;
        card = { card_type: modifiedCardType };
      }
      let cardGroup = card.card_group;
      if (cardGroup && 0 < cardGroup.length) {
        let filteredCardGroup = [];
        for (const groupItem of cardGroup) {
          let cardType = groupItem.card_type;
          118 == cardType ||
            isAd(groupItem.mblog) ||
            -1 != JSON.stringify(groupItem).indexOf("res_from:ads") ||
            filteredCardGroup.push(groupItem);
        }
        (card.card_group = filteredCardGroup), filteredCards.push(card);
      } else {
        let cardType = card.card_type;
        if (-1 < [9, 165].indexOf(cardType))
          isAd(card.mblog) || filteredCards.push(card);
        else if (-1 < [1007, 180].indexOf(cardType)) continue;
        else filteredCards.push(card);
      }
    }
    data.cards = filteredCards;
  }
  data.items && (log("data.items"), removeSearch(data));
}
function lvZhouHandler(content) {
  if (mainConfig.removeLvZhou && content) {
    let commonStruct = content.common_struct;
    if (commonStruct) {
      let filteredStruct = [];
      for (const structItem of commonStruct)
        "绿洲" != structItem.name && filteredStruct.push(structItem);
      content.common_struct = filteredStruct;
    }
  }
}
function isBlock(content) {
  let blockIds = mainConfig.blockIds || [];
  if (0 === blockIds.length) return false;
  let userId = content.user.id;
  for (const blockId of blockIds) if (blockId == userId) return true;
  return false;
}
function removeTimeLine(data) {
  for (const key of ["ad", "advertises", "trends", "headers"])
    data[key] && delete data[key];
  if (data.statuses) {
    let filteredStatuses = [];
    for (const status of data.statuses)
      isAd(status) ||
        (lvZhouHandler(status),
        status.common_struct && delete status.common_struct,
        status.category
          ? "group" != status.category && filteredStatuses.push(status)
          : filteredStatuses.push(status));
    data.statuses = filteredStatuses;
  }
}
function removeHomeVip(data) {
  return data.header
    ? (data.header.vipView && (data.header.vipView = null), data)
    : data;
}
function removeVideoRemind(data) {
  (data.bubble_dismiss_time = 0),
    (data.exist_remind = false),
    (data.image_dismiss_time = 0),
    (data.image = ""),
    (data.tag_image_english = ""),
    (data.tag_image_english_dark = ""),
    (data.tag_image_normal = ""),
    (data.tag_image_normal_dark = "");
}
function itemExtendHandler(data) {
  if (data.trend?.titles?.title) {
    delete data.trend;
  }
  mainConfig.removeFollow && data.follow_data && (data.follow_data = null),
    mainConfig.removeRewardItem &&
      data.reward_info &&
      (data.reward_info = null),
    data.head_cards && delete data.head_cards,
    data.page_alerts && (data.page_alerts = null);
  try {
    let btnPicUrl = data.trend.extra_struct.extBtnInfo.btn_picurl;
    -1 < btnPicUrl.indexOf("timeline_icon_ad_delete") && delete data.trend;
  } catch (error) {}
  if (mainConfig.modifyMenus && data.custom_action_list) {
    let filteredActions = [];
    for (const action of data.custom_action_list) {
      let actionType = action.type,
        menuConfig = itemMenusConfig[actionType];
      menuConfig === void 0
        ? filteredActions.push(action)
        : "mblog_menus_copy_url" === actionType
        ? filteredActions.unshift(action)
        : menuConfig && filteredActions.push(action);
    }
    data.custom_action_list = filteredActions;
  }
}
function updateFollowOrder(data) {
  try {
    for (let item of data.items)
      if ("mainnums_friends" === item.itemId) {
        let scheme = item.click.modules[0].scheme;
        return (
          (item.click.modules[0].scheme = scheme.replace(
            "231093_-_selfrecomm",
            "231093_-_selffollowed"
          )),
          void log("updateFollowOrder success")
        );

        log("updateFollowOrder success");
        return;
      }
  } catch (error) {
    console.log("updateFollowOrder fail");
  }
}
function updateProfileSkin(data, skinKey) {
  try {
    let skinConfig = mainConfig[skinKey];
    if (!skinConfig) return;
    let iconIndex = 0;
    for (let item of data.items)
      if (item.image)
        try {
          let darkMode = item.image.style.darkMode;
          "alpha" != darkMode && (item.image.style.darkMode = "alpha"),
            (item.image.iconUrl = skinConfig[iconIndex++]),
            item.dot && (item.dot = []);
        } catch (error) {}
    log("updateProfileSkin success");
  } catch (error) {
    console.log("updateProfileSkin fail");
  }
}
function removeHome(data) {
  if (!data.items) return data;
  let filteredItems = [];
  for (let item of data.items) {
    let itemId = item.itemId;
    if ("profileme_mine" == itemId)
      mainConfig.removeHomeVip && (item = removeHomeVip(item)),
        item.header?.vipIcon && delete item.header.vipIcon,
        updateFollowOrder(item),
        filteredItems.push(item);
    else if ("100505_-_top8" == itemId)
      updateProfileSkin(item, "profileSkin1"), filteredItems.push(item);
    else if ("100505_-_newcreator" == itemId)
      "grid" == item.type
        ? (updateProfileSkin(item, "profileSkin2"), filteredItems.push(item))
        : !mainConfig.removeHomeCreatorTask && filteredItems.push(item);
    else if (
      "100505_-_chaohua" == itemId ||
      "100505_-_manage" == itemId ||
      "100505_-_recentlyuser" == itemId
    )
      0 < item.images?.length &&
        (item.images = item.images.filter(
          (image) =>
            "100505_-_chaohua" == image.itemId ||
            "100505_-_recentlyuser" == image.itemId
        )),
        filteredItems.push(item);
    else continue;
  }
  return (data.items = filteredItems), data;
}
function removeCheckin(data) {
  log("remove tab1签到"), (data.show = 0);
}
function removeMediaHomelist(data) {
  mainConfig.removeLiveMedia && (log("remove 首页直播"), (data.data = {}));
}
function removeComments(data) {
  let comments = data.datas || [];
  if (comments.length) {
    let filteredComments = [];
    for (const comment of comments) {
      if (
        comment.item_category !== "trend" &&
        !comment.data?.user?.is_vai &&
        !comment.data.reply_ai_type
      ) {
        const processedComment = removeAi(comment);
        filteredComments.push(processedComment);
      }
    }
    log(`remove 评论区相关和推荐内容 11:10:04`);
    data.datas = filteredComments;
  }
}

function removeAi(data) {
  if (data.data.comments?.length) {
    let comments = [];
    for (const comment of data.data.comments) {
      if (!comment.user.is_vai && !comment.reply_ai_type) {
        comments.push(comment);
      }
    }

    commentData.data.comments = filteredComments;
  }

  return commentData;
}

function containerHandler(data) {
  mainConfig.removeInterestFriendInTopic &&
    "超话里的好友" === data.card_type_name &&
    (log("remove 超话里的好友"), (data.card_group = [])),
    mainConfig.removeInterestTopic &&
      data.itemid &&
      (-1 < data.itemid.indexOf("infeed_may_interest_in")
        ? (log("remove 感兴趣的超话"), (data.card_group = []))
        : -1 < data.itemid.indexOf("infeed_friends_recommend") &&
          (log("remove 超话好友关注"), (data.card_group = [])));
}
function userHandler(data) {
  if (((data = removeMainTab(data)), !mainConfig.removeInterestUser))
    return data;
  if (!data.items) return data;
  let filteredItems = [];
  for (let item of data.items) {
    let shouldKeep = true;
    if ("group" == item.category)
      try {
        "可能感兴趣的人" == item.items[0].data.desc && (shouldKeep = false);
      } catch (error) {}
    shouldKeep &&
      (item.data?.common_struct && delete item.data.common_struct,
      filteredItems.push(item));
  }
  return (data.items = filteredItems), log("removeMain sub success"), data;
}
function nextVideoHandler(data) {
  if (!data.statuses) return data;
  data.statuses = [];
  return data;
}
function tabSkinHandler(data) {
  try {
    let iconVersion = mainConfig.tabIconVersion;
    if (((data.data.canUse = 1), !iconVersion || !mainConfig.tabIconPath))
      return;
    if (100 > iconVersion) return;
    let iconList = data.data.list;
    for (let icon of iconList)
      (icon.version = iconVersion),
        (icon.downloadlink = mainConfig.tabIconPath);
    log("tabSkinHandler success");
  } catch (error) {
    log("tabSkinHandler fail");
  }

  return response;
}
function skinPreviewHandler(data) {
  data.data.skin_info.status = 1;
}
function removeLuaScreenAds(data) {
  if (!data.cached_ad) return data;
  for (let adItem of data.cached_ad.ads)
    (adItem.start_date = 1893254400),
      (adItem.show_count = 0),
      (adItem.duration = 0),
      (adItem.end_date = 1893340799);
  return data;
}
function removePhpScreenAds(data) {
  if (!data.ads) return data;
  (data.show_push_splash_ad = false),
    (data.background_delay_display_time = 0),
    (data.lastAdShow_delay_display_time = 0),
    (data.realtime_ad_video_stall_time = 0),
    (data.realtime_ad_timeout_duration = 0);
  for (let adItem of data.ads)
    (adItem.displaytime = 0),
      (adItem.displayintervel = 86400),
      (adItem.allowdaydisplaynum = 0),
      (adItem.displaynum = 0),
      (adItem.displaytime = 1),
      (adItem.begintime = "2029-12-30 00:00:00"),
      (adItem.endtime = "2029-12-30 23:59:59");
  return data;
}
function log(message, json) {
  mainConfig.isDebug && console.log(message, json || "");
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
