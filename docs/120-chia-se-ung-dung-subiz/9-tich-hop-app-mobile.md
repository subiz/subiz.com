---
id: 42911075
slug: /42911075-tich-hop-app-mobile
title: Tích hợp app mobile
pagination_next: null
pagination_prev: null
last_update:
  date: 2023-07-12T04:10:28.805Z
---

# Tích hợp app mobile



## Subiz trên app mobile




Subiz chỉ hỗ trợ tích hợp trên các trang có nền tảng web. Với app mobile, Subiz sẽ tích hợp thông qua 1 trang webview có liên kết trực tiếp với app mobile.
## Hướng dẫn tích hợp app mobile




Hướng dẫn tích hợp Subiz trên app mobile gồm 5 bước:



- Bước 1: Tạo webview liên kết với app mobile, webview này sẽ hiển thi cửa sổ chat Subiz.
- Bước 2: Dán mã nhúng Subiz vào code của webview
- Bước 3: Đặt lệnh luôn mở cửa sổ chat khi khách vào webview.

Ví dụ: 
```
<script type="text/javascript"> window.subiz('expandWidget') </script> 

```




- Bước 4: Tạo nút chat trên app mobile để khách click liên hệ
- Bước 5: Thiết kế code để khi click vào nút chat trên app mobile sẽ điều hướng sang webview



Ví dụ tích hợp Subiz trên app mobile của [Hoa Sen Home](https://play.google.com/store/apps/details?id=com.hoasen)


![](https://vcdn.subiz-cdn.com/file/95b82dcfde062e70e768886fac3e775081c623e8419f853eebf2c336812e82cc_acpxkgumifuoofoosble)

## Thống kê hội thoại theo nguồn app mobile


Subiz hỗ trợ thống kê nguồn hội thoại theo tên miền. Vì vậy, khi bạn cần thống kê số lượng hội thoại khách nhắn tin từ app mobile thì bạn sẽ cài đặt thêm tên miền cho webview cụ thể như sau:




![](https://vcdn.subiz-cdn.com/file/7d20c9bf66881c784d17a7dfa72c45dd62d695af02860eb119d53db0f01fe4b2_acpxkgumifuoofoosble)


Ví dụ tên miền cho app mobile là “[http://appmobile.com](http://appmobile.com)”



Hướng dẫn xem **[thống kê hội thoại](https://app.subiz.com.vn/new-reports/convo)** theo nguồn website, trong đó “appmobile.com” là url định danh cho nguồn app mobile.


![](https://vcdn.subiz-cdn.com/file/e7dfe482709ec17404446553ae4aeef41b0b8cc470e2080bff94f7bb20fb650f_acpxkgumifuoofoosble)