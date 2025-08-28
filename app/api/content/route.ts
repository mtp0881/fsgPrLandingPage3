import { NextRequest, NextResponse } from 'next/server';
import { kv } from '@vercel/kv';

// Fallback content if KV is not available
const defaultContent = {
  "jp": {
    "hero": {
      "title": "FSG事業部 デジタル変革のパートナー",
      "subtitle": "FPTソフトウェアジャパンの金融・公共・レガシー・Salesforce専門部門として、19年以上の実績で日本企業のDXを支援します。",
      "explore": "詳細を見る",
      "demo": "サービス紹介",
      "uptime": "500+ 金融エンジニア",
      "support": "15拠点 全国対応"
    },
    "partners": {
      "title": "信頼されるクライアント",
      "subtitle": "日本全国の大手企業・官公庁から信頼され、共に成長し続けています。",
      "additional": "その他多数の企業・組織と戦略的パートナーシップを構築"
    },
    "slides": {
      "finance": [
        "/slides/Slide12.jpg",
        "/slides/Slide13.jpg"
      ],
      "legacy": [
        "/slides/Slide18.jpg",
        "/slides/Slide19.jpg",
        "/slides/Slide20.jpg"
      ],
      "public": [
        "/slides/Slide15.jpg",
        "/slides/Slide16.jpg"
      ],
      "salesforce": [
        "/slides/Slide22.jpg",
        "/slides/Slide23.jpg",
        "/slides/Slide24.jpg",
        "/slides/Slide25.jpg",
        "/slides/Slide26.jpg",
        "/slides/Slide27.jpg"
      ],
      "fpt": [
        "/slides/Slide4.jpg",
        "/slides/Slide5.jpg",
        "/slides/Slide6.jpg",
        "/slides/Slide7.jpg",
        "/slides/Slide8.jpg",
        "/slides/Slide9.jpg"
      ]
    },
    "footer": {
      "description": "FPTソフトウェアジャパンのFSGデパートメント。金融、レガシー、公共、Salesforceの4つの事業ドメインで専門的なソリューションを提供。",
      "company": "FPTソフトウェアジャパン株式会社 FSGデパートメント",
      "copyright": "© 2025 FPTソフトウェアジャパン FSGデパートメント. 全著作権所有。"
    },
    "about": {
      "title": "FSG事業部について",
      "subtitle": "FPTソフトウェアジャパンのパブリックファイナンスサービス開発事業部として、金融・公共・レガシー・Salesforceの4つの専門分野で日本のデジタル変革をリードしています。",
      "mission": {
        "title": "ミッション",
        "desc": "19年以上の経験と豊富な人材を活かし、銀行・保険・証券を中心とした金融業界のデジタル変革を支援します。"
      },
      "vision": {
        "title": "ビジョン",
        "desc": "全国15拠点のネットワークと500名以上のエンジニアで、公共機関・教育機関のスマートシティ化を推進します。"
      },
      "values": {
        "title": "バリュー",
        "desc": "COBOL等レガシーシステムの最新技術移行と、Salesforceを活用したCRM統合ソリューションで企業の競争力向上に貢献します。"
      }
    },
    "services": {
      "title": "私たちのサービス",
      "subtitle": "金融、パブリック、レガシーモダナイゼーション、Salesforceの4つの主要領域で専門的なソリューションを提供",
      "finance": {
        "title": "金融サービス",
        "desc": "銀行・保険・証券業界向けの基幹システム開発からDX推進まで包括的なソリューションを提供。",
        "stats": "500名+エンジニア"
      },
      "legacy": {
        "title": "レガシーモダナイゼーション",
        "desc": "19年以上の経験と豊富な人材で、COBOLから最新技術まで幅広いマイグレーションサービスを提供。",
        "stats": "19年+経験"
      },
      "public": {
        "title": "パブリックサービス",
        "desc": "官公庁・自治体・教育機関向けに社会インフラと福祉発展のための安定したソリューションを提供。",
        "stats": "15拠点全国展開"
      },
      "salesforce": {
        "title": "Salesforceソリューション",
        "desc": "200名以上のエンジニア・コンサルタントによるSales Cloud、Service Cloud等の包括的なSalesforceソリューション。",
        "stats": "200名+専門家"
      }
    },
    "products": {
      "title": "主要実績",
      "subtitle": "これまでの主要なプロジェクト実績と成果",
      "finance": {
        "name": "金融システム開発",
        "desc": "大手銀行の基幹システム開発と証券取引プラットフォーム構築",
        "feature1": "勘定系システム開発",
        "feature2": "証券取引システム",
        "feature3": "モバイルバンキング",
        "feature4": "リスク管理システム"
      },
      "legacy": {
        "name": "レガシーモダナイゼーション",
        "desc": "COBOL等の古いシステムを最新技術に移行",
        "feature1": "COBOLからJavaへ移行",
        "feature2": "メインフレーム統合",
        "feature3": "データベース移行",
        "feature4": "システム統合"
      },
      "public": {
        "name": "公共システム開発",
        "desc": "自治体・教育機関向けシステム開発",
        "feature1": "行政システム",
        "feature2": "教育プラットフォーム",
        "feature3": "住民サービス",
        "feature4": "電子申請システム"
      },
      "salesforce": {
        "name": "Salesforceソリューション",
        "desc": "CRM・SFA統合ソリューション開発",
        "feature1": "Sales Cloud実装",
        "feature2": "Service Cloud統合",
        "feature3": "MuleSoft連携",
        "feature4": "カスタムアプリ開発"
      },
      "custom": {
        "title": "カスタムソリューション",
        "desc": "お客様のニーズに合わせたオーダーメイドソリューションを提供"
      },
      "main_achievements": "主な実績"
    },
    "contact": {
      "title": "お問い合わせ",
      "subtitle": "ご質問やご相談がございましたら、お気軽にお問い合わせください",
      "info": {
        "title": "お問い合わせ情報"
      },
      "address": "所在地",
      "phone": "電話番号",
      "email": "メールアドレス",
      "hours": "営業時間",
      "hours_weekday": "平日 9:00-18:00",
      "hours_saturday": "土曜 9:00-12:00",
      "form": {
        "name": "お名前",
        "email": "メールアドレス",
        "phone": "電話番号",
        "company": "会社名",
        "service": "お問い合わせ内容",
        "message": "メッセージ",
        "submit": "送信する",
        "select_service": "サービスを選択してください",
        "service_other": "その他"
      }
    }
  },
  "vn": {
    "hero": {
      "title": "FSG事業部 - Đối Tác Chuyển Đổi Số",
      "subtitle": "Phòng ban chuyên về Tài chính, Dịch vụ công, Legacy và Salesforce thuộc FPTソフトウェアジャパン, hỗ trợ DX với 19+ năm kinh nghiệm.",
      "explore": "Tìm Hiểu Thêm",
      "demo": "Giới Thiệu Dịch Vụ",
      "uptime": "500+ Kỹ Sư Tài Chính",
      "support": "15 Chi Nhánh Toàn Quốc"
    },
    "about": {
      "title": "Về Phòng Ban FSG",
      "subtitle": "Phòng ban Phát triển Dịch vụ Tài chính Công thuộc FPTソフトウェアジャパン, chuyên về 4 lĩnh vực: Tài chính, Dịch vụ công, Hiện đại hóa hệ thống cũ và Salesforce.",
      "mission": {
        "title": "Sứ Mệnh",
        "desc": "Với hơn 19 năm kinh nghiệm và nguồn nhân lực dồi dào, chúng tôi hỗ trợ chuyển đổi số cho ngành tài chính: ngân hàng, bảo hiểm, chứng khoán."
      },
      "vision": {
        "title": "Tầm Nhìn",
        "desc": "Mạng lưới 15 chi nhánh toàn quốc với hơn 500 kỹ sư, thúc đẩy việc xây dựng thành phố thông minh cho các cơ quan công, giáo dục."
      },
      "values": {
        "title": "Giá Trị",
        "desc": "Chuyển đổi hệ thống COBOL cũ sang công nghệ mới và cung cấp giải pháp CRM tích hợp Salesforce để nâng cao năng lực cạnh tranh doanh nghiệp."
      }
    },
    "services": {
      "title": "Dịch Vụ Của Chúng Tôi",
      "subtitle": "Cung cấp giải pháp chuyên sâu trong 4 lĩnh vực chính: Tài chính, Dịch vụ công, Hiện đại hóa hệ thống cũ và Salesforce",
      "finance": {
        "title": "Dịch Vụ Tài Chính",
        "desc": "Phát triển hệ thống cốt lõi cho ngân hàng, bảo hiểm, chứng khoán từ hệ thống cơ sở đến thúc đẩy chuyển đổi số.",
        "stats": "500+ Kỹ sư"
      },
      "legacy": {
        "title": "Hiện Đại Hóa Hệ Thống Cũ",
        "desc": "Với hơn 19 năm kinh nghiệm và đội ngũ nhân sự dồi dào, cung cấp dịch vụ di chuyển từ COBOL đến công nghệ hiện đại.",
        "stats": "19+ năm kinh nghiệm"
      },
      "public": {
        "title": "Dịch Vụ Công",
        "desc": "Cung cấp giải pháp ổn định cho cơ quan chính phủ, tự trị, giáo dục nhằm phát triển cơ sở hạ tầng xã hội và phúc lợi.",
        "stats": "15 chi nhánh toàn quốc"
      },
      "salesforce": {
        "title": "Giải Pháp Salesforce",
        "desc": "Với hơn 200 kỹ sư và chuyên gia tư vấn, cung cấp giải pháp Salesforce toàn diện từ Sales Cloud đến Service Cloud.",
        "stats": "200+ Chuyên gia"
      }
    },
    "products": {
      "title": "Thành Tựu Chính",
      "subtitle": "Các dự án và thành tựu chính đã thực hiện",
      "finance": {
        "name": "Phát Triển Hệ Thống Tài Chính",
        "desc": "Phát triển hệ thống cốt lõi ngân hàng và nền tảng giao dịch chứng khoán",
        "feature1": "Hệ thống kế toán",
        "feature2": "Hệ thống giao dịch chứng khoán",
        "feature3": "Ngân hàng di động",
        "feature4": "Hệ thống quản lý rủi ro"
      },
      "legacy": {
        "name": "Hiện Đại Hóa Legacy",
        "desc": "Chuyển đổi hệ thống COBOL cũ sang công nghệ hiện đại",
        "feature1": "Chuyển đổi COBOL sang Java",
        "feature2": "Tích hợp Mainframe",
        "feature3": "Di chuyển cơ sở dữ liệu",
        "feature4": "Tích hợp hệ thống"
      },
      "public": {
        "name": "Phát Triển Hệ Thống Công",
        "desc": "Phát triển hệ thống cho chính quyền địa phương và cơ sở giáo dục",
        "feature1": "Hệ thống hành chính",
        "feature2": "Nền tảng giáo dục",
        "feature3": "Dịch vụ dân cư",
        "feature4": "Hệ thống đăng ký điện tử"
      },
      "salesforce": {
        "name": "Giải Pháp Salesforce",
        "desc": "Phát triển giải pháp tích hợp CRM và SFA",
        "feature1": "Triển khai Sales Cloud",
        "feature2": "Tích hợp Service Cloud",
        "feature3": "Kết nối MuleSoft",
        "feature4": "Phát triển ứng dụng tùy chỉnh"
      },
      "custom": {
        "title": "Giải Pháp Tùy Chỉnh",
        "desc": "Cung cấp giải pháp được thiết kế riêng theo nhu cầu khách hàng"
      },
      "main_achievements": "Thành tựu chính"
    },
    "contact": {
      "title": "Liên Hệ",
      "subtitle": "Nếu bạn có câu hỏi hoặc cần tư vấn, vui lòng liên hệ với chúng tôi",
      "info": {
        "title": "Thông Tin Liên Hệ"
      },
      "address": "Địa chỉ",
      "phone": "Số điện thoại",
      "email": "Email",
      "hours": "Giờ làm việc",
      "hours_weekday": "Thứ 2-6: 9:00-18:00",
      "hours_saturday": "Thứ 7: 9:00-12:00",
      "form": {
        "name": "Họ tên",
        "email": "Email",
        "phone": "Số điện thoại",
        "company": "Tên công ty",
        "service": "Nội dung liên hệ",
        "message": "Tin nhắn",
        "submit": "Gửi",
        "select_service": "Vui lòng chọn dịch vụ",
        "service_other": "Khác"
      }
    },
    "partners": {
      "title": "Đối Tác",
      "subtitle": "Hợp tác với các đối tác đáng tin cậy để cung cấp dịch vụ tốt nhất",
      "additional": "Và nhiều đối tác khác trong các dự án đã thực hiện"
    },
    "slides": {
      "finance": [
        "/slides/Slide12.jpg",
        "/slides/Slide13.jpg"
      ],
      "legacy": [
        "/slides/Slide18.jpg",
        "/slides/Slide19.jpg",
        "/slides/Slide20.jpg"
      ],
      "public": [
        "/slides/Slide15.jpg",
        "/slides/Slide16.jpg"
      ],
      "salesforce": [
        "/slides/Slide22.jpg",
        "/slides/Slide23.jpg",
        "/slides/Slide24.jpg",
        "/slides/Slide25.jpg",
        "/slides/Slide26.jpg",
        "/slides/Slide27.jpg"
      ],
      "fpt": [
        "/slides/Slide4.jpg",
        "/slides/Slide5.jpg",
        "/slides/Slide6.jpg",
        "/slides/Slide7.jpg",
        "/slides/Slide8.jpg",
        "/slides/Slide9.jpg"
      ]
    },
    "footer": {
      "description": "FSG Department của FPTソフトウェアジャパン. Cung cấp các giải pháp chuyên nghiệp trong 4 lĩnh vực: Tài chính, Legacy, Công khai và Salesforce.",
      "company": "FPTソフトウェアジャパン - FSG Department",
      "copyright": "© 2025 FPTソフトウェアジャパン FSG Department. Tất cả quyền được bảo lưu."
    }
  }
};

