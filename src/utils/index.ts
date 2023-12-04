// 用于时间业务
export const getTimeStr = () => {
  // 获取当前时间
  let nowTime: Date = new Date();
  // 获取当前小时
  let hours: number = nowTime.getHours();
  // 初始化时间字符串
  let timestr: string = "你好";
  // 判断当前时段并返回字符串
  if (hours >= 0 && hours < 6) {
    // 凌晨
    timestr = "凌晨好";
  } else if (hours >= 6 && hours < 11) {
    // 上午
    timestr = "上午好";
  } else if (hours >= 11 && hours < 13) {
    // 中午
    timestr = "中午好";
  } else if (hours >= 13 && hours < 16) {
    // 下午
    timestr = "下午好";
  } else if (hours >= 16 && hours < 18) {
    // 傍晚
    timestr = "傍晚好";
  } else if (hours >= 18 && hours < 24) {
    // 晚上
    timestr = "晚上好";
  }
  return timestr;
};
export const getTimeStr2 = (time: string) => {
  const date = new Date(Number(time) * 1000);
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0"); // 注意月份是从0开始计数，所以要加1
  const day = date.getDate().toString().padStart(2, "0");
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const seconds = date.getSeconds().toString().padStart(2, "0");
  // 使用模板字符串构建时间字符串
  const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

  return formattedDate;
};
export const getTimeStr3 = (time: string) => {
  let intValue = parseInt(time, 10);
  if (isNaN(intValue) || intValue <= 0 || intValue !== parseFloat(time)) {
    // 非正整数
    return "";
  } else {
    // 是正整数，进行换算
    const units = ["小时", "天", "月", "年"];
    const durations = [1, 24, 720, 8760];
    let result = "";

    for (let i = durations.length - 1; i >= 0; i--) {
      const unit = units[i];
      const duration = durations[i];
      const quotient = Math.floor(intValue / duration);

      if (quotient > 0) {
        result += `${quotient}${unit}`;

        intValue %= duration;
      }

      if (intValue === 0) {
        break; // 已经处理完毕
      }
    }
    return result;
  }
};

// 缓动函数
export const horizontalScroll = (scrollEl: Element, targetEl: Element) => {
  // 由于setInterval是异步的，所以需要promise达成同步效果
  return new Promise((resolve) => {
    // 横向滚动缓动
    // 设置循环定时器
    let scrollHorizontal = setInterval(() => {
      // 当滚动到达顶部时
      // @ts-ignore
      let scrollSize = targetEl.scrollWidth - scrollEl.offsetWidth;
      // 防止误差
      if (scrollEl.scrollLeft >= scrollSize - 2) {
        // 清除定时器
        clearInterval(scrollHorizontal);
        resolve("ok");
      }
      // 缓动算法
      // @ts-ignore
      let step = (scrollSize - scrollEl.scrollLeft) / 10;
      step = step > 0 ? Math.ceil(step) : Math.floor(step);
      // @ts-ignore
      scrollEl.scrollTo(scrollEl.scrollLeft + step, 0);
    }, 15);
  });
};
export const verticalScroll = (scrollEl: Element) => {
  // 由于setInterval是异步的，所以需要promise达成同步效果
  return new Promise((resolve) => {
    // 竖向滚动
    // 设置循环定时器
    let scrollVertical = setInterval(() => {
      // 当滚动到达右部时
      // @ts-ignore
      if (scrollEl.scrollTop == 0) {
        // 清除定时器
        clearInterval(scrollVertical);
        resolve("ok");
      }
      // 缓动算法
      // @ts-ignore
      let step = (0 - scrollEl.scrollTop) / 10;
      step = step > 0 ? Math.ceil(step) : Math.floor(step);
      // @ts-ignore
      scrollEl.scrollTo(0, scrollEl.scrollTop + step);
    }, 15);
  });
};
