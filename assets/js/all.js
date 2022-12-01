"use strict";

// 載入資料庫、金鑰、環境變數
var apiPath = "ryanchiangfinaleaxam";
var token = "Jsbl8ongs9P32p2iKyLykEVQxcG2";
var orderData = []; // 用來儲存需要用到的資料

var orderList = document.querySelector(".orderList"); //選取表單內容
// 初始化

function init() {
  getOrderList();
}

init(); // 圓餅圖

function renderC3() {
  var obj = {}; // LV1

  orderData.forEach(function (item) {
    var productItem = item.products;
    productItem.forEach(function (productItems) {
      if (obj[productItems.title] == undefined) {
        obj[productItems.title] = productItems.price * productItems.quantity;
      } else {
        obj[productItems.title] += productItems.price * productItems.quantity;
      }
    });
  }); // LV2
  // 依營收重新排列品項

  var rank = Object.entries(obj);
  rank.sort(function (a, b) {
    return b[1] - a[1];
  });

  if (rank.length > 3) {
    var otherTotal = 0;
    rank.forEach(function (item, index) {
      if (index > 2) {
        otherTotal += rank[index][1];
      }
    });
    rank.splice(3, rank.length - 1);
    rank.push(["其他", otherTotal]);
  }

  console.log(rank); // 生成 c3 圖表

  var chart = c3.generate({
    bindto: '#chart',
    // HTML 元素綁定
    data: {
      type: "donut",
      columns: rank
    },
    color: {
      pattern: ["#301E5F", "#5434A7", "#9D7FEA", "#DACBFF"]
    }
  });
} // 取得表單資料


function getOrderList() {
  // 接使用者 API 路徑及金鑰
  axios.get("https://livejs-api.hexschool.io/api/livejs/v1/admin/".concat(apiPath, "/orders"), {
    headers: {
      "authorization": token
    }
  }).then(function (response) {
    orderData = response.data.orders; // 訂單管理

    var str = "";
    orderData.forEach(function (item) {
      // 訂單品項處理
      var productStr = "";
      var productItem = item.products;
      productItem.forEach(function (productItems) {
        productStr += "<p>".concat(productItems.title, " *").concat(productItems.quantity, "</p>");
      }); // 時間狀態處理

      var timeStamp = new Date(item.createdAt * 1000); // new Date 語法只支援 13碼，要把時間戳從 10 碼轉成 13 碼>>直接 *1000

      var createdTime = "".concat(timeStamp.getFullYear(), "/").concat(timeStamp.getMonth() + 1, "/").concat(timeStamp.getDate()); // 訂單狀態處理

      var orderStatus = "";

      if (item.paid == true) {
        orderStatus = "已處理";
      } else if (item.paid == false) {
        orderStatus = "未處理";
      } else {
        orderStatus = "狀態錯誤";
      } // 訂單資訊組合


      str += "<tr>\n                    <td>".concat(item.id, "</td>\n                    <td>\n                        <p>").concat(item.user.name, "</p>\n                        <p>").concat(item.user.tel, "</p>\n                    </td>\n                    <td>").concat(item.user.address, "</td>\n                    <td>").concat(item.user.email, "</td>\n                    <td>\n                        <p>").concat(productStr, "</p>\n                    </td>\n                    <td>").concat(createdTime, "</td>\n                    <td>\n                        <a href=\"#\" class=\"orderStatus\" data-status=\"").concat(item.paid, "\" data-id=\"").concat(item.id, "\">").concat(orderStatus, "</a>\n                    </td>\n                    <td>\n                        <input type=\"button\" class=\"delSingleOrder-Btn orderDelete\" value=\"\u522A\u9664\" data-id=\"").concat(item.id, "\">\n                    </td>\n                </tr>");
    });
    orderList.innerHTML = str;
    renderC3();
  });
} // 監聽表單 tbody 中的按鈕事件：1.訂單狀態 2.刪除


orderList.addEventListener("click", function (e) {
  e.preventDefault(); //防跳轉至頂
  // 設定觸發條件：以按鈕的 class 判斷點到哪個按鈕

  var targetBtn = e.target.getAttribute("class"); // 設定資料庫要回傳的資料條件

  var itemId = e.target.getAttribute("data-id");
  var itemStatus = e.target.getAttribute("data-status"); // 1. 點到訂單狀態按鈕：觸發修改訂單狀態

  if (targetBtn == "orderStatus") {
    changeOrderStatus(itemStatus, itemId);
  } // 2. 點到刪除按鈕：觸發刪除單筆資料
  else if (targetBtn == "delSingleOrder-Btn orderDelete") {
      deleteOrderItem(itemId);
    }
}); // 修改訂單狀態

function changeOrderStatus(itemStatus, itemId) {
  //狀態切換條件
  var newItemStatus;

  if (itemStatus != true) {
    newItemStatus = true;
  } else {
    newItemStatus = false;
  }

  ;
  axios.put("https://livejs-api.hexschool.io/api/livejs/v1/admin/".concat(apiPath, "/orders"), {
    "data": {
      "id": itemId,
      "paid": newItemStatus
    }
  }, {
    headers: {
      "authorization": token
    }
  }).then(function (response) {
    alert("變更成功");
    getOrderList();
  });
} // 刪除單筆資料


function deleteOrderItem(itemId) {
  axios["delete"]("https://livejs-api.hexschool.io/api/livejs/v1/admin/".concat(apiPath, "/orders/").concat(itemId), {
    headers: {
      "authorization": token
    }
  }).then(function (response) {
    alert("刪除成功");
    getOrderList();
  });
} // 刪除全部資料


var discardAllBtn = document.querySelector(".discardAllBtn");
discardAllBtn.addEventListener("click", function (e) {
  e.preventDefault();
  axios["delete"]("https://livejs-api.hexschool.io/api/livejs/v1/admin/".concat(apiPath, "/orders"), {
    headers: {
      "authorization": token
    }
  }).then(function (response) {
    alert("全部刪除成功");
    getOrderList();
  })["catch"](function (error) {
    alert("已無訂單");
  });
});
//# sourceMappingURL=all.js.map
