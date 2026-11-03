# JewelAI - Jewelry Appraisal Website

JewelAI là ứng dụng web React giúp người dùng thu thập thông tin về trang sức và xem một báo cáo định giá trực quan. Người dùng có thể nhập mô tả, tải ảnh/chứng từ, trao đổi với trợ lý tư vấn và xem khoảng giá, xu hướng thị trường cùng các sản phẩm tương đương.

> **Trạng thái hiện tại:** Đây là bản demo giao diện (prototype). Phân tích AI, dữ liệu thị trường và giá trị định giá đang được mô phỏng ở phía trình duyệt bằng dữ liệu ngẫu nhiên; ứng dụng chưa kết nối API AI, cơ sở dữ liệu hoặc dịch vụ định giá thực tế.

## Tính năng

- Nhập mô tả món trang sức để bắt đầu phiên tư vấn.
- Tải lên nhiều ảnh (`JPG`, `PNG`, `HEIC`) và tài liệu chứng nhận (`PDF`, `DOC`, `DOCX`).
- Trợ lý chat hỏi thêm về:
  - loại đá và kim loại;
  - tuổi, phong cách và nguồn gốc;
  - tình trạng, dấu hiệu, trọng lượng và kích thước;
  - chứng nhận, hóa đơn và lịch sử sử dụng.
- Mô phỏng ba giai đoạn nghiên cứu:
  - phân tích món đồ;
  - nghiên cứu thị trường;
  - nghiên cứu lịch sử và văn hóa.
- Hiển thị báo cáo định giá gồm:
  - giá thấp, giá trung bình và giá cao;
  - xu hướng thị trường và độ tin cậy;
  - các yếu tố định giá;
  - các giao dịch tương đương;
  - danh sách tệp đã phân tích.
- Có trợ lý chat nhanh dạng cửa sổ nổi trên màn hình tìm kiếm.
- Giao diện responsive, xây dựng bằng Tailwind CSS và các component UI dùng lại được.

## Công nghệ

- React 19
- TypeScript
- Vite 6
- Tailwind CSS
- Radix UI
- Lucide React
- Sonner (toast notification)

## Yêu cầu

- Node.js 18 trở lên
- npm

## Cài đặt và chạy local

```bash
npm install
npm run dev
```

Sau đó mở địa chỉ được Vite hiển thị trong terminal, thường là:

```text
http://localhost:5173
```

## Các lệnh có sẵn

| Lệnh | Mục đích |
| --- | --- |
| `npm run dev` | Chạy development server với Vite |
| `npm run build` | Build production vào thư mục `dist/` |
| `npm run preview` | Xem thử bản build production |

## Luồng sử dụng

1. Tại màn hình chính, nhập mô tả như `2 carat diamond ring` hoặc chọn một ví dụ có sẵn.
2. Có thể tải ảnh món đồ hoặc giấy chứng nhận trước khi bắt đầu.
3. Trả lời các câu hỏi trong màn hình **AI Jewelry Consultant**.
4. Khi hoàn tất xác nhận, chọn **Generate Professional Appraisal**.
5. Xem báo cáo định giá và chọn **New Appraisal** để bắt đầu lại.

## Cấu trúc dự án

```text
.
├── App.tsx                    # Điều phối trạng thái search/chat/loading/results
├── main.tsx                   # Điểm khởi động React
├── components/
│   ├── SearchInterface.tsx    # Nhập mô tả và tải tệp
│   ├── ChatPage.tsx           # Quy trình tư vấn nhiều bước
│   ├── AIChat.tsx             # Chat nhanh dạng overlay
│   ├── AppraisalResults.tsx   # Báo cáo định giá
│   ├── ui/                    # Các component giao diện dùng lại
│   └── figma/                 # Component hỗ trợ hình ảnh
├── styles/
│   └── globals.css            # Theme, biến màu và style nền
├── index.html                 # HTML entry point
├── vite.config.ts             # Cấu hình Vite
└── package.json               # Dependencies và scripts
```

## Lưu ý về dữ liệu và bảo mật

- Không tải dữ liệu lên server trong phiên bản hiện tại; tệp chỉ được giữ trong state của trình duyệt.
- Các giá trị định giá và giao dịch tương đương không phải dữ liệu thị trường thật.
- Không sử dụng kết quả demo cho mục đích mua bán, bảo hiểm, pháp lý hoặc tài chính.
- Với định giá chính thức, nên bổ sung API/backend đáng tin cậy và xác nhận bởi chuyên gia thẩm định được chứng nhận.

## Hướng phát triển

- Kết nối mô hình AI và dịch vụ tìm kiếm dữ liệu thị trường thực tế.
- Thêm backend để lưu phiên tư vấn, tệp và báo cáo.
- Xác thực loại tệp, kích thước tệp và quyền riêng tư trước khi upload.
- Bổ sung kiểm thử tự động và xử lý lỗi rõ ràng cho các thao tác bất đồng bộ.
- Cho phép xuất báo cáo thành PDF và chia sẻ kết quả an toàn.

## Giấy phép

Dự án chưa khai báo giấy phép. Hãy bổ sung file `LICENSE` trước khi phân phối hoặc sử dụng trong sản phẩm thương mại.
