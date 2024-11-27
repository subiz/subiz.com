---
id: 158663500
slug: /158663500-quan-ly-nhieu-website
title: Quản lý nhiều website
pagination_next: null
pagination_prev: null
last_update:
  date: 2024-11-26T11:22:44.437Z
---

# Quản lý nhiều website

## Lợi ích quản lý nhiều website trên Subiz


Subiz hỗ trợ bạn quản lý và tương tác khách hàng trên nhiều website chỉ với một nền tảng duy nhất. Bạn có thể:

- Theo dõi toàn bộ khách truy cập trên tất cả website.
- Trả lời nhanh chóng tất cả tin nhắn từ bất kỳ website nào.
- Cá nhân hóa giao diện cửa sổ chat cho từng website khác nhau.
- Tùy chỉnh Bot tự động gửi tin nhắn riêng biệt cho từng website.
- Phân chia hội thoại theo từng website tới các nhân viên phụ trách.
## Hướng dẫn cài đặt


- Bước 1: Quản lý danh sách website
- Bước 2: Thêm Agent phụ trách từng website
- Bước 3: Tùy chỉnh cửa sổ chat cho website đầu tiên
- Bước 4: Cài đặt API sửa cửa sổ chat cho các website khác
- Bước 5: Phân phối khách hàng theo từng website
- Bước 6: Bot tự động trả lời theo từng website
- Bước 7: Thống kê hội thoại từng website
### Bước 1: Quản lý danh sách website


Thêm danh sách tên miền website vào trang [Cài đặt website](https://app.subiz.com.vn/website/install) của Subiz để quản lý tất cả các website trên cùng một giao diện Subiz. 



Sau đó bạn sao chép mã nhúng Subiz và dán vào code website.




![](https://vcdn.subiz-cdn.com/file/ece436ca9609375983b47ed6f324c26a3fccc6e9e7dd175007490133d3bc3f6c_acpxkgumifuoofoosble)
 
### Bước 2: Thêm Agent phụ trách từng website


Để hiển thị thông tin thương hiệu trên cửa sổ chat, tạo Agent mới có họ tên và ảnh đại diện của thương hiệu.



Hướng dẫn tạo thêm agent: 

- Vào trang [cài đặt agent](https://app.subiz.com.vn/settings/agents)
- Chọn Mời agent
- Nhập họ tên là tên thương hiệu, rồi chỉnh sửa agent để thay đổi ảnh đại diện là logo thương hiệu
- Lưu ý: Mỗi agent sẽ có 1 mã định dạng, bạn lấy mã agent bằng cách chọn chỉnh sửa agent, xem trên tab trình duyệt hiện “agent\_id”.


![](https://vcdn.subiz-cdn.com/file/e16a26f5b8306627bc136b4bae5163716b1b0884447925e4db513eb274734d05_acpxkgumifuoofoosble)

### Bước 3: Tùy chỉnh cửa sổ chat cho website đầu tiên


Tại trang [Chỉnh sửa cửa sổ chat](https://app.subiz.com.vn/chatbox/design), bạn thực hiện:

- Sửa lần lượt tiêu đề, lời chào phù hợp với thương hiệu của website.
- Bật/ Tắt bảng hỏi thông tin trước khi chat và khi offline nếu cần




![](https://vcdn.subiz-cdn.com/file/2ff9ad825e11691d274e54ef9f81ea231b17f8794781b70d82e39601e5beb6de_acpxkgumifuoofoosble)

### Bước 4: Cài đặt API sửa cửa sổ chat cho các website khác


Sử dụng mã API để tùy chỉnh cửa sổ chat cho từng website khác nhau:

- Thay đổi tên thương hiệu, ảnh logo hiển thị theo thông tin của agent đã tạo ở bước 2 phía trên. Lưu ý: Trong đoạn mã API cần lấy “agent\_id” theo hướng dẫn tại bước 2. Sửa lời chào, màu sắc.
- Đặt mã API sửa cửa sổ chat ngay dưới mã nhúng Subiz để dễ quản lý

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

// Lưu ý cần sửa các nội dung sau:
agent_ids
caption
tagline
greeting


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

// Lưu ý cần sửa các nội dung sau:
caption
greeting
background


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




**Ví dụ API sửa tiêu đề và lời chào**
```
<script>
  subiz('overrideChatbox', {
    type: 'chatbox',
    chatbox: {
      caption: {vi_VN: 'Tư vấn viên'},
      tagline: {vi_VN: 'Chúng tôi luôn sẵn sàng hỗ trợ và tư vấn Quý khách.'},
      greeting: {
        vi_VN: 'Xin chào, hãy chat tư vấn ngay tại đây nhé :wave:'
      },
    },
  })
</script>


// Lưu ý cần sửa các nội dung sau:
caption
tagline
greeting

```

### Bước 5: Phân phối khách hàng theo từng website


Khi bạn muốn phân chia chat từ một website cụ thể cho các agent tư vấn viên, bạn sẽ [cài đặt rule phân phối](https://app.subiz.com.vn/settings/rule-setting):

- Đặt tên rule dễ phân biệt website và agent trực chat
- Điều kiện rule: chọn Kênh tương tác là Website và nhập tên miền website
- Phân phối tới: chọn thêm agent trực chat

Ví dụ Rule phân phối chat từ 2 website khác nhau cho 2 agent khác nhau trực chat


![](https://vcdn.subiz-cdn.com/file/b8ace8df8f00a40b1a5d1711d67e786890347092cf60c8d1a69131152880a608_acpxkgumifuoofoosble)

### Bước 6: Bot tự động trả lời theo từng website


Bot tự động chào đón và trả lời riêng cho từng website. 

- [Tạo bot mới](https://app.subiz.com.vn/bots)
- Tại mục 2 cài đặt, chọn “Trên các website có chứa” và điền “tên miền website”




![](https://vcdn.subiz-cdn.com/file/4d3f1474c4d019a4825035af9f258a52fd5971547876d7f3c0d647fb20609cbe_acpxkgumifuoofoosble)



### Bước 7: Thống kê hội thoại của mỗi website


Vào [Thống kê hội thoại](https://app.subiz.com.vn/new-reports/convo), chọn Theo website để xem chi tiết số lượng hội thoại từ từng nguồn.


![](https://vcdn.subiz-cdn.com/file/6c6ebfb5c636396147b236a6058af8a9bc755ab30483611b5522881fedec611d_acpxkgumifuoofoosble)

### 

###