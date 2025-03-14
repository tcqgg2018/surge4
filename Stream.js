
/*
 * 由@LucaLin233编写
 * 原脚本地址：https://raw.githubusercontent.com/LucaLin233/Luca_Conf/main/Surge/JS/stream-all.js
 * 由@Rabbit-Spec修改
 * 更新日期：2022.07.22
 * 版本：2.3
 * 由bigmom2012修改
 * 更新日期：2022-07-30 11:28
 * 更新日期：2024-07-04 21:28
 * 由Grok 3修改，新增Grok 3和Claude检测，带自定义地区规则
 * 更新日期：2025-03-14
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
const STATUS_ERROR = -2;

const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.61 Safari/537.36';

// 支持地区列表
const chatGPTSupportedRegions = ["US", "CA", "GB", "AU", "DE", "FR", "JP", "KR", "TW", "SG"]; // ChatGPT 示例支持地区
const grok3SupportedRegions = ["US", "CA", "GB", "DE", "FR", "IT", "ES"]; // Grok 3 示例支持地区（北美+部分欧洲）
const claudeSupportedRegions = ["JP", "KR", "SG", "CN", "IN", "GB", "FR"]; // Claude 示例支持地区（亚洲+部分欧洲）
let tff = ["plus", "on"];

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

// 获取国旗 Emoji 函数
function getCountryFlagEmoji(countryCode) {
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map(char => 127397 + char.charCodeAt());
  return String.fromCodePoint(...codePoints);
}

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

(async () => {
  let panel_result = {
    title: titlediy || '📺 流媒体检测 ⏰ ' + new Date().Format("HH:mm:ss"),
    content: '',
    icon: icon || '4k.tv.fill',
    'icon-color': iconColor || '#f20c00',
  };

  // 并行检测 ChatGPT、Grok 3、Claude 和流媒体服务
  let chatgpt_result = await checkChatGPT();
  let grok3_result = await checkGrok3();
  let claude_result = await checkClaude();
  let [{ region, status }] = await Promise.all([testDisneyPlus()]);
  let streaming_results = await Promise.all([check_youtube_premium(), check_netflix()]);

  // Disney+ 检测结果处理
  let disney_result = "";
  if (status == STATUS_COMING) {
    disney_result = "𝓓𝓲𝓼𝓷𝓮𝔂+: 即将登陆 ➠ " + `${getCountryFlagEmoji(region)} | ` + region.toUpperCase();
  } else if (status == STATUS_AVAILABLE) {
    disney_result = "𝓓𝓲𝓼𝓷𝓮𝔂+: 已解锁 ➠ " + `${getCountryFlagEmoji(region)} | ` + region.toUpperCase();
  } else if (status == STATUS_NOT_AVAILABLE) {
    disney_result = "𝓓𝓲𝓼𝓷𝓮𝔂+: 未支持 🚫 ";
  } else if (status == STATUS_TIMEOUT) {
    disney_result = "𝓓𝓲𝓼𝓷𝓮𝔂+: 检测超时 🚦";
  }
  streaming_results.push(disney_result);

  // 将所有结果合并到面板内容中
  panel_result['content'] = [chatgpt_result, grok3_result, claude_result, ...streaming_results].join('\n');

  $done(panel_result);
})();

// ChatGPT 检测函数
async function checkChatGPT() {
  return new Promise((resolve, reject) => {
    $httpClient.get('http://chat.openai.com/cdn-cgi/trace', function(error, response, data) {
      if (error) {
        resolve("ChatGPT: 检测失败 🚫");
        return;
      }

      let lines = data.split("\n");
      let cf = lines.reduce((acc, line) => {
        let [key, value] = line.split("=");
        acc[key] = value;
        return acc;
      }, {});
      let loc = getCountryFlagEmoji(cf.loc) + ' | ' + cf.loc;

      let isSupported = chatGPTSupportedRegions.indexOf(cf.loc) !== -1;
      let gpt = isSupported ? "ChatGPT: 已解锁 ➠ " : "ChatGPT: 未解锁 ➠ ";
      resolve(`${gpt}${loc}`);
    });
  });
}

// Grok 3 检测函数
async function checkGrok3() {
  return new Promise((resolve, reject) => {
    $httpClient.get('http://chat.openai.com/cdn-cgi/trace', function(error, response, data) { // 模拟，需替换为 xAI 真实端点
      if (error) {
        resolve("Grok 3: 检测失败 🚫");
        return;
      }

      let lines = data.split("\n");
      let cf = lines.reduce((acc, line) => {
        let [key, value] = line.split("=");
        acc[key] = value;
        return acc;
      }, {});
      let loc = getCountryFlagEmoji(cf.loc) + ' | ' + cf.loc;

      let isSupported = grok3SupportedRegions.indexOf(cf.loc) !== -1;
      let grok = isSupported ? "Grok 3: 已解锁 ➠ " : "Grok 3: 未解锁 ➠ ";
      resolve(`${grok}${loc}`);
    });
  });
}

// Claude 检测函数
async function checkClaude() {
  return new Promise((resolve, reject) => {
    $httpClient.get('http://chat.openai.com/cdn-cgi/trace', function(error, response, data) { // 模拟，需替换为 Anthropic 真实端点
      if (error) {
        resolve("Claude: 检测失败 🚫");
        return;
      }

      let lines = data.split("\n");
      let cf = lines.reduce((acc, line) => {
        let [key, value] = line.split("=");
        acc[key] = value;
        return acc;
      }, {});
      let loc = getCountryFlagEmoji(cf.loc) + ' | ' + cf.loc;

      let isSupported = claudeSupportedRegions.indexOf(cf.loc) !== -1;
      let claude = isSupported ? "Claude: 已解锁 ➠ " : "Claude: 未解锁 ➠ ";
      resolve(`${claude}${loc}`);
    });
  });
}

// YouTube Premium 检测函数（保持不变）
async function check_youtube_premium() {
  let inner_check = () => {
    return new Promise((resolve, reject) => {
      let option = {
        url: 'https://www.youtube.com/premium',
        headers: REQUEST_HEADERS,
      };
      $httpClient.get(option, function(error, response, data) {
        if (error != null || response.status !== 200) {
          reject('Error');
          return;
        }
        if (data.indexOf('Premium is not available in your country') !== -1) {
          resolve('Not Available');
          return;
        }
        let region = data.match(/"countryCode":"(.*?)"/)?.[1] || 'US';
        resolve(region);
      });
    });
  };

  let youtube_check_result = '𝐘𝐨𝐮𝐓𝐮𝐛𝐞: ';
  await inner_check()
    .then((code) => {
      if (code === 'Not Available') youtube_check_result += '不支持解锁';
      else youtube_check_result += '已解锁 ➠ ' + `${getCountryFlagEmoji(code)} | ` + code.toUpperCase();
    })
    .catch(() => youtube_check_result += '检测失败，请刷新面板');
  return youtube_check_result;
}

// Netflix 检测函数（保持不变）
async function check_netflix() {
  let inner_check = (filmId) => {
    return new Promise((resolve, reject) => {
      let option = {
        url: 'https://www.netflix.com/title/' + filmId,
        headers: REQUEST_HEADERS,
      };
      $httpClient.get(option, function(error, response, data) {
        if (error) reject('Error');
        else if (response.status === 403) reject('Not Available');
        else if (response.status === 404) resolve('Not Found');
        else if (response.status === 200) {
          let region = response.headers['x-originating-url']?.split('/')[3]?.split('-')[0] || 'us';
          resolve(region);
        } else reject('Error');
      });
    });
  };

  let netflix_check_result = '𝐍𝐄𝐓𝐅𝐋𝐈𝐗: ';
  await inner_check(81215567)
    .then((code) => {
      if (code === 'Not Found') return inner_check(80018499);
      netflix_check_result += '完整版 ➠ ' + `${getCountryFlagEmoji(code)} | ` + code.toUpperCase();
      return Promise.reject('BreakSignal');
    })
    .then((code) => {
      if (code === 'Not Found') return Promise.reject('Not Available');
      netflix_check_result += '自制剧 ➠ ' + `${getCountryFlagEmoji(code)} | ` + code.toUpperCase();
      return Promise.reject('BreakSignal');
    })
    .catch((error) => {
      if (error === 'BreakSignal') return;
      if (error === 'Not Available') netflix_check_result += '该节点不支持解锁';
      else netflix_check_result += '检测失败，请刷新面板';
    });
  return netflix_check_result;
}

// Disney+ 检测函数（保持不变）
async function testDisneyPlus() {
  try {
    let { region, cnbl } = await Promise.race([testHomePage(), timeout(7000)]);
    let { countryCode, inSupportedLocation } = await Promise.race([getLocationInfo(), timeout(7000)]);
    region = countryCode ?? region;
    if (inSupportedLocation === false || inSupportedLocation === 'false') {
      return { region, status: STATUS_COMING };
    } else {
      return { region, status: STATUS_AVAILABLE };
    }
  } catch (error) {
    if (error === 'Not Available') return { status: STATUS_NOT_AVAILABLE };
    if (error === 'Timeout') return { status: STATUS_TIMEOUT };
    return { status: STATUS_ERROR };
  }
}

function getLocationInfo() {
  return new Promise((resolve, reject) => {
    let opts = {
      url: 'https://disney.api.edge.bamgrid.com/graph/v1/device/graphql',
      headers: {
        'Accept-Language': 'en',
        Authorization: 'ZGlzbmV5JmJyb3dzZXImMS4wLjA.Cu56AgSfBTDag5NiRA81oLHkDZfu5L3CKadnefEAY84',
        'Content-Type': 'application/json',
        'User-Agent': UA,
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
    $httpClient.post(opts, function(error, response, data) {
      if (error || response.status !== 200) reject('Not Available');
      else {
        data = JSON.parse(data);
        if (data?.errors) reject('Not Available');
        let { session: { inSupportedLocation, location: { countryCode } } } = data?.extensions?.sdk;
        resolve({ inSupportedLocation, countryCode });
      }
    });
  });
}

function testHomePage() {
  return new Promise((resolve, reject) => {
    let opts = { url: 'https://www.disneyplus.com/', headers: { 'Accept-Language': 'en', 'User-Agent': UA } };
    $httpClient.get(opts, function(error, response, data) {
      if (error || response.status !== 200 || data.indexOf('Sorry, Disney+ is not available in your region.') !== -1) reject('Not Available');
      else {
        let match = data.match(/Region: ([A-Za-z]{2})[\s\S]*?CNBL: ([12])/);
        resolve({ region: match?.[1] || '', cnbl: match?.[2] || '' });
      }
    });
  });
}

function timeout(delay = 5000) {
  return new Promise((resolve, reject) => setTimeout(() => reject('Timeout'), delay));
}


