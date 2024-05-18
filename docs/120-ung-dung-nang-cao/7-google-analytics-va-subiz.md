---
id: 18827101
slug: /18827101-google-analytics-va-subiz
title: Google Analytics và Subiz
pagination_next: null
pagination_prev: null
last_update:
  date: 2024-05-18T05:15:13.634Z
---

# Google Analytics và Subiz



## Cách tích hợp


Để tích hợp Subiz với Google Analytics, bạn chỉ cần[ ](https://developers.google.com/analytics/devguides/collection/)[đặt mã nhúng Google Analytics](https://developers.google.com/analytics/devguides/collection/) lên code website của bạn. Subiz sẽ tự động tìm mã nhúng và làm việc với tài khoản Google Analytics được cài trên web. Chúng tôi hỗ trợ các loại Google Analytics tracking sau:

- [gtag.js](https://developers.google.com/analytics/devguides/collection/gtagjs/)
- [analytics.js](https://developers.google.com/analytics/devguides/collection/analyticsjs/)
## Cách làm việc của Subiz với Google Analytics


Subiz sẽ gửi các dữ liệu sự kiện (event data) của khách (user) trên website sang Google Analytics. Khi đó, bạn có thể xem được các dữ liệu này tại mục Sự kiện (event) của Google Analytics. Các sự kiện mà Subiz gửi : 


![](https://vcdn.subiz-cdn.com/file/88f97d64a83e9b1491e82a9109719bd5def0ca1323b3cd88bcedaf2e46c3fbbc_acpxkgumifuoofoosble)

## Khai thác dữ liệu


Từ những dữ liệu này, bạn có thể sử dụng để phân tích hành vi khách truy cập trên Google Analytics hoặc có thể thiết lập để thành Mục tiêu (GOAL) và đồng bộ nó sang tài khoản adwords của bạn.

- Phân tích khách tương tác Subiz theo chiến dịch quảng cáo (Campaign).
- Phân tích khách tương tác Subiz theo Nguồn truy cập (Traffic Channel).
- Phân tích khách mua hàng trên website và có tương tác Subiz.
- Thiết lập Subiz như một channel traffic để hiểu được họ mất bao nhiêu phiên tương tác để mua hàng.


## Subiz dataLayer trên Google Tag Manager


Khi bạn tích hợp mã nhúng Google Analytics (GA) qua Google Tag Manager (GTM), bạn cần thiết lập datalayer Subiz trên Google Tag Manager.



Subiz sẽ sử dụng dataLayer có **version 2** như ví dụ sau:


```
dataLayer.push({'event':'SUBIZ Chat','event_action':'Sent','event_label':'User'});

```




Subiz sẽ gửi lúc nào?

Một là: Khi cửa sổ chat Subiz được mở. Dữ liệu như sau:


```
dataLayer.push({'event':'SUBIZ Chat','event_action':'Opened','event_label':'Subiz Windows'});

```






Hai là: Khi User (khách truy cập) nhận tin nhắn. Dữ liệu như sau: 


```
dataLayer.push({'event':'SUBIZ Chat','event_action':'Received','event_label':'User'});

```






Ba là: Khi User (khách truy cập) gửi tin nhắn. Dữ liệu như sau:


```
dataLayer.push({'event':'SUBIZ Chat','event_action':'Sent','event_label':'User'});

```



## Hướng dẫn cài đặt Subiz trên GTM


Cài đặt Subiz trên GTM gồm 3 bước chính là tạo Variables (Biến), tạo Triggers (Trình kích hoạt), tạo Tags (Thẻ).



**Bước 1: Tạo 2 Variables (Biến) cho SUBIZ Chat gồm event\_action và event\_label.**

- Đăng nhập [Google Tag Manager](https://tagmanager.google.com/)
- Trong Variables, chọn “tạo mới” tại mục “User-Defined Variables”.
- Chọn loại Variable là “Data Layer Variable”, đặt tên cho biến Variable là Data Layer Subiz Action).
- Chú ý tại mục Data Layer Version, bạn chọn “Version 2”.
- Xem hình dưới để hoàn thiện các bước và Lưu.
- Sau đó, bạn tạo thêm Data Layer Subiz Label


![](https://vcdn.subiz-cdn.com/file/b9bbb9f2bb87f853ccb1171b224c091f96ebb3a3690bbea5cafcfa833e9b23e8_acpxkgumifuoofoosble)



![](https://vcdn.subiz-cdn.com/file/db892b724de838e7e996a0c9880419de282e71bd7d991a8c2212924126052e3d_acpxkgumifuoofoosble)






**Bước 2: Tạo Triggers (Trình kích hoạt) cho SUBIZ Chat**



- Bạn mở Trigger để tạo Trigger mới.
- Loại trigger chọn Custom Event
- This trigger fires on: Bạn chọn All Custom Events
- Lưu


![](https://vcdn.subiz-cdn.com/file/30c1207655b71d01e87d656099bb444ff70b2b4ffb21c794157087bf9190f588_acpxkgumifuoofoosble)




**Bước 3: Tạo Tags (Thẻ) cho SUBIZ Chat**



- Bạn tạo Tag cho Triggers. Tag này có thể là ghi nhận Goal cho Google Analytics, Conversion cho Google Ads ….
- Ví dụ ảnh dưới đây là Tag ghi nhận chuyển đổi trên GA4.
- Sau khi xong, bạn submit và publish để Google Tag Manager của bạn được cập nhật lên website. Và dùng chức năng Preview để thử với việc bạn đóng vai là khách hàng để gửi một tin nhắn trên cửa sổ chat.


![](https://vcdn.subiz-cdn.com/file/6ad36d6a7cc0014d955197fc151b69b5bd52e1c5be98d078b09d0df92497f1a7_acpxkgumifuoofoosble)





## Một số câu hỏi thường gặp


- Website có nhiều mã nhúng Google Analytics, Subiz sẽ gửi dữ liệu đến tài khoản nào? => *Subiz gửi tới tất cả các tài khoản được tích hợp.*
- Google Analytics được cài qua Google Tag Manager thì Subiz có gửi dữ liệu sang không? => *Có.*
- Thời điểm nào Subiz sẽ gửi dữ liệu sang Google Analytics? => *Ngay lúc sự kiện xẩy ra.*