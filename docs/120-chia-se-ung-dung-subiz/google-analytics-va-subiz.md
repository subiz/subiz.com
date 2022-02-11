---
id: 18827101
slug: /18827101-google-analytics-va-subiz
title: Google Analytics và Subiz
pagination_next: null
pagination_prev: null
last_update:
  date: 2022-12-22T10:14:43.692Z
---

# Google Analytics và Subiz



## Cách tích hợp


Để tích hợp Subiz với Google Analytics, bạn chỉ cần[ ](https://developers.google.com/analytics/devguides/collection/)[đặt mã nhúng Google Analytics](https://developers.google.com/analytics/devguides/collection/) lên code website của bạn. Subiz sẽ tự động tìm mã nhúng và làm việc với tài khoản Google Analytics được cài trên web. Chúng tôi hỗ trợ các loại Google Analytics tracking sau:

- [gtag.js](https://developers.google.com/analytics/devguides/collection/gtagjs/)
- [analytics.js](https://developers.google.com/analytics/devguides/collection/analyticsjs/)
## Cách làm việc của Subiz với Google Analytics


Subiz sẽ gửi các dữ liệu sự kiện (event data) của khách (user) trên website sang Google Analytics. Khi đó, bạn có thể xem được các dữ liệu này tại mục Sự kiện (event) của Google Analytics. Các sự kiện mà Subiz gửi : 


![](https://vcdn.subiz-cdn.com/file/firrxrtadjpebxfdcnnj_acpxkgumifuoofoosble)

## Khai thác dữ liệu


Từ những dữ liệu này, bạn có thể sử dụng để phân tích hành vi khách truy cập trên Google Analytics hoặc có thể thiết lập để thành Mục tiêu (GOAL) và đồng bộ nó sang tài khoản adwords của bạn.

- Phân tích khách tương tác Subiz theo chiến dịch quảng cáo (Campaign).
- Phân tích khách tương tác Subiz theo Nguồn truy cập (Traffic Channel).
- Phân tích khách mua hàng trên website và có tương tác Subiz.
- Thiết lập Subiz như một channel traffic để hiểu được họ mất bao nhiêu phiên tương tác để mua hàng.


## Subiz dataLayer trên Google Tag Manager


Khi bạn tích hợp mã nhúng Google Analytics (GA) qua Google Tag Manager (GTM), bạn cần thiết lập datalayer Subiz trên Google Tag Manager.



Subiz sẽ sử dụng dataLayer có **version 2** như ví dụ sau:

***dataLayer.push({'event':'SUBIZ Chat','event\_action':'Sent','event\_label':'User'});***



Subiz sẽ gửi lúc nào?

- Khi cửa sổ chat Subiz được mở. Dữ liệu như sau: ***dataLayer.push({'event':'SUBIZ Chat','event\_action':'Opened','event\_label':'Subiz Windows'});***

- Khi User (khách truy cập) nhận tin nhắn. Dữ liệu như sau: ***dataLayer.push({'event':'SUBIZ Chat','event\_action':'Received','event\_label':'User'});***

- Khi User (khách truy cập) gửi tin nhắn. Dữ liệu như sau: ***dataLayer.push({'event':'SUBIZ Chat','event\_action':'Sent','event\_label':'User'});***



Hướng dẫn cài đặt Subiz trên GTM:

- Đăng nhập [Google Tag Manager](https://tagmanager.google.com/)
- Trong Variables, chọn tạo mới tại mục User-Defined Variables.
- Chọn loại Variable là Data Layer Variable, đặt tên cho biến Variable (ví dụ trong ảnh là Data Layer Subiz Action).
- xem hình dưới để hoàn thiện các bước và Lưu.
- Chú ý tại mục Data Layer Version bạn chọn Version 2 - đây là version Data Layer Subiz sử dụng.


![](https://vcdn.subiz-cdn.com/file/firrxrtafxlfjyekxokv_acpxkgumifuoofoosble)




- Tiếp đến, bạn vào Trigger để tạo Trigger mới.
- Loại trigger chọn Custom event
- This trigger fires on: Bạn chọn chính Variable đã tạo ở trên, trong ảnh ví dụ này nó có tên là Data Layer Subiz Action. Và chọn biến này bằng (equals) **Sent**
- Lưu


![](https://vcdn.subiz-cdn.com/file/firrxrtaijifllkvnhab_acpxkgumifuoofoosble)




- Tiếp đến bạn thiết lập Tag cho trigger. Tag này có thể là ghi nhận Goal cho Google Analytics, Conversion cho Google Ads ….



Sau khi xong, bạn publish để Google Tag Manager của bạn được cập nhật lên website. Và dùng chức năng Preview để thử với việc bạn đóng vai là khách hàng để gửi một tin nhắn trên cửa sổ chat.
## Một số câu hỏi thường gặp


- Website có nhiều mã nhúng Google Analytics, Subiz sẽ gửi dữ liệu đến tài khoản nào? => *Subiz gửi tới tất cả các tài khoản được tích hợp.*
- Google Analytics được cài qua Google Tag Manager thì Subiz có gửi dữ liệu sang không? => *Có.*
- Thời điểm nào Subiz sẽ gửi dữ liệu sang Google Analytics? => *Ngay lúc sự kiện xẩy ra.*