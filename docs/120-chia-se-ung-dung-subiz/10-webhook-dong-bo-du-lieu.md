---
id: 1214356822
slug: /1214356822-webhook-dong-bo-du-lieu
title: Webhook đồng bộ dữ liệu
pagination_next: null
pagination_prev: null
last_update:
  date: 2023-07-12T04:10:36.529Z
---

# Webhook đồng bộ dữ liệu

## Webhook là gì?


Subiz sử dụng webhooks để thông báo cho bạn biết một sự kiện đã xảy ra trong tài khoản. Qua đó bạn có thể tích hợp Subiz với các bên khác như CRM, SMS, ... 

Webhook lắng nghe các sự kiện xảy ra trong tài khoản subiz rồi gửi chi tiết sự kiện sang máy chủ của bạn.

Ví dụ:

- Khi một người dùng mới vào website, Webhook thông báo sang cho server của bạn.
- Khi một người dùng Facebook gửi tin nhắn lên Fanpage. Webhook chuyển tin nhắn này tới server của bạn.
- Khi tư vấn viên cập nhật thông tin của khách hàng trên Subiz. Webhook gửi thông tin này sang server của bạn.


![](https://vcdn.subiz-cdn.com/file/firtbcyiyyvaiiypiaeu_acpxkgumifuoofoosble)

## Bạn cần chuẩn bị những gì?


Để sử dụng được tính năng webhook, bạn phải:

01. Sở hữu một máy chủ HTTP công khai trên internet.
11. Xử lý gói tin nhận được từ webhook (biết code).

Bạn có thể tự dựng máy chủ vật lý hoặc thuê máy chủ ảo. Khi tạo dựng được máy chủ, bạn cần cung cấp một đường dẫn URL (endpoint) để nhận dữ liệu từ subiz. Thông thường URL sẽ có dạng[ ](https://example.com/webhooks)[https://example.com/webhooks](https://example.com/webhooks) hoặc[ ](http://192.123.233.244/webhook)[http://192.123.233.244/webhook](http://192.123.233.244/webhook).

Subiz sẽ gửi dữ liệu sang endpoint này với một định dạng đã được quy chuẩn, bạn cần phải hiểu định dạng này và biết cách lấy được những thông tin mình quan tâm. (Định dạng sẽ được mô tả chi tiết ở phần sau).

Ví dụ về một gói dữ liệu subiz sẽ gửi sang:
```
// JSON
{
  "events": [
    {
      "id": "evqwjalnhlrkwyvuspdfmwzlv",
      "account_id": "acpxkgumifuoofoosble",
      "created": 1608883792973,
      "type": "message_sent",
      "by": { "id": "bbqvwqeofekbxyvlmj", "type": "agent" },
      "data": {
        "message": {
          "conversation_id": "csqwjalnenqynheyql",
          "text": "Rất vui được gặp bạn!",
          "format": "plaintext",
          "integration_id": "acpxkgumifuoofoosble.subizv4.subikon"
        }
      }
    }
  ]
}

```

## Xây dựng endpoint nhận webhook


Việc đầu tiên cần làm là xây dựng endpoint nhận dữ liệu của riêng bạn. Tạo một webhook endpoint trên server của bạn không khác gì việc tạo một trang mới trên website của bạn. Nếu bạn sử dụng PHP, bạn sẽ cần tạo một file .php mới. Nếu bạn sử dụng NodeJS framework Express, bạn sẽ cần tạo một route mới với đường dẫn mong muốn.

Trước khi bắt đầu code, bạn lưu ý phải trả về mã HTTP 2xx thật nhanh. Khi bạn trả về 2xx chúng tôi hiểu endpoint của bạn đã nhận được dữ liệu thành công. Tất cả các mã ngoài khoảng này, kể cả 3xx, đều chỉ ra rằng bạn chưa nhận được event.

Khi thấy endpoint không nhận event, chúng tôi sẽ cố gắng gửi lại event đó nhiều lần. Nếu sau vài ngày vẫn thất bại, chúng tôi ghi nhận endpoint đã chết, sẽ dừng hoàn toàn việc gửi dữ liệu và vô hiệu hóa webhook cho endpoint của bạn. Khi bị vô hiệu hóa, toàn bộ khối dữ liệu nghẽn được lưu trữ từ lúc endpoint của bạn không trả về 2xx sẽ bị giải phóng, không thể lấy lại ngay cả khi bạn kích hoạt lại webhook.

Vì việc ghi nhận gửi thành công cực kỳ quan trọng, endpoint của bạn nên trả về 2xx trước khi xử lý những logic phức tạp để tránh gây timeout.
### Kiểm tra webhook signature 


Subiz sẽ (không bắt buộc) ký các event webhook gửi sang endpoint của bạn. Việc này cho phép bạn xác thực gói tin nhận được là từ Subiz gửi sang, chứ không phải của một bên khác.

Phần này hướng dẫn bạn cách xác thực chữ ký, ngoài ra nó cung cấp một số đoạn code mẫu giúp bạn dễ dàng hình hơn.
#### Tại sao bạn cần xác thực


Endpoint của bạn sớm hay muộn cũng sẽ bị công khai trên internet (có thể do search engine quét được, có thể do nhà cung cấp mạng sơ ý để lộ dữ liệu, ...). Khi bị đối tượng phá hoại dò được, chúng có thể gửi các gói tin giả mạo, gây xáo trộn, phá hỏng tính toàn vẹn dữ liệu, tồi tệ hơn, chúng có thể chiếm được quyền điều khiển server (qua một số lỗ hổng bảo mật trên server của bạn).

"*Ôi, chắc chẳng ai thèm hack server mình đâu, còn bao việc*" là suy nghĩ của hầu hết nhà phát triển trước khi phát hiện ra mình bị hack.

Cẩn tắc vô áy náy, bạn cần xác thực gói tin ngay từ những giây phút đầu tiên.
#### Thiết lập mật khẩu cho webhook


Một lưu ý trước khi bạn bắt đầu là cơ chế xác thực chỉ áp dụng cho những webhook có đặt mật khẩu. Nếu bạn bỏ trống trường mật khẩu, chúng tôi ngầm hiểu rằng bạn đang áp dụng một cơ chế xác thực khác mà không muốn sử dụng cơ chế xác thực cung cấp bởi Subiz.

Bạn có thể thiết lập mật khẩu cho webhook bằng cách đăng nhập vào Dashboard của Subiz. Vào Setting → Webhook → Chỉnh sửa, rồi chọn thay đổi ô Mật khẩu


![](https://vcdn.subiz-cdn.com/file/firtbdctfjdcsgjosfcm_acpxkgumifuoofoosble)


Khi chọn mật khẩu, bạn nên sử dụng một mật khẩu ngẫu nhiên, càng dài sẽ càng bảo mật và không nhất thiết phải chứa ký tự đặc biệt. Nếu mật khẩu bị lộ, bên thứ 3 có thể giả dạng Subiz để gửi event không tin cậy sang endpoint của bạn.

Mật khẩu này sẽ được sử dụng mỗi khi Subiz gửi tin sang endpoint của bạn. Chúng tôi sẽ tạo ra một chữ ký riêng biệt cho từng gói tin rồi gắn vào header \`\`X-Hub-Signature-256\` trước khi gửi tới endpoint của bạn.

Chữ ký được tạo ra bằng **thuật toán HMAC với hàm hash SHA256** ([hash-based message authentication code](https://en.wikipedia.org/wiki/HMAC) - là một kỹ thuật cơ bản và hiệu quả, hiện đang được sử dụng rộng rãi trên hầu hết các nền tảng webhook như của facebook, google, stripe hay github). HMAC đươc triển khai sẵn trên hầu hết các nền tảng lập trình. Về cơ bản, HMAC là một hàm nhận vào 3 tham số: thuật toán hash, mật khẩu và nội dung gói tin, trả ra chữ ký cho gói tin truyền vào.
```
HMAC(hashFunction, secret, message) => signature
HMAC("sha256", "sEcRet2", "chào buổi sáng") ⇒ sha256=f8e31a0ae3b14162acb325782cc4577677d30cc7e5132fbbdfae94b7a576a7b5
HMAC("sha256", "sEcRet", "chào buổi sáng") ⇒ sha256=2bf37e91738c8a4135c148751a9e5d65b40b7925cd38eae17634564f48842509


```


Ví dụ sinh chữ ký bằng Nodejs: 
```
const crypto = require('crypto');

const createSignature = (secret, message) => {
        return 'sha256=' + crypto.createHmac('sha256', secret).update(message).digest('hex');
};


```


Ví dụ sinh chữ ký bằng Golang
```
import (
        "crypto/hmac"
        "crypto/sha256"
        "encoding/hex"
)
func createSignature (secret, message string) string {
         sig := hmac.New(sha256.New, []byte(secret))
         sig.Write([]byte(message)
        return "sha256=" + hex.EncodeToString(sig.Sum(nil))
}


```


Ví dụ sinh chữ ký bằng Java
```
import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import org.apache.commons.codec.binary.Base64;

public class HMACExample {
  public static void main(String[] args) {
    try {
     String secret = "secret";
     String message = "Message";

     Mac sha256_HMAC = Mac.getInstance("HmacSHA256");
     SecretKeySpec secret_key = new SecretKeySpec(secret.getBytes(), "HmacSHA256");
     sha256_HMAC.init(secret_key);

     String hash = Base64.getEncoder().encodeToString(sha256_HMAC.doFinal(message.getBytes()));
     System.out.println(hash);
    }
    catch (Exception e){
     System.out.println("Error");
    }
   }
}


```


Ví dụ sinh chữ ký bằng PHP


```
<?php
        function signature($secret, $message) {
    $hexHash = hash_hmac('sha256', utf8_encode($message), utf8_encode($secret));
    $base64Hash = base64_encode(hex2bin($hexHash));
    return $base64Hash;
  }
?>


```


Ví dụ sinh chữ ký bằng Ruby
```
require 'openssl'
require "base64"

hash = OpenSSL::HMAC.digest(hashFunction, secret, message)
puts Base64.encode64(hash)


```

## Quy trình xác thực gói tin



![](https://vcdn.subiz-cdn.com/file/firtbcyjfsgwyytnclov_acpxkgumifuoofoosble)


Đầu gửi (subiz)

01. Lấy mật khẩu và nội dung body của gói tin cần gửi đi, chạy qua thuật toán HMAC-sha256. Kết quả nhận được chính là chữ ký.
11. Đưa chữ ký vào trong HTTP header X-Hub-Signature-256. Ví dụ X-Hub-Signature-256: sha256=766c10dbe4387
21. Gửi HTTP request tới endpoint

Đầu nhận (endpoint của bạn)

01. Khi nhận được request mới, đọc HTTP header X-Hub-Signature-256, bóc tách để lấy chữ ký cho gói tin nhận được.
11. Lấy mật khẩu và nội dung body của gói tin nhận được, chạy qua thuật toán HMAC-sha256 để lấy chữ ký chuẩn.
21. So sánh chữ ký vừa sinh ra và **những** chữ ký nhận được. Nếu giống hệt nhau có thì gói tin đáng tin cậy. Nếu khác nhau chứng tỏ gói tin nhận được không phải từ subiz, có thể loại bỏ.
### Đổi mật khẩu webhook


Bạn phải đảm bảo mật khẩu webhook đặt trên subiz và mật khẩu webhook trên server của bạn giống hệt nhau. Trường hợp bạn đổi mật khẩu webhook. Trong 24 tiếng tiếp theo, Subiz sẽ đính kèm theo gói tin 2 chữ ký, một chữ ký bằng mật khẩu mới, một chữ ký bằng mật khẩu cũ. Mục đích là để bạn có thời gian cập nhật mật khẩu mới trên server của mình. Header sẽ trông như sau:
```
Content-Type: application/json
User-Agent: Subiz-Hook/whqwhxhttgkkaoudzzhth
X-Hub-Signature-256: sha256=f8e31a0ae3b14162acb325782cc4577677d30cc7e5132fbbdfae94b7a576a7b5
X-Hub-Signature-256: sha256=056b684f0a970d9264d615be6ab4c80e110c099026909e593439f60eeb2b9246

```


Server của bạn cần chấp nhận gói tin mà thỏa mãn một trong 2 chữ ký. Bỏ gói tin mà không thỏa mãn chữ ký nào. Sau 24 tiếng, Subiz sẽ ngừng gửi chữ ký bằng mật khẩu cũ.
### Gói tin gửi đi


Khi có event bạn quan tâm xảy ra, webhook sẽ đóng gói các thông tin của event này lại và gửi sang endpoint URL của bạn bằng một HTTP request có phương thức là POST, kiểu dữ liệu là application/json

Phần này mô tả chi tiết về nội dung, cấu trúc của gói tin gửi đi.

**Body**

Với mỗi request, Subiz sẽ gửi tới endpoint của bạn một gói tin JSON, chứa một mảng chứa thông tin của một hay nhiều các sự kiện vừa xảy ra.
```
{ 
  "events" : [ev1, ev2, ev3, ...]
}


```


Mỗi sự kiện sẽ có các trường thông tin chung như ví dụ bên dưới, các trường này là bắt buộc và luôn luôn có giá trị.


```
{
  "id": "evqwjalnhlrkwyvuspdfmwzlv",
  "account_id": "acpxkgumifuoofoosble",
  "created": 1608883792973,
  "type": "message_sent",
  "by": { "id": "bbqvwqeofekbxyvlmj", "type": "agent" },
  "data": {...}
}

```



![](https://vcdn.subiz-cdn.com/file/firtbcyjiurytsdssuhr_acpxkgumifuoofoosble)


**user\_created**

Xảy ra khi có một người dùng mới được tạo có thể trên website hay tất cả các kênh khác như facebook messenger, zalo hay email.
```
{
  "id": "evqwjnqmicmcubixmhbuyefli",
  "account_id": "acpxkgumifuoofoosble",
  "created": 1608955412824,
  "type": "user_created",
  "by": {
    "device": {
      "ip": "2402:800:41f5:4794:582b:2fb9:8308:1d61",
      "user_agent": "Mozilla/5.0 (Linux; Android 10; CPH2061) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.99 Mobile Safari/537.36",
      "referrer": "https://subiz.com.vn/vi/?utm_source=id-acqowkxgexdswgfswawn&utm_medium=widget&utm_campaign=widget_referral"
    }
  },
  "data": {
    "user": {
      "id": "usqwjnqmiclzmjttbqjzo",
      "account_id": "acpxkgumifuoofoosble",
      "attributes": [
        { "key": "created", "datetime": "2020-12-26T04:03:32Z" },
        { "key": "seen", "datetime": "2020-12-26T04:03:32Z" },
        { "key": "acpxkgumifuoofoosble_subizv4_subikon", "datetime": "2020-12-26T04:03:32Z" }
      ]
    }
  }
}


```


**user\_info\_updated**

Xảy ra khi có một người dùng mới cập nhật thông
```
{
  "id": "evqwjnqmicmcubixmhbuyefli",
  "account_id": "acpxkgumifuoofoosble",
  "created": 1608955412824,
  "type": "user_created",
  "by": {
    "device": {
      "ip": "2402:800:41f5:4794:582b:2fb9:8308:1d61",
      "user_agent": "Mozilla/5.0 (Linux; Android 10; CPH2061) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.99 Mobile Safari/537.36",
      "referrer": "https://subiz.com.vn/vi/?utm_source=id-acqowkxgexdswgfswawn&utm_medium=widget&utm_campaign=widget_referral"
    }
  },
  "data": {
    "user": {
      "id": "usqwjnqmiclzmjttbqjzo",
      "account_id": "acpxkgumifuoofoosble",
      "attributes": [
        { "key": "created", "datetime": "2020-12-26T04:03:32Z" },
        { "key": "seen", "datetime": "2020-12-26T04:03:32Z" },
        { "key": "acpxkgumifuoofoosble_subizv4_subikon", "datetime": "2020-12-26T04:03:32Z" }
      ]
    }
  }
}


```


**[Xem chi tiết link hướng dẫn sử dụng webhook](https://www.notion.so/Webhook-e4b38eb769fe46e19be8ec9e8e2e73bf)**