export async function GET() {
  try {
    // Try to get content from Vercel KV first
    try {
      const content = await kv.get('fsg-content');
      if (content) {
        return NextResponse.json(content);
      }
    } catch (kvError) {
      console.log('KV not available, falling back to default:', kvError);
    }

    // In development, try to read from file as fallback
    if (process.env.NODE_ENV !== 'production') {
      try {
        const fs = await import('fs');
        const path = await import('path');
        const contentFilePath = path.join(process.cwd(), 'data', 'content.json');
        const fileContents = fs.readFileSync(contentFilePath, 'utf8');
        const content = JSON.parse(fileContents);
        
        // Save to KV for future use
        try {
          await kv.set('fsg-content', content);
        } catch (kvSetError) {
          console.log('Could not save to KV:', kvSetError);
        }
        
        return NextResponse.json(content);
      } catch (fileError) {
        console.log('File not found, using default content');
      }
    }

    // Return default content as last resort
    return NextResponse.json(defaultContent);
  } catch (error) {
    console.error('Error reading content:', error);
    return NextResponse.json(defaultContent);
  }
}

export async function POST(request: NextRequest) {
  try {
    const content = await request.json();
    
    // Validate content structure
    if (!content.jp || !content.vn) {
      return NextResponse.json(
        { error: 'Invalid content structure' },
        { status: 400 }
      );
    }

    // Save to Vercel KV (works in both development and production)
    try {
      await kv.set('fsg-content', content);
      console.log('Content saved to Vercel KV successfully');
      
      // Also save to file in development for backup
      if (process.env.NODE_ENV !== 'production') {
        try {
          const fs = await import('fs');
          const path = await import('path');
          const contentFilePath = path.join(process.cwd(), 'data', 'content.json');
          fs.writeFileSync(contentFilePath, JSON.stringify(content, null, 2), 'utf8');
          console.log('Content also saved to file as backup');
        } catch (fileError) {
          console.log('Could not save to file (backup):', fileError);
        }
      }
      
      return NextResponse.json({ 
        success: true, 
        message: 'Content saved successfully to Vercel KV'
      });
    } catch (kvError) {
      console.error('Error saving to KV:', kvError);
      
      // Fallback to file system in development
      if (process.env.NODE_ENV !== 'production') {
        try {
          const fs = await import('fs');
          const path = await import('path');
          const contentFilePath = path.join(process.cwd(), 'data', 'content.json');
          fs.writeFileSync(contentFilePath, JSON.stringify(content, null, 2), 'utf8');
          return NextResponse.json({ 
            success: true, 
            message: 'Content saved to file (KV unavailable)'
          });
        } catch (fileError) {
          console.error('Error writing file:', fileError);
          return NextResponse.json(
            { error: 'Failed to save content' },
            { status: 500 }
          );
        }
      }
      
      return NextResponse.json(
        { error: 'Failed to save content to KV' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error processing content save:', error);
    return NextResponse.json(
      { error: 'Failed to save content' },
      { status: 500 }
    );
  }
}
