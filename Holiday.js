var tlist = {
1: ["元旦", "2025-01-01"],
2: ["除夕", "2025-01-28"],
3: ["春节", "2025-01-29"],
4: ["元宵", "2025-02-12"],
5: ["情人节", "2025-02-14"],
6: ["清明", "2025-04-04"],
7: ["劳动", "2025-05-01"],
8: ["母亲节", "2025-05-11"],
9: ["端午", "2025-06-01"],
10: ["父亲节", "2025-06-15"],
11: ["夏至", "2025-06-21"],
12: ["七夕节", "2025-07-31"],
13: ["中元节", "2025-09-06"],
14: ["中秋", "2025-10-06"],
15: ["国庆", "2025-10-01"],
16: ["重阳节", "2025-11-01"],
17: ["万圣节", "2025-10-31"],
18: ["光棍节", "2025-11-11"],
19: ["感恩节", "2025-11-27"],
20: ["冬至", "2025-12-22"],
21: ["平安夜", "2025-12-24"],
22: ["圣诞节", "2025-12-25"],
23: ["元旦", "2026-01-01"],
24: ["除夕", "2026-02-17"],
25: ["春节", "2026-02-18"],
26: ["元宵", "2026-03-05"],
27: ["情人节", "2026-02-14"],
28: ["清明", "2026-04-04"],
29: ["劳动", "2026-05-01"],
30: ["母亲节", "2026-05-10"],
31: ["端午", "2026-05-20"],
32: ["父亲节", "2026-06-21"],
33: ["夏至", "2026-06-21"],
34: ["七夕节", "2026-08-20"],
35: ["中元节", "2026-08-27"],
36: ["中秋", "2026-09-25"],
37: ["国庆", "2026-10-01"],
38: ["重阳节", "2026-10-19"],
39: ["万圣节", "2026-10-31"],
40: ["光棍节", "2026-11-11"],
41: ["感恩节", "2026-11-26"],
42: ["冬至", "2026-12-21"],
43: ["平安夜", "2026-12-24"],
44: ["圣诞节", "2026-12-25"],
45: ["元旦", "2027-01-01"],
46: ["除夕", "2027-02-06"],
47: ["春节", "2027-02-07"],
48: ["元宵", "2027-02-22"],
49: ["情人节", "2027-02-14"],
50: ["清明", "2027-04-05"],
51: ["劳动", "2027-05-01"],
52: ["母亲节", "2027-05-09"],
53: ["端午", "2027-06-10"],
54: ["父亲节", "2027-06-20"],
55: ["夏至", "2027-06-21"],
56: ["七夕节", "2027-08-10"],
57: ["中元节", "2027-08-17"],
58: ["中秋", "2027-09-15"],
59: ["国庆", "2027-10-01"],
60: ["重阳节", "2027-10-09"],
61: ["万圣节", "2027-10-31"],
62: ["光棍节", "2027-11-11"],
63: ["感恩节", "2027-11-25"],
64: ["冬至", "2027-12-22"],
65: ["平安夜", "2027-12-24"],
66: ["圣诞节", "2027-12-25"],
67: ["元旦", "2028-01-01"],
68: ["除夕", "2028-01-26"],
69: ["春节", "2028-01-27"],
70: ["元宵", "2028-02-11"],
71: ["情人节", "2028-02-14"],
72: ["清明", "2028-04-04"],
73: ["劳动", "2028-05-01"],
74: ["母亲节", "2028-05-14"],
75: ["端午", "2028-05-31"],
76: ["父亲节", "2028-06-18"],
77: ["夏至", "2028-06-21"],
78: ["七夕节", "2028-07-30"],
79: ["中元节", "2028-08-26"],
80: ["中秋", "2028-10-04"],
81: ["国庆", "2028-10-01"],
82: ["重阳节", "2028-10-28"],
83: ["万圣节", "2028-10-31"],
84: ["光棍节", "2028-11-11"],
85: ["感恩节", "2028-11-23"],
86: ["冬至", "2028-12-21"],
87: ["平安夜", "2028-12-24"],
88: ["圣诞节", "2028-12-25"],
89: ["元旦", "2029-01-01"],
90: ["除夕", "2029-02-12"],
91: ["春节", "2029-02-13"],
92: ["元宵", "2029-02-26"],
93: ["情人节", "2029-02-14"],
94: ["清明", "2029-04-04"],
95: ["劳动", "2029-05-01"],
96: ["母亲节", "2029-05-13"],
97: ["端午", "2029-05-20"],
98: ["父亲节", "2029-06-17"],
99: ["夏至", "2029-06-21"],
100: ["七夕节", "2029-08-18"],
101: ["中元节", "2029-08-24"],
102: ["中秋", "2029-09-22"],
103: ["国庆", "2029-10-01"]
  
};
let tnow = new Date();
let tnowf =
  tnow.getFullYear() + "-" + (tnow.getMonth() + 1) + "-" + tnow.getDate();

