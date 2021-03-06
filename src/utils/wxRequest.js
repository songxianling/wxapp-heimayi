import wepy from 'wepy';

const host = 'https://api.phpcloud.top'; // 全局路由
// const host = wx.getStorageSync("xhHost"); // 全局路由

const wxRequest = function (url, params = {}, method = 'post') {
  let token = wepy.getStorageSync("userInfo").token;
  console.log(token);

  return new Promise((resolve, reject) => {
    let requestUrl = host + url;
    params.token = token || '';
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
