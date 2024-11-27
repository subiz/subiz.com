---
id: 369864879
slug: /369864879-ket-noi-bang-hoi-website
title: Kết nối bảng hỏi trên website
pagination_next: null
pagination_prev: null
last_update:
  date: 2024-10-04T07:13:56.454Z
---

# Kết nối bảng hỏi trên website



## Mục đích




Website của bạn đã thiết kế 1 bảng hỏi thông tin khách như bảng báo giá, bảng liên hệ, phiếu thu thập ý kiến của khách hàng,...



Bạn muốn chuyển dữ liệu khách hàng điền bảng hỏi thông tin trên website về phần mềm Subiz, nhằm giúp tư vấn viên tập trung chăm sóc khách hàng. Bài viết này sẽ hướng dẫn bạn chuyển dữ liệu khách điền bảng hỏi website vào Subiz.
## Lưu ý một số thuật ngữ


- **Bảng hỏi**: Bảng hỏi thông tin khách hàng trên website. Subiz ghi nhận đây là 1 kênh tương tác khách hàng, giúp agent thống kê chuyển đổi khách.
- **Popup**: Chức năng trên Subiz cho trung chuyển thông tin khách điền bảng hỏi vào Subiz.
- **API JS**: Một mã lệnh được đặt vào code website, cho phép chuyển dữ liệu đi khi khách điền bảng hỏi.
## Hướng dẫn triển khai

### Bước 1: Kiểm tra trường thông tin khách trên Subiz




Để lưu các thông tin khách điền trong bảng hỏi trên website vào phần mềm Subiz thì phần mềm Subiz cần có các trường thông tin tương ứng.



Bạn kiểm tra trên Subiz có các trường lưu trữ thông tin khách điền chưa tại trang [TRƯỜNG THÔNG TIN](https://app.subiz.com.vn/settings/user-attributes). Nếu Subiz chưa có? Bạn sẽ tạo trường thông tin mới trên Subiz.




![](https://vcdn.subiz-cdn.com/file/299a0ae84f3b57f6c2dc34f4c186eb2feb3f72cdb46b800a3ed69b24dd354c3a_acpxkgumifuoofoosble)




[Xem hướng dẫn sử dụng thông tin khách hàng](https://subiz.com.vn/docs/777741175-thong-tin-khach-hang)
### Bước 2: Tạo popup mới trên Subiz


Khách điền thông tin qua bảng hỏi website sẽ được chuyển vào Subiz thông qua popup này. Vì vậy, bạn cần tạo popup để có mã định danh popup (ID popup) thêm vào API JavaScript tại bước 3.


![](https://vcdn.subiz-cdn.com/file/1a4a8815754560e3a3cb1bb91030f6bb4c7e5aa75eb7104479acdf88dd572837_acpxkgumifuoofoosble)




**Chức năng nổi bật**: Giúp agent nhận được thông báo tức thì ngay khi khách điền bảng hỏi website, bạn cài đặt thêm cho popup cho phép “tạo hội thoại sau khi điền bảng hỏi”


![](https://vcdn.subiz-cdn.com/file/dd504615b2c03f2af0c938cf9de2da22668dde5e05227295429fa16fd7c4a800_acpxkgumifuoofoosble)



### Bước 3: Đặt API Js vào code website




Bạn cần viết hàm API JavaScript để gửi dữ liệu từ bảng hỏi thông tin trên website đến Subiz sau khi khách hàng nhập xong thông tin.



Ví dụ mẫu API JavaScript Subiz có cấu trúc như sau:


```
<script>
  subiz('submitForm', 'cprsxvtpgbiiedribdzcj', [
 {key: 'message', value: 'mesagevalue' },
 {key: 'fullname', value: 'namevalue' },
 {key: 'email', value: 'emailvalue' },
 {key: 'phones', value: "phonevalue"}])
</script>

```



![](https://vcdn.subiz-cdn.com/file/cf321a51b47a57fdc8f63fe69b8f822f3b9e1f79f907f76dcacc25c470451f3c_acpxkgumifuoofoosble)




Ví dụ bảng hỏi trên website thiết kế như sau:




![](https://vcdn.subiz-cdn.com/file/91d67ae24eb5112cac7a6a4b2947878e30519be7b4182beb303e8e0247a35cb8_acpxkgumifuoofoosble)




Dựa vào bảng hỏi này, bạn sẽ tạo đoạn mã API JavaScript Subiz để thu thập dữ liệu từ bảng hỏi và gửi đến Subiz khi khách hàng nhấn nút "Gửi".



Dưới đây là cách bạn nối bảng hỏi trên với Subiz: 




![](https://vcdn.subiz-cdn.com/file/adc73683909f611470cde2e5ed3327c9a1d73071c5acad36c910d828499b77f2_acpxkgumifuoofoosble)

### Bước 4: Agent nhận thông tin khách trên Subiz


Các agent sẽ nhận được thông tin khách điền bảng hỏi tại trang [TIN NHẮN](https://app.subiz.com.vn/convo). Mỗi lượt khách điền bảng hỏi sẽ tạo thành một hội thoại. Thông tin khách được liệt kê dưới dạng danh sách và tự động lưu trữ vào trường thông tin khách ở cột bên phải.




![](https://vcdn.subiz-cdn.com/file/351237ae0e74d2d39bf6f3f5902e3eb51cea0a4d5a7d9240ca32bb068682aa22_acpxkgumifuoofoosble)




[Xem hướng dẫn quản lý danh sách khách tiềm năng](https://subiz.com.vn/docs/1221805713-khach-tiem-nang)


## Câu hỏi thường gặp

### Câu hỏi 1


**Tôi muốn chỉ 1 nhân viên cụ thể xem được khách từ bảng hỏi thông tin được không?**

**Trả lời**: Hoàn toàn làm được.

Khách điền thông tin bảng hỏi sẽ được tạo thành hội thoại nên bạn có thể phân chia agent nhân viên xem được khách bằng cách cài đặt rule phân phối hội thoại và chọn điều kiện kênh tương tác là Bảng hỏi thông tin.

[Xem thêm hướng dẫn sử dụng rule phân phối.](https://subiz.com.vn/docs/972963943-rule-phan-phoi-hoi-thoai)




![](https://vcdn.subiz-cdn.com/file/0445b9f114a94f817bc20f90e8250437a4c8fc6dd73757d76c278becd2a593e7_acpxkgumifuoofoosble)



### Câu hỏi 2


**Tôi muốn xuất danh sách khách điền thông tin bảng hỏi được không?**

**Trả lời**: Hoàn toàn làm được.

Khách điền bảng hỏi thông tin được lưu và tổng hợp tại trang Khách. Bạn xem tệp khách hàng popup (Mở popup bạn đã tạo ở bước 2 như hướng dẫn bên trên) và chọn xuất file dữ liệu về. 

[Xem hướng dẫn sử dụng trang Khách.](https://subiz.com.vn/docs/1221805713-khach-tiem-nang)




![](https://vcdn.subiz-cdn.com/file/5751d877af631e7321bb0c579541a38f4a7a6b29629bdbb783e5f6b5a3d22b76_acpxkgumifuoofoosble)