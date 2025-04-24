const mainConfig = {
  isDebug: true,
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
  tabIconPath: '',
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
const modifyCardsUrls = ['/cardlist', 'video/community_tab', 'searchall'];
const modifyStatusesUrls = [
  'statuses/friends/timeline',
  'statuses_unread_hot_timeline',
  'statuses/unread_friends_timeline',
  'statuses/unread_hot_timeline',
  'groups/timeline',
  'statuses/friends_timeline',
];
const otherUrls = {
  '/profile/me': 'removeHome',
  '/statuses/extend': 'itemExtendHandler',
  '/video/remind_info': 'removeVideoRemind',
  '/checkin/show': 'removeCheckin',
  '/live/media_homelist': 'removeMediaHomelist',
  '/comments/build_comments': 'removeComments',
  '/container/get_item': 'containerHandler',
  '/profile/container_timeline': 'userHandler',
  '/video/tiny_stream_video_list': 'nextVideoHandler',
  '/2/statuses/video_mixtimeline': 'nextVideoHandler',
  'video/tiny_stream_mid_detail': 'nextVideoHandler',
  '/!/client/light_skin': 'tabSkinHandler',
  '/littleskin/preview': 'skinPreviewHandler',
  '/search/finder': 'removeSearchMain',
  '/search/container_timeline': 'removeSearch',
  '/search/container_discover': 'removeSearch',
  '/2/messageflow': 'removeMsgAd',
  '/2/page?': 'removePage',
  '/statuses/unread_topic_timeline': 'topicHandler',
  '/square&pageDataType/': 'squareHandler',
  '/statuses/container_timeline_topic': 'removeMain',
  '/statuses/container_timeline': 'removeMainTab',
  'wbapplua/wbpullad.lua': 'removeLuaScreenAds',
  'interface/sdk/sdkad.php': 'removePhpScreenAds',
  'a=trends': 'removeTopics',
  user_center: 'modifiedUserCenter',
  'a=get_coopen_ads': 'removeIntlOpenAds',
  'php?a=search_topic': 'removeSearchTopic',
  'ad/realtime': 'removeRealtimeAd',
  'ad/preload': 'removeAdPreload',
  'php?a=open_app': 'removeAdBanner',
};
function getModifyMethod(url) {
  if (!url || typeof url !== 'string') {
    return null;
  }

  for (const pattern of modifyCardsUrls) {
    if (url.includes(pattern)) {
      return 'removeCards';
    }
  }

  for (const pattern of modifyStatusesUrls) {
    if (url.includes(pattern)) {
      return 'removeTimeLine';
    }
  }

  for (const [urlPattern, methodName] of Object.entries(otherUrls)) {
    if (url.includes(urlPattern)) {
      return methodName;
    }
  }

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
  if (!response.ads) {
    return response;
  }

  response.last_ad_show_interval = 86400;
  for (const adItem of response.ads) {
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
  if (!response.data || !response.data.search_topic?.cards.length) {
    return response;
  }

  response.data.search_topic.cards = Object.values(response.data.search_topic.cards).filter(
    (card) => card.type != 'searchtop',
  );

  if (response.data.trending_topic) {
    delete response.data.trending_topic;
  }

  return response;
}

function modifiedUserCenter(response) {
  if (!response.data || response.data.length === 0) {
    return response;
  }

  if (response.data.cards) {
    response.data.cards = Object.values(response.data.cards).filter((card) => card.items[0].type != 'personal_vip');
  }

  return response;
}

function removeTopics(response) {
  if (response.data) {
    response.data.order = ['search_topic'];
  }
  return response;
}

function isAd(content) {
  if (!content) {
    return false;
  }

  if (content.mblogtypename === '广告' || content.mblogtypename === '热推') {
    return true;
  }

  if (content.promotion?.type === 'ad') {
    return true;
  }

  if (content.page_info?.actionlog?.source === 'ad') {
    return true;
  }

  if (content.content_auth_info?.content_auth_title === '广告') {
    return true;
  }

  return false;
}

function squareHandler(response) {
  return response;
}

function removeMainTab(response) {
  if (response.loadedInfo && response.loadedInfo.headers) {
    delete response.loadedInfo.headers;
  }

  if (!response.items) {
    return response;
  }

  const filteredItems = [];
  for (const item of response.items) {
    if (!isAd(item.data)) {
      if (item.data?.page_info?.video_limit) {
        delete item.data.page_info.video_limit;
      }

      if (item.data?.common_struct) {
        delete item.data.common_struct;
      }

      if (item.category) {
        if (item.category === 'group') {
          if (JSON.stringify(item.items).indexOf('profile_top') !== -1) {
            filteredItems.push(item);
          }
        } else {
          filteredItems.push(item);
        }
      } else {
        filteredItems.push(item);
      }
    }
  }

  response.items = filteredItems;
  log('removeMainTab success');
  return response;
}

function removeMain(response) {
  if (response.loadedInfo && response.loadedInfo.headers) {
    delete response.loadedInfo.headers;
  }

  if (!response.items) {
    return response;
  }

  const filteredItems = [];
  for (const item of response.items) {
    if (item.category === 'feed') {
      if (!isAd(item.data)) {
        filteredItems.push(item);
      }
    } else if (item.category === 'group') {
      if (item.items.length > 0) {
        if (item.items[0].data?.itemid?.includes('search_input')) {
          item.items = item.items.filter(
            (groupItem) =>
              groupItem?.data?.itemid?.includes('mine_topics') ||
              groupItem?.data?.itemid?.includes('search_input') ||
              groupItem?.data?.card_type == 202,
          );

          item.items[0].data.hotwords = [{ word: '搜索超话', tip: '' }];
          filteredItems.push(item);
        } else if (item.items[0].data?.itemid?.includes('top_title')) {
          continue;
        } else {
          if (item.items.length > 0) {
            item.items = Object.values(item.items).filter(
              (groupItem) => groupItem.category === 'feed' || groupItem.category === 'card',
            );
            filteredItems.push(item);
          } else {
            filteredItems.push(item);
          }
        }
      }
    } else if (item.data?.card_type && [202, 200].indexOf(item.data.card_type) > -1) {
      continue;
    } else {
      filteredItems.push(item);
    }
  }

  response.items = filteredItems;
  log('removeMain success');
  return response;
}

function topicHandler(response) {
  const cards = response.cards;
  if (!cards) {
    return response;
  }

  if (!mainConfig.removeUnfollowTopic && !mainConfig.removeUnusedPart) {
    return response;
  }

  const filteredCards = [];
  for (const card of cards) {
    let shouldKeep = true;
    if (card.mblog) {
      const buttons = card.mblog.buttons;
      if (mainConfig.removeUnfollowTopic && buttons && buttons[0].type == 'follow') {
        shouldKeep = false;
      }
    } else {
      if (!mainConfig.removeUnusedPart) {
        continue;
      }

      if (card.itemid == 'bottom_mix_activity') {
        shouldKeep = false;
      } else if (card?.top?.title == '正在活跃') {
        shouldKeep = false;
      } else if (card.card_type == 200 && card.group) {
        shouldKeep = false;
      } else {
        const cardGroup = card.card_group;
        if (!cardGroup) {
          continue;
        }

        const firstItem = cardGroup[0];
        if (
          ['guess_like_title', 'cats_top_title', 'chaohua_home_readpost_samecity_title'].indexOf(firstItem.itemid) > -1
        ) {
          shouldKeep = false;
        } else if (cardGroup.length > 1) {
          const filteredGroup = [];
          for (const groupItem of cardGroup) {
            if (['chaohua_discovery_banner_1', 'bottom_mix_activity'].indexOf(groupItem.itemid) == -1) {
              filteredGroup.push(groupItem);
            }
          }

          card.card_group = filteredGroup;
        }
      }
    }

    if (shouldKeep) {
      filteredCards.push(card);
    }
  }

  response.cards = filteredCards;
  log('topicHandler success');
  return response;
}

function removeSearchMain(response) {
  const channels = response.channelInfo.channels;
  if (!channels) {
    return response;
  }

  const filteredChannels = [];
  for (const channel of channels) {
    if (channel.payload) {
      removeSearch(channel.payload);
      delete channel.titleInfoAbsorb;
      delete channel.titleInfo;
      delete channel.title;
      filteredChannels.push(channel);
    }
  }

  response.channelInfo.channels = filteredChannels;

  if (response.header?.data) {
    removeHeader(response.header.data);
  }

  if (response.channelInfo?.moreChannels) {
    delete response.channelInfo.moreChannels;
    delete response.channelInfo.channelConfig;
  }

  log('remove_search main success');
  return response;
}

function removeHeader(headerData) {
  if (!headerData.items) {
    return headerData;
  }

  const filteredItems = [];
  for (const item of headerData.items) {
    if (item.category === 'group') {
      item.items = item.items.filter(
        (groupItem) =>
          groupItem.data?.card_type === null || groupItem.data?.card_type === 101 || groupItem.data?.card_type === 17,
      );

      if (item.items.length > 0) {
        filteredItems.push(item);
      }
    }
  }

  headerData.items = filteredItems;
  log('remove Header success');
  return headerData;
}

function checkSearchWindow(item) {
  if (!mainConfig.removeSearchWindow || item.category !== 'card') {
    return false;
  }

  if (
    item.data?.itemid === 'finder_window' ||
    item.data?.itemid === 'discover_gallery' ||
    item.data?.itemid === 'more_frame'
  ) {
    return true;
  }

  if (
    item.data?.card_type === 208 ||
    item.data?.card_type === 236 ||
    item.data?.card_type === 247 ||
    item.data?.card_type === 217 ||
    item.data?.card_type === 101 ||
    item.data?.card_type === 19
  ) {
    return true;
  }

  if (item.data?.mblog?.page_info?.actionlog?.source?.includes('ad') || item.data?.pic?.includes('ads')) {
    return true;
  }

  return false;
}

function removeSearch(response) {
  if (!response.items) {
    return response;
  }

  const filteredItems = [];
  for (const item of response.items) {
    if (item.category === 'feed') {
      if (!isAd(item.data)) {
        if (item.data?.page_info?.video_limit) {
          delete item.data.page_info.video_limit;
        }
        filteredItems.push(item);
      }
    } else if (item.category === 'group') {
      if (item.header?.type !== 'guess') {
        item.items = item.items.filter(
          (groupItem) =>
            groupItem.data?.card_type == null || groupItem.data?.card_type === 17 || groupItem.data?.card_type === 10,
        );

        if (item.items.length > 0) {
          filteredItems.push(item);
        }
      }
    } else if (!checkSearchWindow(item)) {
      filteredItems.push(item);
    }
  }

  response.items = filteredItems;

  if (response.loadedInfo) {
    response.loadedInfo.searchBarContent = [];

    if (response.loadedInfo.headerBack) {
      response.loadedInfo.headerBack.channelStyleMap = {};
    }
  }

  log('remove_search success');
  return response;
}

function removeMsgAd(response) {
  if (!response.messages) {
    return response;
  }

  const filteredMessages = [];
  for (const message of response.messages) {
    if (!message.msg_card?.ad_tag) {
      filteredMessages.push(message);
    }
  }

  response.messages = filteredMessages;
  return response;
}

function removePage(response) {
  removeCards(response);

  if (mainConfig.removePinedTrending && response.cards && response.cards.length > 0 && response.cards[0].card_group) {
    response.cards[0].card_group = response.cards[0].card_group.filter(
      (card) =>
        !(
          card?.actionlog?.ext?.includes('ads_word') ||
          card?.itemid?.includes('t:51') ||
          card?.itemid?.includes('ads_word')
        ),
    );
  }

  return response;
}

function removeCards(response) {
  if (response.hotwords) {
    response.hotwords = [];
  }

  if (!response.cards) {
    if (response.items) {
      log('data.items');
      removeSearch(response);
    }
    return response;
  }

  const filteredCards = [];
  for (let card of response.cards) {
    if (
      response.cardlistInfo?.containerid === '232082type=1' &&
      (card.card_type === 17 || card.card_type === 58 || card.card_type === 11)
    ) {
      const newCardType = card.card_type + 1;
      card = { card_type: newCardType };
    }

    const cardGroup = card.card_group;
    if (cardGroup && cardGroup.length > 0) {
      const filteredGroup = [];
      for (const groupItem of cardGroup) {
        const cardType = groupItem.card_type;
        if (cardType !== 118 && !isAd(groupItem.mblog) && JSON.stringify(groupItem).indexOf('res_from:ads') === -1) {
          filteredGroup.push(groupItem);
        }
      }

      card.card_group = filteredGroup;
      filteredCards.push(card);
    } else {
      const cardType = card.card_type;
      if ([9, 165].indexOf(cardType) > -1) {
        if (!isAd(card.mblog)) {
          filteredCards.push(card);
        }
      } else if ([1007, 180].indexOf(cardType) > -1) {
        continue;
      } else {
        filteredCards.push(card);
      }
    }
  }

  response.cards = filteredCards;

  if (response.items) {
    log('data.items');
    removeSearch(response);
  }

  return response;
}

function lvZhouHandler(content) {
  if (!mainConfig.removeLvZhou || !content) {
    return content;
  }

  const commonStruct = content.common_struct;
  if (!commonStruct) {
    return content;
  }

  const filteredStruct = [];
  for (const structItem of commonStruct) {
    if (structItem.name !== '绿洲') {
      filteredStruct.push(structItem);
    }
  }

  content.common_struct = filteredStruct;
  return content;
}

function isBlock(content) {
  const blockIds = mainConfig.blockIds || [];
  if (blockIds.length === 0) {
    return false;
  }

  const userId = content.user.id;
  for (const blockId of blockIds) {
    if (blockId == userId) {
      return true;
    }
  }

  return false;
}

function removeTimeLine(response) {
  for (const field of ['ad', 'advertises', 'trends', 'headers']) {
    if (response[field]) {
      delete response[field];
    }
  }

  if (!response.statuses) {
    return response;
  }

  const filteredStatuses = [];
  for (const status of response.statuses) {
    if (isAd(status)) {
      continue;
    }

    lvZhouHandler(status);

    if (status.common_struct) {
      delete status.common_struct;
    }

    if (status.category) {
      if (status.category !== 'group') {
        filteredStatuses.push(status);
      }
    } else {
      filteredStatuses.push(status);
    }
  }

  response.statuses = filteredStatuses;
  return response;
}

function removeHomeVip(response) {
  if (response.header && response.header.vipView) {
    response.header.vipView = null;
  }
  return response;
}

function removeVideoRemind(response) {
  (response.bubble_dismiss_time = 0),
    (response.exist_remind = false),
    (response.image_dismiss_time = 0),
    (response.image = ''),
    (response.tag_image_english = ''),
    (response.tag_image_english_dark = ''),
    (response.tag_image_normal = ''),
    (response.tag_image_normal_dark = '');
}

function itemExtendHandler(response) {
  if (response.trend?.titles?.title) {
    delete response.trend;
  }

  if (mainConfig.removeFollow && response.follow_data) {
    response.follow_data = null;
  }

  if (mainConfig.removeRewardItem && response.reward_info) {
    response.reward_info = null;
  }

  if (response.head_cards) {
    delete response.head_cards;
  }

  if (response.page_alerts) {
    response.page_alerts = null;
  }

  try {
    const btnPicUrl = response.trend.extra_struct.extBtnInfo.btn_picurl;
    if (btnPicUrl.indexOf('timeline_icon_ad_delete') > -1) {
      delete response.trend;
    }
  } catch (err) {}

  if (mainConfig.modifyMenus && response.custom_action_list) {
    const filteredMenus = [];
    for (const menu of response.custom_action_list) {
      const menuType = menu.type;
      const menuConfig = itemMenusConfig[menuType];

      if (menuConfig === void 0) {
        filteredMenus.push(menu);
      } else if (menuType === 'mblog_menus_copy_url') {
        filteredMenus.unshift(menu);
      } else if (menuConfig) {
        filteredMenus.push(menu);
      }
    }

    response.custom_action_list = filteredMenus;
  }

  return response;
}

function updateFollowOrder(content) {
  try {
    for (const item of content.items) {
      if (item.itemId === 'mainnums_friends') {
        const scheme = item.click.modules[0].scheme;
        item.click.modules[0].scheme = scheme.replace('231093_-_selfrecomm', '231093_-_selffollowed');
        log('updateFollowOrder success');
        return;
      }
    }
  } catch (err) {
    console.log('updateFollowOrder fail');
  }
}

function updateProfileSkin(content, configKey) {
  try {
    const skinConfig = mainConfig[configKey];
    if (!skinConfig) {
      return;
    }

    let iconIndex = 0;
    for (const item of content.items) {
      if (item.image) {
        try {
          const darkMode = item.image.style.darkMode;
          if (darkMode !== 'alpha') {
            item.image.style.darkMode = 'alpha';
          }

          item.image.iconUrl = skinConfig[iconIndex++];

          if (item.dot) {
            item.dot = [];
          }
        } catch (err) {}
      }
    }

    log('updateProfileSkin success');
  } catch (err) {
    console.log('updateProfileSkin fail');
  }
}

function removeHome(response) {
  if (!response.items) {
    return response;
  }

  const filteredItems = [];
  for (let item of response.items) {
    const itemId = item.itemId;

    if (itemId === 'profileme_mine') {
      if (mainConfig.removeHomeVip) {
        item = removeHomeVip(item);
      }

      if (item.header?.vipIcon) {
        delete item.header.vipIcon;
      }

      updateFollowOrder(item);
      filteredItems.push(item);
    } else if (itemId === '100505_-_top8') {
      updateProfileSkin(item, 'profileSkin1');
      filteredItems.push(item);
    } else if (itemId === '100505_-_newcreator') {
      if (item.type === 'grid') {
        updateProfileSkin(item, 'profileSkin2');
        filteredItems.push(item);
      } else if (!mainConfig.removeHomeCreatorTask) {
        filteredItems.push(item);
      }
    } else if (itemId === '100505_-_chaohua' || itemId === '100505_-_manage' || itemId === '100505_-_recentlyuser') {
      if (item.images?.length > 0) {
        item.images = item.images.filter(
          (img) => img.itemId === '100505_-_chaohua' || img.itemId === '100505_-_recentlyuser',
        );
      }
      filteredItems.push(item);
    }
  }

  response.items = filteredItems;
  return response;
}

function removeCheckin(response) {
  log('remove tab1签到');
  response.show = 0;
  return response;
}

function removeMediaHomelist(response) {
  if (mainConfig.removeLiveMedia) {
    log('remove 首页直播');
    response.data = {};
  }
  return response;
}

function removeComments(response) {
  const commentData = response.datas || [];
  if (!commentData.length) {
    return response;
  }

  const filteredComments = [];
  for (const commentItem of commentData) {
    if (commentItem.item_category !== 'trend' && !commentItem.data?.user?.is_vai && !commentItem.data.reply_ai_type) {
      const filteredComment = removeAi(commentItem);
      filteredComments.push(filteredComment);
    }
  }

  log('remove 评论区相关和推荐内容1');
  response.datas = filteredComments;
  return response;
}

function removeAi(data) {
  if (data.data.comments?.length) {
    const filteredComments = [];
    for (const comment of data.data.comments) {
      if (!comment.user.is_vai && !comment.reply_ai_type) {
        filteredComments.push(comment);
      }
    }

    data.data.comments = filteredComments;
  }

  return data;
}

function containerHandler(response) {
  if (mainConfig.removeInterestFriendInTopic && response.card_type_name === '超话里的好友') {
    log('remove 超话里的好友');
    response.card_group = [];
  }

  if (mainConfig.removeInterestTopic && response.itemid) {
    if (response.itemid.indexOf('infeed_may_interest_in') > -1) {
      log('remove 感兴趣的超话');
      response.card_group = [];
    } else if (response.itemid.indexOf('infeed_friends_recommend') > -1) {
      log('remove 超话好友关注');
      response.card_group = [];
    }
  }

  return response;
}

function userHandler(response) {
  response = removeMainTab(response);

  if (!mainConfig.removeInterestUser) {
    return response;
  }

  if (!response.items) {
    return response;
  }

  const filteredItems = [];
  for (const item of response.items) {
    let shouldKeep = true;

    if (item.category === 'group') {
      try {
        if (item.items[0].data.desc === '可能感兴趣的人') {
          shouldKeep = false;
        }
      } catch (err) {}
    }

    if (shouldKeep) {
      if (item.data?.common_struct) {
        delete item.data.common_struct;
      }
      filteredItems.push(item);
    }
  }

  response.items = filteredItems;
  log('removeMain sub success');
  return response;
}

function nextVideoHandler(response) {
  if (response.statuses) {
    response.statuses = [];
  }
  return response;
}

function tabSkinHandler(response) {
  try {
    const tabVersion = mainConfig.tabIconVersion;
    response.data.canUse = 1;

    if (!tabVersion || !mainConfig.tabIconPath || tabVersion < 100) {
      return response;
    }

    const tabList = response.data.list;
    for (const tabItem of tabList) {
      tabItem.version = tabVersion;
      tabItem.downloadlink = mainConfig.tabIconPath;
    }

    log('tabSkinHandler success');
  } catch (err) {
    log('tabSkinHandler fail');
  }

  return response;
}

function skinPreviewHandler(response) {
  response.data.skin_info.status = 1;
  return response;
}

function removeLuaScreenAds(response) {
  if (!response.cached_ad) {
    return response;
  }

  for (const adItem of response.cached_ad.ads) {
    adItem.start_date = 1893254400;
    adItem.show_count = 0;
    adItem.duration = 0;
    adItem.end_date = 1893340799;
  }

  return response;
}

function removePhpScreenAds(response) {
  if (!response.ads) {
    return response;
  }

  response.show_push_splash_ad = false;
  response.background_delay_display_time = 0;
  response.lastAdShow_delay_display_time = 0;
  response.realtime_ad_video_stall_time = 0;
  response.realtime_ad_timeout_duration = 0;

  for (const adItem of response.ads) {
    adItem.displaytime = 0;
    adItem.displayintervel = 86400;
    adItem.allowdaydisplaynum = 0;
    adItem.displaynum = 0;
    adItem.displaytime = 1;
    adItem.begintime = '2029-12-30 00:00:00';
    adItem.endtime = '2029-12-30 23:59:59';
  }

  return response;
}

function log(message, json) {
  if (mainConfig.isDebug) {
    console.log(message, json || '');
  }
}

// ==========================
// ✅ 支持 Quantumult X 执行
// ==========================
if (typeof $done !== 'undefined') {
  var { body } = $response;
  var { url } = $request;
  const modified = modifyWeiboBody(url, body);
  $done({ body: modified });
}

const method = getModifyMethod(url);
if (method) {
  log(method);
  const func = eval(method);
  const data = JSON.parse(body.match(/\{.*\}/)[0]);
  new func(data), (body = JSON.stringify(data)), method == 'removePhpScreenAds' && (body = JSON.stringify(data) + 'OK');
}

function modifyWeiboBody(url, bodyStr) {
  try {
    const method = getModifyMethod(url);
    if (!method) {
      return bodyStr;
    }

    const func = eval(method);
    const jsonMatch = bodyStr.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return bodyStr;
    }

    const data = JSON.parse(jsonMatch[0]);
    func(data);

    let result = JSON.stringify(data);
    if (method === 'removePhpScreenAds') {
      result += 'OK';
    }

    return result;
  } catch (error) {
    console.log('⚠️ modifyWeiboBody error:', error);
    return bodyStr;
  }
}

// ==========================
// ✅ 支持 Node.js 模式导出
// ==========================

// export { modifyWeiboBody };
