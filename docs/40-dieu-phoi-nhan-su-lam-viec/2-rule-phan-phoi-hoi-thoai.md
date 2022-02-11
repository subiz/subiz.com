---
id: 972963943
slug: /972963943-rule-phan-phoi-hoi-thoai
title: Rule phân phối hội thoại
pagination_next: null
pagination_prev: null
last_update:
  date: 2023-06-23T04:58:33.529Z
---

# Rule phân phối hội thoại

## Rule phân phối là gì?




**[Rule phân phối](https://app.subiz.com.vn/settings/rule-setting)** là chức năng tự động phân chia hội thoại của khách hàng cho agent tư vấn phụ trách.



Ví dụ: 

- Rule tự động phân chia khách miền Bắc cho agent miền Bắc. Rule tự động phân chia khách miền Nam cho agent miền Nam.
- Rule tự động phân chia đồng đều theo vòng chat Fanpage cho các agent. Rule tự động phân chia chat website cho agent trả lời nhanh nhất.



**Một số lưu ý của Rule phân phối:**

- Rule phân phối giống như phễu lọc hội thoại theo các điều kiện khác nhau và phân chia tới cho agent trực chat
- Bạn được tạo nhiều rule phân phối khác nhau
- Hội thoại chat được lọc qua danh sách các rule theo thứ tự từ trên xuống



**[XEM VIDEO RULE PHÂN PHỐI HỘI THOẠI](https://www.youtube.com/watch?v=58QX5R6Z0pc&t=2s)**
## Hướng dẫn tạo rule phân phối


Để tạo rule phân phối bạn cần thức hiện 2 bước:



**Bước 1: Xác định quy trình phân chia chat cho agent**

- Bạn sẽ lọc và phân nhóm chat của khách hàng theo tiêu chí nào?
- Agent nào trực chat và phụ trách nhóm chat nào? Nếu nhiều agent trực chat thì các agent kết hợp trực chat như thế nào? Chia đều chat cho các agent hay chia cho tất cả agent cùng nhận chat hay chia chat cho agent trả lời nhanh nhất?
- Số lượng rule tạo mới sẽ tương ứng với số lượng nhóm chat bạn phân loại


![](https://vcdn.subiz-cdn.com/file/firryhedrzkeddesnbzd_acpxkgumifuoofoosble)




**Bước 2: Cài đặt rule phân phối trên Subiz**

Hướng dẫn cài đặt rule phân phối:** ****Đăng nhập Subiz** > Mở **Cài đặt** > chọn **[Rule phân phối](https://app.subiz.com.vn/settings/rule-setting)** > chọn **Tạo Rule phân phối**


![](https://vcdn.subiz-cdn.com/file/firryhedwaewfzuwskoc_acpxkgumifuoofoosble)

## Một số ví dụ Rule phân phối

### TH1: Rule phân phối theo kênh website, Fanpage, Zalo




**Tình huống**: Doanh nghiệp có 3 kênh chat khách hàng là website, Fanpage, Zalo vào Subiz. Yêu cầu agent 1 trực chat trên website, agent 2 trực chat trên Fanpage và Zalo



**Giải pháp**: Tạo 2 Rule phân phối tương ứng 2 nhóm chat website và chat Fanpage + Zalo

- **Rule 1**: Điều kiện Rule chọn kênh tương tác là website - Chọn Phân phối 1 agent cụ thể
- **Rule 2**: Điều kiện Rule chọn kênh tương tác là Messenger + Bình luận Fanpage + Zalo - Chọn Phân phối tới 1 agent cụ thể




![](https://vcdn.subiz-cdn.com/file/firryhedzcvhkouvmmvk_acpxkgumifuoofoosble)

### TH2: Rule phân phối theo vùng miền/ tỉnh thành




**Tình huống**: Doanh nghiệp có 2 chi nhánh Hà Nội và Hồ Chí Minh. Yêu cầu nhóm agent Hà Nội trực chat khách từ các tỉnh thành lân cận Hà Nội và nhóm HCM trực chat khách từ các tỉnh thành lân cận HCM



**Giải pháp**: Tạo nhóm agent HN và nhóm Agent HCM; Sau đó tạo 2 rule phân phối tương ứng nhóm khách chat vùng HN và nhóm khách chat vùng HCM

- **Bước 1**: Tạo nhóm agent tại [trang Nhóm agent](https://app.subiz.com.vn/settings/agents-group)
- **Rule 1**: Điều kiện Rule chọn Vị trí thành phố là Hanoi và thêm các thành phố lân cận - Phân phối tới nhóm agent HN
- **Rule 2**: Điều kiện Rule chọn Vị trí thành phố là Ho Chi Minh City và thêm tỉnh/thành lân cận - Phân phối tới nhóm agent HCM


![](https://vcdn.subiz-cdn.com/file/firryheecwdwfheazuio_acpxkgumifuoofoosble)

### TH3: Rule phân phối theo giờ làm việc/ agent online


**Tình huống**: Trong giờ làm việc, cuộc chat sẽ chia đều vòng tròn cho agent. Ngoài giờ làm việc, các cuộc chat chia cho agent trả lời nhanh nhất để khi agent trả lời thì các agent khác không xem chat đó nữa.



**Giải pháp**:Tạo 2 rule phân phối tương ứng chat trong trong giờ làm việc và chat ngoài giờ làm việc

- **Rule 1**: Điều kiện Rule chọn Thời gian Trong giờ làm việc - Phân phối đồng đều theo vòng
- **Rule 2**: Điều kiện Rule chọn Thời gian Ngoài giờ làm việc - Phân phối tới agent trả lời nhanh nhất


![](https://vcdn.subiz-cdn.com/file/firryheegitlzweaklaq_acpxkgumifuoofoosble)