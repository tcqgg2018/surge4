/*
 * 流媒体及 AI 服务检测脚本
 * 原作者：@LucaLin233, @Rabbit-Spec, @bigmom2012
 * 重写：Grok 3 (xAI)
 * 更新日期：2025-03-14
 * 功能：检测 ChatGPT、Grok 3、Claude 及流媒体服务的可用性
 */

const REQUEST_HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.61 Safari/537.36',
  'Accept-Language': 'en',
};

// 状态常量
const STATUS_COMING = 2;
const STATUS_AVAILABLE = 1;
const STATUS_NOT_AVAILABLE = 0;
const STATUS_TIMEOUT = -1;

// 支持地区列表
const chatGPTSupportedRegions = ["US", "CA", "GB", "AU", "DE", "FR", "JP", "KR", "TW", "SG"];
const grok3SupportedRegions = ["US", "CA", "GB", "DE", "FR", "IT", "ES"];
const claudeSupportedRegions = ["US"];

// 处理 argument 参数
let titlediy, icon, iconerr, iconColor, iconerrColor;
if (typeof $argument !== 'undefined') {
  const args = $argument.split('&');
  for (let i = 0; i < args.length; i++) {
    const [key, value] = args[i].split('=');
    if (key === 'title') titlediy = value;
    else if (key === 'icon') icon = value;
    else if (key === 'iconerr') iconerr = value;
    else if (key === 'icon-color') iconColor = value;
    else if (key === 'iconerr-color') iconerrColor = value;
  }
}

// 获取国旗 Emoji 函数（添加空值检查）
function getCountryFlagEmoji(countryCode) {
  if (!countryCode || typeof countryCode !== 'string') return '🌐 | UNKNOWN';
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map(char => 127397 + char.charCodeAt());
  return String.fromCodePoint(...codePoints) + ' | ' + countryCode.toUpperCase();
}

// 格式化日期时间
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
    title: titlediy || '📺 服务检测 ⏰ ' + new Date().Format("HH:mm:ss"),
    content: '',
    icon: icon || '4k.tv.fill',
    'icon-color': iconColor || '#f20c00',
  };

  // 并行检测所有服务，添加默认值处理超时或错误
  const [chatgpt_result, grok3_result, claude_result, disney_result, youtube_result, netflix_result] = await Promise.all([
    checkChatGPT().catch(() => "ChatGPT: 检测超时 🚦"),
    checkGrok3().catch(() => "Grok 3: 检测超时 🚦"),
    checkClaude().catch(() => "Claude: 检测超时 🚦"),
    testDisneyPlus().catch(() => ({ status: STATUS_TIMEOUT, region: 'UNKNOWN' })),
    checkYouTubePremium().catch(() => "𝐘𝐨𝐮𝐓𝐮𝐛𝐞: 检测超时 🚦"),
    checkNetflix().catch(() => "𝐍𝐄𝐓𝐅𝐋𝐈𝐗: 检测超时 🚦")
  ]);

  // 处理 Disney+ 结果
  let disney_str = "";
  switch (disney_result.status) {
    case STATUS_COMING:
      disney_str = "𝓓𝓲𝓼𝓷𝓮𝔂+: 即将登陆 ➠ " + getCountryFlagEmoji(disney_result.region);
      break;
    case STATUS_AVAILABLE:
      disney_str = "𝓓𝓲𝓼𝓷𝓮𝔂+: 已解锁 ➠ " + getCountryFlagEmoji(disney_result.region);
      break;
    case STATUS_NOT_AVAILABLE:
      disney_str = "𝓓𝓲𝓼𝓷𝓮𝔂+: 未支持 🚫";
      break;
    case STATUS_TIMEOUT:
    default:
      disney_str = "𝓓𝓲𝓼𝓷𝓮𝔂+: 检测超时 🚦";
  }

  // 合并所有结果
  panel_result['content'] = [
    chatgpt_result,
    grok3_result,
    claude_result,
    youtube_result,
    netflix_result,
    disney_str
  ].join('\n');

  $done(panel_result);
})();

// ChatGPT 检测
async function checkChatGPT() {
  return new Promise((resolve) => {
    $httpClient.get({ url: 'https://chat.openai.com/cdn-cgi/trace', headers: REQUEST_HEADERS }, (error, response, data) => {
      if (error || response.status !== 200) {
        resolve("ChatGPT: 检测失败 🚫");
        return;
      }
      let cf = parseTraceData(data);
      let loc = getCountryFlagEmoji(cf.loc);
      let isSupported = chatGPTSupportedRegions.includes(cf.loc);
      resolve(`ChatGPT: ${isSupported ? '已解锁' : '未解锁'} ➠ ${loc}`);
    });
  });
}

// Grok 3 检测（模拟）
async function checkGrok3() {
  return new Promise((resolve) => {
    $httpClient.get({ url: 'https://chat.openai.com/cdn-cgi/trace', headers: REQUEST_HEADERS }, (error, response, data) => { // 暂用 ChatGPT URL
      if (error || response.status !== 200) {
        resolve("Grok 3: 检测失败 🚫");
        return;
      }
      let cf = parseTraceData(data);
      let loc = getCountryFlagEmoji(cf.loc);
      let isSupported = grok3SupportedRegions.includes(cf.loc);
      resolve(`Grok 3: ${isSupported ? '已解锁' : '未解锁'} ➠ ${loc}`);
    });
  });
}

