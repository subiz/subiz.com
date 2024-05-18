---
id: 158663500
slug: /158663500-quan-ly-nhieu-website
title: Quản lý nhiều website
pagination_next: null
pagination_prev: null
last_update:
  date: 2023-07-12T04:09:57.873Z
---

# Quản lý nhiều website

## Quản lý nhiều website như thế nào?




Bạn đang có nhiều website khác nhau và muốn quản lý chung tất cả khách hàng trên 1 tài khoản Subiz. 



Chỉ cần đăng nhập 1 tài khoản Subiz, bạn sẽ:

- Quan sát được tất cả khách truy cập trên tất cả website
- Trả lời chat của khách liên hệ từ tất cả website
- Sử dụng được bot tự động gửi tin nhắn riêng cho mỗi website
- Tự động phân chia khách hàng từ mỗi website cho agent phụ trách riêng
- Thay đổi hình ảnh và nội dung của cửa sổ chat khác nhau trên mỗi website



**Lưu ý**: Bạn chỉ có thể cài đặt cửa sổ chat khác nhau trên nhiều website khi tài khoản có nhiều agent. Vì mỗi agent sẽ hiển thị tên và hình ảnh thương hiệu của mỗi website, **[xem thêm cài đặt agent](https://subiz.com.vn/docs/628554948-tong-quan-ve-agent)**.
## Hướng dẫn cài đặt


- Bước 1: Kiểm soát danh sách website
- Bước 2: Mời thêm agent phụ trách mỗi website
- Bước 3: Tùy chỉnh cửa sổ chat trên Subiz cho website đầu tiên
- Bước 4: Sử dụng API thay đổi cửa sổ chat trên mỗi website còn lại
- Bước 5: Rule phân chia chat từ mỗi website
- Bước 6: Bot tự động trả lời riêng từng website
- Bước 7: Báo cáo hội thoại của mỗi website
### Bước 1: Kiểm soát danh sách website


Bạn có nhiều website khác nhau. Để biết cụ thể website nào đang tích hợp Subiz, bạn thêm tên miền website tại trang [Cài lên website](https://app.subiz.com.vn/website/install)




![](https://vcdn.subiz-cdn.com/file/ece436ca9609375983b47ed6f324c26a3fccc6e9e7dd175007490133d3bc3f6c_acpxkgumifuoofoosble)
 
### Bước 2: Mời thêm agent


Để cửa sổ chat hiển thị tên và ảnh của thương hiệu/website, bạn sẽ tạo thêm agent có tên và ảnh của thương hiệu tương ứng.



Hướng dẫn tạo thêm agent: Vào trang [cài đặt agent](https://app.subiz.com.vn/settings/agents) > chọn Mời agent > Điền tên và ảnh thương hiệu cho agent đó.

Lưu ý: Mỗi agent sẽ có 1 mã định dạng, bạn lấy mã agent bằng cách chọn chỉnh sửa agent > trên tab trình duyệt hiện “agent\_id”. 


![](https://vcdn.subiz-cdn.com/file/e16a26f5b8306627bc136b4bae5163716b1b0884447925e4db513eb274734d05_acpxkgumifuoofoosble)

### Bước 3: Chỉnh sửa cửa sổ chat trên Subiz cho website đầu tiên


Bạn cần chỉnh sửa cửa sổ chat trên website đầu tiên tại trang [Cài đặt chỉnh sửa cửa sổ chat](https://app.subiz.com.vn/chatbox/design) này. 

Tại đây, bạn sửa: Tiêu đề chọn hiển thị agent và Lời chào chọn tên agent tương ứng với tên thương hiệu của website đầu tiên; Bảng hỏi thông tin khách trước khi chat và Bảng hỏi thông tin khi offline thì nhập nội dung chung không có tên thương hiệu.




![](https://vcdn.subiz-cdn.com/file/2ff9ad825e11691d274e54ef9f81ea231b17f8794781b70d82e39601e5beb6de_acpxkgumifuoofoosble)

### Bước 4: Sử dụng API chỉnh sửa cửa sổ chat trên website còn lại


Từ website thứ 2, bạn cài đặt được tên, ảnh thương hiệu, lời giới thiệu, lời chào qua mã API đặt trực tiếp trong code web, trong mã API cần thay đổi “agent\_id” và nội dung tin nhắn riêng cho từng website. 

Lưu ý nên đặt mã API ngay dưới mã nhúng Subiz để dễ quản lý.



**Ví dụ mã API sửa tiêu đề, lời chào hiển thị tên/ ảnh thương hiệu**


```
<script>
  subiz('overrideChatbox', {
    type: 'chatbox',
    chatbox: {
      header: {
      layout: 'agent',
      agent_ids: ['agpzooihzhajkqcebf'],
    },
      caption: {vi_VN: 'Tư vấn viên'},
      tagline: {vi_VN: 'Chúng tôi luôn sẵn sàng hỗ trợ và tư vấn Quý khách.'},
      greeting: {
        agent_id: "agpzooihzhajkqcebf",
        greeting: {
          vi_VN: 'Xin chào, hãy chat tư vấn ngay tại đây nhé :wave:'
        },
      },
    },
  })
</script>


```




**Ví dụ API sửa màu nền cửa sổ chat**


```
<script>
subiz('overrideChatbox', {
    type: 'chatbox',
    chatbox: {
      caption: {vi_VN: 'Doanh nghiệp', en_US: 'My Business'},
      greeting: {
        greeting: {
          vi_VN: 'Xin chào, hãy chat với tôi nhé', 
          en_US: "Hi, let's have a chat"
        },
      },
      background: 'linear-gradient(to right top, #051937, #004d7a, #008793, #00bf72, #a8eb12)',
      primary_color: '#051937',
    },
  })
</script>

```




**Ví dụ API thay đổi nút chat**
```
<script>
subiz('overrideChatbox', {
  chatbox: {
    desktop_button: {
      background_mask_url: 'https://public-gcs.subiz-cdn.com/dashboard-v4/public/img/bubble/bubble_00.svg',
    background_image_url: '',
      margin_x: 20,
      margin_y: 20,
      position: 'right',
    },
    mobile_button: {
      background_mask_url: 'https://public-gcs.subiz-cdn.com/dashboard-v4/public/img/bubble/bubble_00.svg',
            background_image_url: '',

      margin_x: 10,
      margin_y: 10,
      position: 'left',
    },
  },
})
</script>

```

### Bước 5: Rule phân chia chat từ mỗi website


Khi bạn muốn phân chia chat từ một website cụ thể cho các agent tư vấn viên, bạn sẽ [cài đặt rule phân phối](https://app.subiz.com.vn/settings/rule-setting):

- Đặt tên rule dễ phân biệt website và agent trực chat
- Điều kiện rule: chọn Kênh tương tác - Website - Tên miền website
- Phân phối tới: chọn thêm agent trực chat

Ví dụ Rule phân phối chat từ 2 website khác nhau cho 2 agent khác nhau trực chat


![](https://vcdn.subiz-cdn.com/file/b8ace8df8f00a40b1a5d1711d67e786890347092cf60c8d1a69131152880a608_acpxkgumifuoofoosble)

### Bước 6: Bot tự động trả lời riêng từng website


Bot tự động chào đón và trả lời riêng cho từng website. Bạn [tạo bot mới](https://app.subiz.com.vn/bots) và tại mục 2 cài đặt > Chọn “Trên các website có chứa” - điền “tên miền website” 




![](https://vcdn.subiz-cdn.com/file/4d3f1474c4d019a4825035af9f258a52fd5971547876d7f3c0d647fb20609cbe_acpxkgumifuoofoosble)



### Bước 7: Thống kê hội thoại của mỗi website


Bạn cần báo cáo, so sánh số lượng hội thoại khách nhắn tin trên mỗi website, bạn sẽ vào thống kê hội thoại và xem mục Theo website” - “Nguồn hội thoại” 

Lưu ý: [Cần thêm tên miền website](https://subiz.com.vn/docs/158663500-quan-ly-nhieu-website#b%C6%B0%E1%BB%9Bc-1-ki%E1%BB%83m-so%C3%A1t-danh-s%C3%A1ch-website) tại trang tích hợp website để Subiz thống kê 
![](https://vcdn.subiz-cdn.com/file/6c6ebfb5c636396147b236a6058af8a9bc755ab30483611b5522881fedec611d_acpxkgumifuoofoosble)

### 

###