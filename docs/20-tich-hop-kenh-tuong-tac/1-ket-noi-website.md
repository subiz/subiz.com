---
id: 1583390769
slug: /1583390769-ket-noi-website
title: Tích hợp trên website
pagination_next: null
pagination_prev: null
last_update:
  date: 2024-09-05T08:16:39.205Z
---

# Tích hợp trên website

## Kênh website hoạt động như thế nào?


Trên website, Subiz sẽ hiển thị cửa sổ chat thu hút khách truy cập web, giúp khách dễ dàng nhắn tin liên hệ và nhận được trả lời nhanh chóng.




![](https://vcdn.subiz-cdn.com/file/9628eec96ae0a667421996a5a992d21d46a2f4545b4af5eef8a44dd7d171ecfc_acpxkgumifuoofoosble)

## Hướng dẫn cài đặt Subiz trên website


- Đăng nhập Subiz qua đường link https://app.subiz.com.vn
- Mở trang Cài đặt
- Tìm chức năng [Tích hợp website](https://app.subiz.com.vn/settings/website)
- Chọn nút Cài lên website ở góc phải màn hình
- Điền thêm tên miền website để biết bạn cài đặt cửa sổ chat trên website nào. Ví dụ: Subiz.com.vn.
- Sao chép mã nhúng Subiz và dán vào code website trong thẻ **body**.
- Kiểm tra cài đặt thành công chưa? Vào website, F5 tải trang để cập nhật thay đổi và thấy cửa sổ chat ở góc phải màn hình là cài đặt thành công.



[XEM VIDEO CÀI ĐẶT LÊN WEBSITE](https://www.youtube.com/watch?v=cIA8Zp_B2gg)




![](https://vcdn.subiz-cdn.com/file/42c591962429c4a1178adcdda20824589c1b1ab3799f037eccf356e851cd3f9b_acpxkgumifuoofoosble)



## Tình huống thường gặp

### Cách xử lý khi không hiện cửa sổ chat sau khi đặt mã nhúng Subiz vào code web.


Cách kiểm tra cửa sổ chat đã cài đặt thành công trên website: Mở website và chọn F5 tải xem có hiển thị cửa sổ chat không?



Cửa sổ chat Subiz không hiện trên website, thường có 4 nguyên nhân chính:



**Nguyên nhân 1: Chưa lưu thành công mã nhúng Subiz trong code web**



- Kiểm tra: Mở tab trình duyệt mới rồi mở lại website. Chọn Ctrl U, rồi Ctrl F và nhập tìm Subiz. Có tìm được mã nhúng không? Nếu không, thì do chưa lưu thành công sau khi dán mã nhúng Subiz vào code web.
- Cách xử lý: Quay lại trang admin code web tìm xem có sử dụng plugin cache nào không? Nếu có xóa cache để lưu thành công cài đặt Subiz



**Nguyên nhân 2: Sai mã nhúng khi đặt vào code website**



- Kiểm tra: so sánh mã nhúng gốc của Subiz sao chép trên trang **[Cài lên website](https://app.subiz.com.vn/website/install)** và mã nhúng đang đặt trong code web tại trang **[https://www.diffnow.com/](https://www.diffnow.com/)** này.
- Cách xử lý: Sao chép lại **[mã nhúng Subiz đúng](https://app.subiz.com.vn/website/install)** và dán vào code website. Nếu mã nhúng Subiz vẫn bị thay đổi khác, bạn hãy sử dụng đoạn mã nhúng dưới đây:


```
<script>
  window._sbzaccid = 'acpzooihzhalzeskamky'
  window.subiz = function () {
    window.subiz.q.push(arguments)
  }
  window.subiz.q = []
  window.subiz('setAccount', window._sbzaccid)
</script>
<script src="https://widget.subiz.net/sbz/app.js?account_id=acpzooihzhalzeskamky"></script>

```




Lưu ý: Đổi mã tài khoản Subiz của bạn vào đoạn mã trên (sbzaccid = 'acpzooihzhalzeskamky', [account\_id=](https://widget.subiz.net/sbz/app.js?account_id=acqopvkzjjsmiamcmvwf)acpzooihzhalzeskamky), **[Xem mã tài khoản Subiz của bạn](https://app.subiz.com.vn/settings/)**.



**Nguyên nhân 3: Sai vị trí mã nhúng Subiz trong code website.** 

- Kiểm tra mã nhúng Subiz đã đặt đúng trong thẻ “body” chưa? Trong code web sẽ có thẻ “body” mở và thẻ “body” đóng.
- Cách xử lý: Chuyển mã nhúng từ vị trí sai vào vị trí trong thẻ “body” của code web.



**Nguyên nhân 4: Có nhiều mã nhúng Subiz khác nhau trong code web**. 

- Kiểm tra: Mở tab trình duyệt mới. Mở website lên, chọn Ctrl U, chọn Ctrl F và điền Subiz. Hiện ra từ 2 mã nhúng Subiz trở lên trong code web.
- Cách xử lý: Giữ 1 mã nhúng đúng đang đặt trong thẻ “body” và xóa tất cả mã nhúng Subiz còn lại.


### Dùng Google Tag Manager để cài đặt Subiz lên website được không?




**Trả lời**: Bạn cài đặt Subiz qua Google Tag Manager được.



Khi bạn sử dụng Google Tag Manager trên website, bạn có thể tích hợp Subiz chat vào website thông qua Google Tag Manager theo các bước như sau:

Bước 1: Đăng nhập[ ](https://tagmanager.google.com/#/home)**[Tagmanager.google.com](https://tagmanager.google.com/#/home)**

Bước 2: **Chọn account quản lý website** sẽ tích hợp Subiz chat tại All account.

Bước 3: Tạo Tag mới **Tại WORKSPACE chọn Tags, nhấp NEW**

Bước 4: **Untitled Tag**: Điền tên Tag để phân biệt các Tag và chức năng của Tag

Bước 5: **Tag Configuration: **Chọn Custom HTML, **[Sao chép mã nhúng Subiz](https://app.subiz.com.vn/website/install)** và dán vào ô HTML

**Chọn (tick) Support document.write**

Bước 5:** Triggering: **Chọn All Pages nếu muốn hiển thị cửa sổ chat Subiz trên tất cả các trang của website



**Lưu ý**: Trigger là điều kiện bạn muốn thẻ Tag Subiz chat sẽ hoạt động. Bạn có thể tùy chọn Trigger theo nhu cầu riêng. Ví dụ:

    - Tất cả các trang của website (All Pages) sẽ hiển thị cửa sổ Subiz chat.
    - Chỉ một số trang (Some Pages) sẽ hiển thị cửa sổ Subiz chat.
    - Khách có một hành động cụ thể như Click, kéo scroll chuột, hay sau một khoảng thời gian vào website,.... sẽ hiển thị cửa sổ Subiz chat.

Bước 6: Chọn **SAVE**, chọn **SUBMIT** ở góc phải màn hình > Điền thông tin mô tả trong mục **Publish and Create Version** > chọn **PUBLISH** để hoàn thành.

Bước 7: Bạn hãy vào website và chọn F5 tải lại trang, kiểm tra cửa sổ chat Subiz đã hiển thị trên website.


![](https://vcdn.subiz-cdn.com/file/b24cc7dffc26c84921322d2215547aa782f824d6b63b504880318ab9f9f37530_acpxkgumifuoofoosble)

### Cài đặt Subiz trên website Wordpress


Bước 1: Mở trang quản lý WordPress Admin Panel > Appearance > Editor.

Bước 2: Tìm file footer.php bên cột bên phải và mở file này.

Bước 3: Sao chép[ mã nhúng Subiz](https://app.subiz.com.vn/website/install) tại đây.

Bước 4 Dán mã nhúng Subiz trước thẻ `body` đóng

Bước 5: Kiểm tra trên trang WordPress có dùng plugin cache nào không? Nếu có cần xóa cache để lưu mã nhúng Subiz vừa cài đặt. Ví dụ: WP Rocket, [Comet Cache](https://wordpress.org/plugins/comet-cache/), [W3 Total Cache](https://wordpress.org/plugins/w3-total-cache/),... 


![](https://vcdn.subiz-cdn.com/file/e1eed3bfefff1cc6b291c13e840f1ebc93bf0decd8a56c58622e73fe3d24b063_acpxkgumifuoofoosble)



### Cài đặt Subiz trên Ladipage


Bước 1: Login tài khoản[ ](https://ladipage.vn)**[Ladipage](https://ladipage.vn)** và chọn Landing page bạn muốn đặt Subiz.

Bước 2: Trên Ladipage, bạn vào CÀI ĐẶT TRANG tại góc dưới bên phải màn hình. Tại màn hình mở ra, bạn chọn Tab "Mã theo dõi tuỳ chỉnh". 

Bước 3: Sao chép[ ](https://app.subiz.com.vn/website/install)**[mã nhúng Subiz tại đây](https://app.subiz.com.vn/website/install)** và dán vào tab "Mã theo dõi tuỳ chỉnh" nói ở bước 2. Bạn chọn vị trí đặt là "Thêm vào trước thẻ body” > Chọn Save > Chọn Xuất bản

Bước 4: Truy cập vào Landing Page để xem hiển thị cửa sổ chat


![](https://vcdn.subiz-cdn.com/file/b53ab0290cf70df144b3e5164abb8bf69688f5c3a865c8f5de66a92bffb98050_acpxkgumifuoofoosble)



### Cài đặt Subiz trên web Sapo


Bước 1: Đăng nhập trang quản trị website của Sapo > Chọn Website.

Bước 2: Chọn **Giao diện > Thao tác > Chỉnh sửa HTML/CSS.**

Bước 3: Chọn Them.bwt > Tìm thẻ “body” >[ ](https://app.subiz.com/settings/install)**[Sao chép mã nhúng Subiz](https://app.subiz.com/settings/install)** và dán trước thẻ “body” > Lưu để hoàn thành




![](https://vcdn.subiz-cdn.com/file/23cc211a5802acc41fd26b90df83756ef3368f7a37037b109245bbbacaf3b9ad_acpxkgumifuoofoosble)



### Cài đặt Subiz trên website Haravan




Bước 1:[ ](https://myharavan.com/admin/auth/login)**[Đăng nhập](https://myharavan.com/admin/auth/login)** trang quản lý website của Haravan

Bước 2: Chọn **Website** > chọn **Giao diện** > chọn

Bước 3: Chọn **theme.liquid** trong Layouts > Tìm thẻ “head” >[ ](https://app.subiz.com/settings/install)[Sao chép mã nhúng Subiz](https://app.subiz.com/settings/install) và dán ngay sau thẻ “head” > chọn **Lưu** để hoàn thành




![](https://vcdn.subiz-cdn.com/file/8fb1222914f28f1d632e3a0e8d184eb04ac492234d9a0fa5b20336bf44e2f654_acpxkgumifuoofoosble)