// Claude 检测
async function checkClaude() {
  return new Promise((resolve) => {
    $httpClient.get({ url: 'https://claude.ai', headers: REQUEST_HEADERS }, (error, response, data) => {
      if (error || response.status !== 200) {
        resolve("Claude: 检测失败 🚫");
        return;
      }
      let region = response.headers['cf-ipcountry'] || 'UNKNOWN';
      let loc = getCountryFlagEmoji(region);
      let isSupported = claudeSupportedRegions.includes(region);
      resolve(`Claude: ${isSupported ? '已解锁' : '未解锁'} ➠ ${loc}`);
    });
  });
}

// YouTube Premium 检测
async function checkYouTubePremium() {
  return new Promise((resolve) => {
    $httpClient.get({ url: 'https://www.youtube.com/premium', headers: REQUEST_HEADERS }, (error, response, data) => {
      if (error || response.status !== 200) {
        resolve("𝐘𝐨𝐮𝐓𝐮𝐛𝐞: 检测失败 🚫");
        return;
      }
      if (data.includes('Premium is not available in your country')) {
        resolve("𝐘𝐨𝐮𝐓𝐮𝐛𝐞: 不支持解锁");
      } else {
        let region = data.match(/"countryCode":"(.*?)"/)?.[1] || 'UNKNOWN';
        resolve(`𝐘𝐨𝐮𝐓𝐮𝐛𝐞: 已解锁 ➠ ${getCountryFlagEmoji(region)}`);
      }
    });
  });
}

// Netflix 检测
async function checkNetflix() {
  const checkFilm = (filmId) => {
    return new Promise((resolve, reject) => {
      $httpClient.get({ url: `https://www.netflix.com/title/${filmId}`, headers: REQUEST_HEADERS }, (error, response) => {
        if (error || response.status === 403) reject('Not Available');
        else if (response.status === 404) resolve('Not Found');
        else if (response.status === 200) resolve(response.headers['x-originating-url']?.split('/')[3]?.split('-')[0] || 'UNKNOWN');
        else reject('Error');
      });
    });
  };

  let result = '𝐍𝐄𝐓𝐅𝐋𝐈𝐗: ';
  try {
    let region = await checkFilm(81215567);
    if (region === 'Not Found') {
      region = await checkFilm(80018499);
      if (region === 'Not Found') throw 'Not Available';
      result += `自制剧 ➠ ${getCountryFlagEmoji(region)}`;
    } else {
      result += `完整版 ➠ ${getCountryFlagEmoji(region)}`;
    }
  } catch (error) {
    result += error === 'Not Available' ? '不支持解锁' : '检测失败 🚫';
  }
  return result;
}

// Disney+ 检测
async function testDisneyPlus() {
  try {
    let homeResult = await Promise.race([testDisneyHome(), timeout(5000)]);
    let locationResult = await Promise.race([getDisneyLocation(), timeout(5000)]);
    let region = locationResult?.countryCode || homeResult?.region || 'UNKNOWN';
    let status = (locationResult?.inSupportedLocation === false || locationResult?.inSupportedLocation === 'false') ? STATUS_COMING : STATUS_AVAILABLE;
    return { region, status };
  } catch (error) {
    return { region: 'UNKNOWN', status: error === 'Timeout' ? STATUS_TIMEOUT : STATUS_NOT_AVAILABLE };
  }
}

function testDisneyHome() {
  return new Promise((resolve, reject) => {
    $httpClient.get({ url: 'https://www.disneyplus.com/', headers: REQUEST_HEADERS }, (error, response, data) => {
      if (error || response.status !== 200 || data.includes('Sorry, Disney+ is not available in your region.')) {
        reject('Not Available');
      } else {
        let region = data.match(/Region: ([A-Za-z]{2})/)?.[1] || 'UNKNOWN';
        resolve({ region });
      }
    });
  });
}

function getDisneyLocation() {
  return new Promise((resolve, reject) => {
    let opts = {
      url: 'https://disney.api.edge.bamgrid.com/graph/v1/device/graphql',
      headers: {
        'Accept-Language': 'en',
        Authorization: 'ZGlzbmV5JmJyb3dzZXImMS4wLjA.Cu56AgSfBTDag5NiRA81oLHkDZfu5L3CKadnefEAY84',
        'Content-Type': 'application/json',
        'User-Agent': REQUEST_HEADERS['User-Agent'],
      },
      body: JSON.stringify({
        query: 'mutation registerDevice($input: RegisterDeviceInput!) { registerDevice(registerDevice: $input) { grant { grantType assertion } } }',
        variables: {
          input: {
            applicationRuntime: 'chrome',
            attributes: { browserName: 'chrome', browserVersion: '94.0.4606', manufacturer: 'apple', operatingSystem: 'macintosh', operatingSystemVersion: '10.15.7', osDeviceIds: [] },
            deviceFamily: 'browser',
            deviceLanguage: 'en',
            deviceProfile: 'macosx',
          },
        },
      }),
    };
    $httpClient.post(opts, (error, response, data) => {
      if (error || response.status !== 200) reject('Not Available');
      else {
        let parsed = JSON.parse(data);
        if (parsed?.errors) reject('Not Available');
        let { session: { inSupportedLocation, location: { countryCode } } } = parsed.extensions.sdk;
        resolve({ inSupportedLocation, countryCode });
      }
    });
  });
}

// 辅助函数：解析 trace 数据
function parseTraceData(data) {
  return data.split("\n").reduce((acc, line) => {
    let [key, value] = line.split("=");
    if (key) acc[key] = value;
    return acc;
  }, {});
}

// 超时函数
function timeout(delay = 5000) {
  return new Promise((resolve, reject) => setTimeout(() => reject('Timeout'), delay));
}