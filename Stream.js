// 状态常量
const STATUS_COMING = 2;
const STATUS_AVAILABLE = 1;
const STATUS_NOT_AVAILABLE = 0;
const STATUS_TIMEOUT = -1;
const STATUS_ERROR = -2;

const REQUEST_HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.61 Safari/537.36',
  'Accept-Language': 'en',
};

// 获取国旗 Emoji
function getCountryFlagEmoji(countryCode) {
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map(char => 127397 + char.charCodeAt());
  return String.fromCodePoint(...codePoints);
}

// 获取当前时间格式化
Date.prototype.Format = function(fmt) {
  var o = {
    "H+": this.getHours(),
    "m+": this.getMinutes(),
    "s+": this.getSeconds(),
  };
  if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
  for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
  return fmt;
};

// 主函数
(async () => {
  let panel_result = {
    title: '📺 AI & 流媒体检测 ⏰ ' + new Date().Format("HH:mm:ss"),
    content: '',
    icon: '4k.tv.fill',
    'icon-color': '#f20c00',
  };

  let [chatgpt_result, claude_result, grok_result] = await Promise.all([
    checkChatGPT(),
    checkClaude(),
    checkGrok()
  ]);

  let streaming_results = await Promise.all([
    check_youtube_premium(),
    check_netflix()
  ]);

  panel_result['content'] = [
    chatgpt_result,
    claude_result,
    grok_result,
    ...streaming_results
  ].join('\n');

  $done(panel_result);
})();

// **ChatGPT 检测**
async function checkChatGPT() {
  return new Promise((resolve) => {
    $httpClient.get("http://chat.openai.com/cdn-cgi/trace", function(error, response, data) {
      if (error) {
        resolve("🤖 ChatGPT: ❌ 检测失败");
        return;
      }
      let lines = data.split("\n");
      let cf = lines.reduce((acc, line) => {
        let [key, value] = line.split("=");
        acc[key] = value;
        return acc;
      }, {});
      let loc = cf.loc ? getCountryFlagEmoji(cf.loc) + ' | ' + cf.loc.toUpperCase() : "未知区域";

      let gpt = tf.includes(cf.loc) ? "✅ 已解锁" : "❌ 未解锁";
      resolve(`🤖 ChatGPT: ${gpt} ➠ ${loc}`);
    });
  });
}

// **Claude AI 检测**
async function checkClaude() {
  return new Promise((resolve) => {
    let option = {
      url: 'https://claude.ai',
      headers: REQUEST_HEADERS,
    };
    $httpClient.get(option, function(error, response) {
      if (error || response.status !== 200) {
        resolve("🤖 Claude: ❌ 无法访问");
        return;
      }
      resolve("🤖 Claude: ✅ 可访问");
    });
  });
}

// **Grok AI（Gork3）检测**
async function checkGrok() {
  return new Promise((resolve) => {
    let option = {
      url: 'https://x.com/grok',
      headers: REQUEST_HEADERS,
    };
    $httpClient.get(option, function(error, response) {
      if (error || response.status !== 200) {
        resolve("🤖 Grok: ❌ 无法访问");
        return;
      }
      resolve("🤖 Grok: ✅ 可访问");
    });
  });
}

// **YouTube Premium 检测**
async function check_youtube_premium() {
  return new Promise((resolve) => {
    let option = {
      url: 'https://www.youtube.com/premium',
      headers: REQUEST_HEADERS,
    };
    $httpClient.get(option, function(error, response, data) {
      if (error || response.status !== 200) {
        resolve("📺 YouTube: ❌ 检测失败");
        return;
      }
      let regionMatch = data.match(/"countryCode":"(.*?)"/);
      let region = regionMatch ? regionMatch[1] : "未知区域";
      let flag = getCountryFlagEmoji(region);
      resolve(`📺 YouTube: ✅ 已解锁 ➠ ${flag} | ${region}`);
    });
  });
}

// **Netflix 检测**
async function check_netflix() {
  return new Promise((resolve) => {
    let option = {
      url: 'https://www.netflix.com/title/81215567',
      headers: REQUEST_HEADERS,
    };
    $httpClient.get(option, function(error, response) {
      if (error || response.status === 403) {
        resolve("📺 Netflix: ❌ 无法解锁");
        return;
      }
      let regionMatch = response.headers['x-originating-url']?.match(/netflix\.com\/([a-z]{2})/);
      let region = regionMatch ? regionMatch[1].toUpperCase() : "未知区域";
      let flag = getCountryFlagEmoji(region);
      resolve(`📺 Netflix: ✅ 已解锁 ➠ ${flag} | ${region}`);
    });
  });
}