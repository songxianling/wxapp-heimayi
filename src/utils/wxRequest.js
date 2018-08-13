import wepy from 'wepy';

const host = 'https://apiwx.ixiangha.com'; // 全局路由
// const host = wx.getStorageSync("xhHost"); // 全局路由

const wxRequest = function (url, params = {}, method = 'post') {
  let userInfo = wepy.getStorageSync("userInfo");
  return new Promise((resolve, reject) => {
    let requestUrl = host + url;
    params.userCode = userInfo.userCode || '';
    wepy.request({
      url: requestUrl,
      data: params,
      method: method,
      header: {
        'Content-Type': 'application/json'
      },
    }).then(res => {
      if (res && res.statusCode == 200 && res.data) {
        resolve(res.data)
      } else {
        reject(res)
      }
    })

  })
}


module.exports = {
  wxRequest,
  host
}
