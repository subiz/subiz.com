---
id: 1583390769
slug: /1583390769-ket-noi-website
title: Tích hợp trên website
pagination_next: null
pagination_prev: null
last_update:
  date: 2023-09-11T08:51:55.743Z
---

# Tích hợp trên website



## Kênh website hoạt động như thế nào?


Trên website, Subiz sẽ hiển thị cửa sổ chat giúp khách truy cập dễ dàng nhắn tin liên hệ và nhận được trả lời nhanh chóng.




![](https://vcdn.subiz-cdn.com/file/9628eec96ae0a667421996a5a992d21d46a2f4545b4af5eef8a44dd7d171ecfc_acpxkgumifuoofoosble)

## Hướng dẫn cài đặt Subiz trên website


- Bước 1: Mở trang Cài đặt
- Bước 2: Chọn [Tích hợp website](https://app.subiz.com.vn/settings/website)
- Bước 3: Chọn nút Cài lên website
- Bước 4: Điền thêm tên miền website để biết bạn cài đặt cửa sổ chat trên website nào. Ví dụ: Subiz.com.vn.
- Bước 5: Sao chép mã nhúng Subiz và dán vào code website trong thẻ **body**.



Kiểm tra cài đặt thành công chưa? Vào website, F5 tải trang để cập nhật thay đổi và thấy cửa sổ chat ở góc phải màn hình là cài đặt thành công.




![](https://vcdn.subiz-cdn.com/file/42c591962429c4a1178adcdda20824589c1b1ab3799f037eccf356e851cd3f9b_acpxkgumifuoofoosble)




 
## Chỉnh sửa cửa sổ chat Subiz


Cửa sổ chat là một thành phần của website và là hình ảnh đại diện cho doanh nghiệp.



Bạn được tùy chỉnh thiết kế và thông tin hiển thị trên cửa sổ chat sao cho đồng nhất với hình ảnh chuyên nghiệp của website.



Hướng dẫn chỉnh sửa cửa sổ chat: 

- Mở trang Cài đặt
- Chọn **[Cửa sổ chat](https://app.subiz.com.vn/chatbox/design)**
- Tại đây, bạn sửa được tất cả hình ảnh, tin nhắn, màu sắc, kích thước cửa sổ chat




![](https://vcdn.subiz-cdn.com/file/1f57dd3242bc8bbf0ccd3a0c71772c8938c0fd900517fa0044cb4fdc07d00f1c_acpxkgumifuoofoosble)



## Câu hỏi thường gặp

### Tôi muốn thay đổi ảnh nút chat?


Khi khách click vào nút chat thì sẽ mở rộng cửa sổ chat để nhắn tin.Nút chat này có thể thay đổi là ảnh nhỏ hoặc ảnh lớn nhằm thu hút và kêu gọi khách “Nhắn tin liên hệ tại đây” 



Hướng dẫn thay đổi nút chat: 

- Bước 1: [Mở cài đặt cửa sổ chat](https://app.subiz.com.vn/chatbox/design)[ ](https://app.subiz.com.vn/chatbox/design)
- Bước 2: Chọn nút chat
- Bước 3: Bật ON hiện hoặc OFF tắt nút chat trên website
- Bước 4: Click ảnh nút chat để thay đổi > Chọn sử dụng ảnh nút chat trong thư viện có sẵn của Subiz hoặc tải ảnh bạn thiết kế lên.



**Lưu ý**: Thiết kế ảnh nút chat có kích thước tối đa 240px x 146px. 




![](https://vcdn.subiz-cdn.com/file/8353408486fc487766b9e9ddec6e0133c274bd68d00de2252245f6e61f81a503_acpxkgumifuoofoosble)



### Tôi muốn cài đặt mở cửa sổ chat khi khách click nút CTA trên website


Bạn sẽ không sử dụng nút chat ở góc phải hay góc trái màn hình. Bạn có thể cài đặt nút CTA ở vị trí bất kỳ trên website và mở cửa sổ chat khi khách click.



Hướng dẫn cài đặt:

- Bước 1: Tắt OFF nút chat Subiz tại trang [Cài đặt cửa sổ chat](https://app.subiz.com.vn/chatbox/design)
- Bước 2: Sử dụng API mở cửa sổ chat dưới đây khi khách click nút CTA trên website


```
<script type="text/javascript">
window.subiz('expandWidget')
</script>

```

### Chuyển nút chat lên cao hay xuống thấp hơn được không?


Bạn có thể chuyển nút chat lên cao hay xuống thấp, chuyển sang trái hay sang phải.



Hướng dẫn cài đặt:

- Bước 1: Mở [Cài đặt cửa sổ chat](https://app.subiz.com.vn/chatbox/design)
- Bước 2: chọn Vị trí và Kích thước
- Bước 3: Chọn Vị trí Bên trái/Bên phải, thay đổi px cách lề, cách chân




![](https://vcdn.subiz-cdn.com/file/9cb39200b9facfa35a3ab5874435821175581a9d54d51bf7ccee73238d25266b_acpxkgumifuoofoosble)

### Thay đổi chiều rộng và chiều dài cửa sổ chat như thế nào?




 Bạn có thể mở rộng cửa sổ chat hay thu nhỏ cửa sổ chat



Hướng dẫn cài đặt:

- Bước 1: Mở [Cài đặt cửa sổ chat](https://app.subiz.com.vn/chatbox/design)
- Bước 2: Chọn Vị trí và Kích thước
- Bước 3: Chọn px chiều rộng và chiều dài



**Lưu ý**: Trên điện thoại sẽ cố định kích thước cửa sổ chat, không thay đổi được vì màn hình điện thoại nhỏ và cần tối ưu trải nghiệm nhắn tin của người dùng.


![](https://vcdn.subiz-cdn.com/file/9cb39200b9facfa35a3ab5874435821175581a9d54d51bf7ccee73238d25266b_acpxkgumifuoofoosble)



### Tôi muốn đổi tên và ảnh logo trên cửa sổ chat?


Đổi tên trên cửa sổ chat, bạn làm 2 bước:

- Bước 1: Thay đổi tiêu đề cửa sổ chat tại [Cài đặt cửa sổ chat](https://app.subiz.com.vn/chatbox/design)
- Bước 2: Chỉnh sửa tên của agent tại [cài đặt agent](https://app.subiz.com.vn/chatbox/design)



Đổi ảnh trên cửa sổ chat, bạn cần làm 3 bước sau:

- Bước 1: Thay đổi ảnh đại diện tại [Cài đặt thông tin](https://app.subiz.com.vn/settings/)
- Bước 2: Thay đổi ảnh agent tại [cài đặt agent](https://app.subiz.com.vn/chatbox/design)
- Bước 3: Chọn hiển thị agent hoặc hiển thị logo doanh nghiệp tại [Cài đặt cửa sổ chat](https://app.subiz.com.vn/chatbox/design)




![](https://vcdn.subiz-cdn.com/file/072a3dd49198d655e83624962f21059f8080086faa2c8d39ee3e27cbb5a3fd2f_acpxkgumifuoofoosble)

### Hiện nút Facebook và Zalo trên cửa sổ chat


Hướng dẫn cài đặt:

- Bước 1: [Mở cài đặt cửa sổ chat](https://app.subiz.com.vn/chatbox/design)
- Bước 2: Chọn Tiêu đề
- Bước 3: Chọn Hiển thị logo doanh nghiệp
- Bước 4: Thêm liên kết > Chọn Fanpage và chọn Zalo > Dán đường link Fanpage, đường link Zalo OA


![](https://vcdn.subiz-cdn.com/file/072a3dd49198d655e83624962f21059f8080086faa2c8d39ee3e27cbb5a3fd2f_acpxkgumifuoofoosble)

### Lời chào thay đổi như thế nào?


Lời chào đính kèm với nút chat nên lời chào cần đơn giản và ngắn gọn.



Hướng dẫn thay đổi lời chào:

- Bước 1: [Mở cài đặt cửa sổ chat](https://app.subiz.com.vn/chatbox/design)
- Bước 2: Chọn Lời chào
- Bước 3: Bật ON và nhập nội dung lời chào






![](https://vcdn.subiz-cdn.com/file/27a1005e6b4ad668c5e31f717584878b76535aa351345369e9380cc220123b50_acpxkgumifuoofoosble)




**Lưu ý**: Khi bạn muốn tắt lời chào, bạn vào cài đặt lời chào và tắt OFF.
### Tôi muốn khách nhập thông tin trước khi chat


Hướng dẫn cài đặt:

- Bước 1: [Mở cài đặt cửa sổ chat](https://app.subiz.com.vn/chatbox/design)
- Bước 2: Chọn Hỏi thông tin trước khi chat
- Bước 3: Bật ON và thêm điều kiện hỏi thông tin của khách



**Lưu ý**: Bạn muốn hỏi nhiều thông tin khác theo yêu cầu của Doanh nghiệp, bạn sẽ cần tạo thêm trường thông tin mới tại trang **[Cài đặt Trường thông tin](https://app.subiz.com.vn/settings/user-attributes)** > Rồi quay lại thêm thông tin mới vào bảng hỏi 


![](https://vcdn.subiz-cdn.com/file/fe626a0072562179d6464abfafb5abe84c0d01ec8c620fbe3d16dd000dc72d01_acpxkgumifuoofoosble)





### Thay đổi bảng hỏi thông tin khách khi offline như thế nào?


Hướng dẫn cài đặt:

- Bước 1: [Mở cài đặt cửa sổ chat](https://app.subiz.com.vn/chatbox/design)
- Bước 2: Chọn Hỏi thông tin khi offline
- Bước 3: Bật ON và thêm điều kiện hoặc tắt điều kiện đang có



**Lưu ý**: Bạn muốn hỏi nhiều thông tin khác theo yêu cầu của Doanh nghiệp, bạn sẽ cần tạo thêm trường thông tin mới tại trang **[Cài đặt Trường thông tin](https://app.subiz.com.vn/settings/user-attributes)** > Rồi quay lại thêm thông tin mới vào bảng hỏi 




![](https://vcdn.subiz-cdn.com/file/857f2c5eb168dd591f160ebda0da17a1747307fca1884943f1e7e14059f9fd77_acpxkgumifuoofoosble)

### Sửa ngôn ngữ cửa sổ chat?


Bạn muốn cửa sổ chat của bạn hiển thị tiếng Anh hoặc tiếng Việt hoặc bất cứ ngôn ngữ nào? Cài đặt dễ dàng với Subiz.



Hướng dẫn cài đặt ngôn ngữ:

- Mở Cài đặt > chọn Cửa sổ chat
- Mở mục 2 Cài đặt điều kiện cửa sổ chat
- Chọn Đa ngôn ngữ > Thêm ngôn ngữ phù hợp