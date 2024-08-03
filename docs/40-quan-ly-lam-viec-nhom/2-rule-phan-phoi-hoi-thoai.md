---
id: 972963943
slug: /972963943-rule-phan-phoi-hoi-thoai
title: Rule phân phối hội thoại
pagination_next: null
pagination_prev: null
last_update:
  date: 2024-08-03T08:45:49.186Z
---

# Rule phân phối hội thoại

## Rule phân phối là gì?




**[Rule phân phối](https://app.subiz.com.vn/settings/rule-setting)** là chức năng tự động phân chia hội thoại của khách hàng rồi giao cho nhân viên trả lời tư vấn khách, giúp chuyên môn hóa công việc cho từng nhân viên và nâng cao chất lượng dịch vụ khách hàng.



Ví dụ: 

- Rule chia theo vùng miền: Chia khách miền Bắc cho nhân viên miền Bắc, chia khách miền Nam cho nhân viên miền Nam.
- Rule theo kênh tương tác: Chia khách từ Fanpage cho nhân viên A, chia khách website cho nhân viên B.
- Rule theo hiệu suất của nhân viên: Chia đều khách cho mỗi nhân viên, chia khách cho nhân viên trả lời nhanh nhất.


![](https://vcdn.subiz-cdn.com/file/81107e0ffe74647919c91b1643350a86527ac3ff26aaee688cf0fd5705065bda_acpxkgumifuoofoosble)




Một số điểm nổi bật của Rule phân phối:

- Bạn được tạo nhiều rule phân phối khác nhau
- Rule phân phối hoạt động như phễu lọc gồm nhiều tầng lớp. Khách liên hệ được lọc theo thứ tự rule từ trên xuống dưới.



**[XEM VIDEO RULE PHÂN PHỐI HỘI THOẠI](https://www.youtube.com/watch?v=58QX5R6Z0pc&t=2s)**
## Hướng dẫn tạo rule phân phối


Để tạo rule phân phối bạn cần thức hiện 2 bước:



**Bước 1: Xác định quy tắc phân chia khách cho agent**

- Đặc điểm phân loại của khách hàng là gì? Ví dụ theo vùng miền, theo nguồn khách hàng, theo thời gian khách liên hệ,....
- Agent nào phụ trách trả lời khách hàng?



Khi đó, số lượng rule cần tạo sẽ tương ứng với số lượng nhóm khách của bạn



**Bước 2: Cài đặt rule phân phối**

Hướng dẫn cài đặt:

- Mở trang Cài đặt
- Xem cột chức năng bên trái, tìm [Rule phân phối](https://app.subiz.com.vn/settings/rule-setting)
- chọn Tạo Rule phân phối
- Nhập tên Rule để nhận biết rule này làm nhiệm vụ gì?
- Chọn điều kiện lọc khách hàng
- Chọn Phân phối tới, thêm agent trả lời khách
- Nhấp Tạo Rule là xong




![](https://vcdn.subiz-cdn.com/file/a68b7a189ab26acde74d83884e687eadb065bb21f03adbc5e54b31ecab0e9821_acpxkgumifuoofoosble)



## Một số ví dụ Rule phân phối

### TH1: Rule phân phối theo kênh website, Fanpage, Zalo




**Tình huống**: Doanh nghiệp có 3 kênh chat khách hàng là website, Fanpage, Zalo. Yêu cầu agent 1 trực chat trên website, agent 2 trực chat trên Fanpage và Zalo



**Giải pháp**: Tạo 2 Rule phân phối tương ứng 2 nhóm chat website và chat Fanpage + Zalo

- **Rule 1**: Điều kiện Rule chọn kênh tương tác là website - Chọn Phân phối 1 agent cụ thể
- **Rule 2**: Điều kiện Rule chọn kênh tương tác là Messenger + Bình luận Fanpage + Zalo - Chọn Phân phối tới 1 agent cụ thể




![](https://vcdn.subiz-cdn.com/file/2ae090c32370467de1f3385452df8edd359a32a11fcf8a6888b23983af57b7ec_acpxkgumifuoofoosble)

### TH2: Rule phân phối theo vùng miền




**Tình huống**: Doanh nghiệp có 2 chi nhánh Hà Nội và Hồ Chí Minh. Yêu cầu nhóm agent Hà Nội trực chat khách từ các tỉnh thành lân cận Hà Nội và nhóm HCM trực chat khách từ các tỉnh thành lân cận HCM



**Giải pháp**: Tạo nhóm agent HN và nhóm Agent HCM; Sau đó tạo 2 rule phân phối tương ứng nhóm khách chat vùng HN và nhóm khách chat vùng HCM

- **Bước 1**: Tạo nhóm agent tại [trang Nhóm agent](https://app.subiz.com.vn/settings/agents-group)
- **Rule 1**: Điều kiện Rule chọn Vị trí thành phố là Hanoi và thêm các thành phố lân cận - Phân phối tới nhóm agent HN
- **Rule 2**: Điều kiện Rule chọn Vị trí thành phố là Ho Chi Minh City và thêm tỉnh/thành lân cận - Phân phối tới nhóm agent HCM


![](https://vcdn.subiz-cdn.com/file/555d825fbe9198f503ffe66513b8235deb275decf1cdfd42ca44d8b3f6c2be5f_acpxkgumifuoofoosble)

### TH3: Rule phân phối theo thời gian làm việc


**Tình huống**: Trong giờ làm việc, cuộc chat sẽ chia đều vòng tròn cho agent. Ngoài giờ làm việc, các cuộc chat chia cho agent trả lời nhanh nhất để khi agent trả lời thì các agent khác không xem chat đó nữa.



**Giải pháp**:Tạo 2 rule phân phối tương ứng chat trong trong giờ làm việc và chat ngoài giờ làm việc

- **Rule 1**: Điều kiện Rule chọn Thời gian Trong giờ làm việc - Phân phối đồng đều theo vòng
- **Rule 2**: Điều kiện Rule chọn Thời gian Ngoài giờ làm việc - Phân phối tới agent trả lời nhanh nhất


![](https://vcdn.subiz-cdn.com/file/031f16738f792332703ea2d3b720e3468c339bfe355b97541387c93dd3779103_acpxkgumifuoofoosble)