/* 计算2个日期相差的天数，不包含今天，如：2016-12-13到2016-12-15，相差2天
 * @param startDateString
 * @param endDateString
 * @returns
 */
function dateDiff(startDateString, endDateString) {
  var separator = "-"; //日期分隔符
  var startDates = startDateString.split(separator);
  var endDates = endDateString.split(separator);
  var startDate = new Date(startDates[0], startDates[1] - 1, startDates[2]);
  var endDate = new Date(endDates[0], endDates[1] - 1, endDates[2]);
  return parseInt(
    (endDate - startDate) / 1000 / 60 / 60 / 24
  ).toString();
}

//计算输入序号对应的时间与现在的天数间隔
function tnumcount(num) {
  let dnum = num;
  return dateDiff(tnowf, tlist[dnum][1]);
}

//获取最接近的日期
function now() {
  for (var i = 1; i <= Object.getOwnPropertyNames(tlist).length; i++) {
    if (Number(dateDiff(tnowf, tlist[i.toString()][1])) >= 0) {
      //console.log("最近的日期是:" + tlist[i.toString()][0]);
      //console.log("列表长度:" + Object.getOwnPropertyNames(tlist).length);
      //console.log("时间差距:" + Number(dateDiff(tnowf, tlist[i.toString()][1])));
      return i;
    }
  }
}

//如果是0天，发送emoji;
let nowlist = now();
function today(day) {
  let daythis = day;
  if (daythis == "0") {
    datenotice();
    return "🎉";
  } else {
    return daythis;
  }
}

//提醒日当天发送通知
function datenotice() {
  if ($persistentStore.read("timecardpushed") != tlist[nowlist][1] && tnow.getHours() >= 6) {
    $persistentStore.write(tlist[nowlist][1], "timecardpushed");
    $notification.post("假日祝福","", "今天是" + tlist[nowlist][1] + "日 " + tlist[nowlist][0] + "   🎉")
  } else if ($persistentStore.read("timecardpushed") == tlist[nowlist][1]) {
    //console.log("当日已通知");
  }
}

//>图标依次切换乌龟、兔子、闹钟、礼品盒
function icon_now(num){
  if(num<=7 && num>3 ){
    return "hare.fill"
  }else if(num<=3 && num>0){
    return "alarm.fill"
  }else if(num==0){
    return "gift"
  }else{
    return "tortoise.fill"
  }
}

function icon_color(num){
  if(num<=7 && num>3){
    return '#FFFFFF'
  }else if(num<=3 && num>0){
    return '#3EEDE7'
  }else if(num==0){
    return '#FF0000'
  }else{
    return '#00BC12'
  }
}
$done({
title:title_random(tnumcount(Number(nowlist))),
icon:icon_now(tnumcount(Number(nowlist))),
"icon-color":icon_color(tnumcount(Number(nowlist))),
content:tlist[nowlist][0]+":"+today(tnumcount(nowlist))+"天,"+tlist[Number(nowlist) + Number(1)][0] +":"+ tnumcount(Number(nowlist) + Number(1))+ "天,"+tlist[Number(nowlist) + Number(2)][0]+":"+tnumcount(Number(nowlist) + Number(2))+"天"
})
function title_random(num){
  let r = Math.floor((Math.random()*12)+1);
  let dic = {
    1:"距离放假，还要摸鱼多少天？🥱",
    2:"坚持住，就快放假啦！💪",
    3:"上班好累呀，好想放假😮‍💨",
    4:"努力，我还能加班24小时！🧐",
    5:"天呐，还要多久才放假呀？😭",
    6:"躺平中，等放假(☝ ՞ਊ ՞)☝",
    7:"只有摸鱼才是赚老板的钱🙎🤳",
    8:"一起摸鱼吧✌(՞ټ՞ )✌",
    9:"摸鱼中，期待下一个假日.ʕʘ‿ʘʔ.",
    10: "小乌龟慢慢爬🐢",
    11:"太难了！😫😩😖(´◉‿◉)",
    12:"反正放假也不能去玩😤"
  };
  return num==0?"节日快乐🎉，万事大吉🥳":dic[r]
}
