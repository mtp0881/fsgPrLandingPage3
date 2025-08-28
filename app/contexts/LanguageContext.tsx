'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'jp' | 'vn';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  themeColor: string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Translations
const translations = {
  jp: {
    // Header
    'nav.about': '私たちについて',
    'nav.services': 'サービス',
    'nav.products': '製品',
    'nav.global': 'グローバル',
    'nav.contact': 'お問い合わせ',
    'nav.consultation': '無料相談',
    
    // Hero Section
    'hero.title': 'FSG事業部 デジタル変革のパートナー',
    'hero.subtitle': 'FPTソフトウェアジャパンの金融・公共・レガシー・Salesforce専門部門として、19年以上の実績で日本企業のDXを支援します。',
    'hero.explore': '詳細を見る',
    'hero.demo': 'サービス紹介',
    'hero.uptime': '500+ 金融エンジニア',
    'hero.support': '15拠点 全国対応',
    
    // About Section
    'about.title': 'FSG事業部について',
    'about.subtitle': 'FPTソフトウェアジャパンのパブリックファイナンスサービス開発事業部として、金融・公共・レガシー・Salesforceの4つの専門分野で日本のデジタル変革をリードしています。',
    'about.mission.title': 'ミッション',
    'about.mission.desc': '19年以上の経験と豊富な人材を活かし、銀行・保険・証券を中心とした金融業界のデジタル変革を支援します。',
    'about.vision.title': 'ビジョン',
    'about.vision.desc': '全国15拠点のネットワークと500名以上のエンジニアで、公共機関・教育機関のスマートシティ化を推進します。',
    'about.values.title': 'バリュー',
    'about.values.desc': 'COBOL等レガシーシステムの最新技術移行と、Salesforceを活用したCRM統合ソリューションで企業の競争力向上に貢献します。',
    'about.stats.finance_engineers': '金融エンジニア',
    'about.stats.legacy_projects': 'レガシー移行案件',
    'about.stats.public_locations': '公共拠点',
    'about.stats.salesforce_specialists': 'Salesforce専門家',
    
    // Services Section
    'services.title': '私たちのサービス',
    'services.subtitle': '金融、パブリック、レガシーモダナイゼーション、Salesforceの4つの主要領域で専門的なソリューションを提供',
    'services.finance.title': '金融サービス',
    'services.finance.desc': '銀行・保険・証券業界向けの基幹システム開発からDX推進まで包括的なソリューションを提供。',
    'services.legacy.title': 'レガシーモダナイゼーション',
    'services.legacy.desc': '19年以上の経験と豊富な人材で、COBOLから最新技術まで幅広いマイグレーションサービスを提供。',
    'services.public.title': 'パブリックサービス',
    'services.public.desc': '官公庁・自治体・教育機関向けに社会インフラと福祉発展のための安定したソリューションを提供。',
    'services.salesforce.title': 'Salesforceソリューション',
    'services.salesforce.desc': '200名以上のエンジニア・コンサルタントによるSales Cloud、Service Cloud等の包括的なSalesforceソリューション。',
    'services.learn_more': '詳細を見る →',
    'services.close_modal': '閉じる',
    'services.modal_title': '詳細資料',
    'services.finance.stats': '500名+エンジニア',
    'services.legacy.stats': '19年+経験',
    'services.public.stats': '15拠点全国展開',
    'services.salesforce.stats': '200名+専門家',
    
    // Products Section - Changed to Achievements (実績)
    'products.title': '主要実績',
    'products.subtitle': 'FSG事業部の4つの専門分野における代表的なプロジェクト実績をご紹介します',
    'products.finance.name': '金融システム開発',
    'products.finance.desc': 'メガバンク・大手保険・証券会社向けの基幹システム開発において業界をリードする実績を誇ります。',
    'products.legacy.name': 'レガシーモダナイゼーション',
    'products.legacy.desc': '豊富な経験とノウハウでCOBOL/PL1移行プロジェクトを成功に導きます。',
    'products.public.name': '公共システム構築',
    'products.public.desc': '官公庁・自治体・教育機関向けシステムで全国展開のサービスを提供。',
    'products.salesforce.name': 'Salesforceソリューション',
    'products.salesforce.desc': '専門家によるSales Cloud・Service Cloud・MuleSoft統合で企業のCRM変革を支援。',
    'products.demo': '詳細',
    'products.custom.title': 'カスタマイズソリューションをお探しですか？',
    'products.custom.desc': 'FSG事業部では、お客様の具体的な要件に応じて最適なソリューションを設計・開発いたします。無料相談をご利用ください。',
    'products.custom.contact': '無料相談のお申込み',
    'products.main_achievements': '主要実績',
    'products.finance.feature1': '基幹システム・チャネルシステム開発',
    'products.finance.feature2': '勘定系・決済系システム開発',
    'products.finance.feature3': 'DX推進・BPO業務',
    'products.finance.feature4': '銀行・保険・証券業務知見',
    'products.legacy.feature1': 'COBOL/PL1/Assembler移行',
    'products.legacy.feature2': 'データベースマイグレーション',
    'products.legacy.feature3': 'オンラインシステム移行',
    'products.legacy.feature4': 'AI活用自動変換ツール',
    'products.public.feature1': '官公庁・自治体システム',
    'products.public.feature2': '教育機関・犯罪管理',
    'products.public.feature3': 'スマートシティ・交通道路',
    'products.public.feature4': '宇宙・電力・防災・消防',
    'products.salesforce.feature1': 'Sales Cloud・Service Cloud',
    'products.salesforce.feature2': 'Experience Cloud・Commerce Cloud',
    'products.salesforce.feature3': 'Data Cloud・MuleSoft・Tableau',
    'products.salesforce.feature4': 'Industries Cloud各業界対応',
    
    // Contact Section
    'contact.title': 'お問い合わせ',
    'contact.subtitle': '無料相談とお客様に最適なソリューションを見つけるサポートをご提供します',
    'contact.info.title': '連絡先情報',
    'contact.address': '住所',
    'contact.phone': '電話',
    'contact.email': 'メール',
    'contact.hours': '営業時間',
    'contact.hours.weekday': '月-金: 8:00 - 18:00',
    'contact.hours.saturday': '土: 8:00 - 12:00',
    'contact.follow': 'フォローしてください',
    'contact.form.name': '氏名 *',
    'contact.form.email': 'メール *',
    'contact.form.phone': '電話番号',
    'contact.form.company': '会社名',
    'contact.form.service': '関心のあるサービス',
    'contact.form.message': 'メッセージ内容 *',
    'contact.form.submit': '相談依頼を送信',
    'contact.form.placeholder.name': '氏名を入力',
    'contact.form.placeholder.email': 'メールを入力',
    'contact.form.placeholder.phone': '電話番号を入力',
    'contact.form.placeholder.company': '会社名を入力',
    'contact.form.placeholder.message': 'ご要望を詳しくお聞かせください...',
    'contact.form.select_service': 'サービスを選択',
    'contact.form.service.web': 'Web開発',
    'contact.form.service.mobile': 'モバイルアプリ',
    'contact.form.service.analytics': 'データ分析',
    'contact.form.service.automation': '自動化',
    'contact.form.service.security': 'システムセキュリティ',
    'contact.form.service.cloud': 'クラウドコンピューティング',
    'contact.form.service.consulting': 'デジタル変革コンサルティング',
    'contact.form.service.other': 'その他',
    
    // Footer
    'footer.description': 'FPTソフトウェアジャパンのFSGデパートメント。金融、レガシー、公共、Salesforceの4つの事業ドメインで専門的なソリューションを提供。',
    'footer.company': 'FPTソフトウェアジャパン株式会社 FSGデパートメント',
    'footer.business_domains': '事業ドメイン',
    'footer.services': 'サービス',
    'footer.contact': 'お問い合わせ',
    'footer.copyright': '© 2025 FPTソフトウェアジャパン FSGデパートメント. 全著作権所有。',
    
    // Partners
    'partners.title': '信頼されるクライアント',
    'partners.subtitle': '日本全国の大手企業・官公庁から信頼され、共に成長し続けています。',
    'partners.additional': 'その他多数の企業・組織と戦略的パートナーシップを構築',
    
    // Features - Finance Domain
    'features.banking_systems': '銀行基幹システム',
    'features.insurance_systems': '保険システム',
    'features.securities_systems': '証券システム',
    'features.payment_systems': '決済システム',
    
    // Features - Legacy Domain  
    'features.cobol_migration': 'COBOLマイグレーション',
    'features.db_migration': 'データベース移行',
    'features.system_modernization': 'システム現代化',
    'features.legacy_assessment': 'レガシー評価',
    
    // Features - Public Domain
    'features.government_systems': '官公庁システム',
    'features.education_systems': '教育機関システム',
    'features.smart_city': 'スマートシティ',
    'features.public_infrastructure': '公共インフラ',
    
    // Features - Salesforce Domain
    'features.sales_cloud': 'Sales Cloud',
    'features.service_cloud': 'Service Cloud',
    'features.mulesoft_integration': 'MuleSoft統合',
    'features.data_cloud': 'Data Cloud',
    'features.lead_management': 'リード管理',
    'features.marketing_automation': 'マーケティング自動化',
    'features.customer_analysis': '顧客分析',
    'features.multichannel_integration': 'マルチチャンネル統合',
    'features.ecommerce_website': 'Eコマースウェブサイト',
    'features.mobile_app': 'モバイルアプリ',
    'features.diverse_payments': '多様な決済',
    'features.order_management': '注文管理',
    'features.responsive_design': 'レスポンシブデザイン',
    'features.seo_optimization': 'SEO最適化',
    'features.fast_loading': '高速読み込み',
    'features.modern_framework': 'モダンフレームワーク',
    'features.cross_platform': 'クロスプラットフォーム',
    'features.native_performance': 'ネイティブパフォーマンス',
    'features.push_notifications': 'プッシュ通知',
    'features.offline_support': 'オフラインサポート',
    'features.big_data_processing': 'ビッグデータ処理',
    'features.realtime_analytics': 'リアルタイム分析',
    'features.custom_dashboards': 'カスタムダッシュボード',
    'features.ai_insights': 'AI洞察',
    'features.process_automation': 'プロセス自動化',
    'features.workflow_optimization': 'ワークフロー最適化',
    'features.rpa_solutions': 'RPAソリューション',
    'features.integration_apis': '統合API',
    'features.cybersecurity': 'サイバーセキュリティ',
    'features.data_encryption': 'データ暗号化',
    'features.access_control': 'アクセス制御',
    'features.security_audits': 'セキュリティ監査',
    'features.cloud_migration': 'クラウド移行',
    'features.infrastructure_management': 'インフラ管理',
    'features.cost_optimization': 'コスト最適化',
    'features.multicloud_support': 'マルチクラウドサポート',
    'features.including_setup': 'セットアップ込み',
  },
  vn: {
    // Header
    'nav.about': 'Về Chúng Tôi',
    'nav.services': 'Dịch Vụ',
    'nav.products': 'Sản Phẩm',
    'nav.global': 'Toàn Cầu',
    'nav.contact': 'Liên Hệ',
    'nav.consultation': 'Tư Vấn Miễn Phí',
    
    // Hero Section
    'hero.title': 'FSG事業部 - Đối Tác Chuyển Đổi Số',
    'hero.subtitle': 'Phòng ban chuyên về Tài chính, Dịch vụ công, Legacy và Salesforce thuộc FPT Software Japan, hỗ trợ DX với 19+ năm kinh nghiệm.',
    'hero.explore': 'Tìm Hiểu Thêm',
    'hero.demo': 'Giới Thiệu Dịch Vụ',
    'hero.uptime': '500+ Kỹ Sư Tài Chính',
    'hero.support': '15 Chi Nhánh Toàn Quốc',
    
    // About Section
    'about.title': 'Về Phòng Ban FSG',
    'about.subtitle': 'Phòng ban Phát triển Dịch vụ Tài chính Công thuộc FPTソフトウェアジャパン, chuyên về 4 lĩnh vực: Tài chính, Dịch vụ công, Hiện đại hóa hệ thống cũ và Salesforce.',
    'about.mission.title': 'Sứ Mệnh',
    'about.mission.desc': 'Với hơn 19 năm kinh nghiệm và nguồn nhân lực dồi dào, chúng tôi hỗ trợ chuyển đổi số cho ngành tài chính: ngân hàng, bảo hiểm, chứng khoán.',
    'about.vision.title': 'Tầm Nhìn',
    'about.vision.desc': 'Mạng lưới 15 chi nhánh toàn quốc với hơn 500 kỹ sư, thúc đẩy việc xây dựng thành phố thông minh cho các cơ quan công, giáo dục.',
    'about.values.title': 'Giá Trị',
    'about.values.desc': 'Chuyển đổi hệ thống COBOL cũ sang công nghệ mới và cung cấp giải pháp CRM tích hợp Salesforce để nâng cao năng lực cạnh tranh doanh nghiệp.',
    'about.stats.finance_engineers': 'Kỹ Sư Tài Chính',
    'about.stats.legacy_projects': 'Dự Án Legacy',
    'about.stats.public_locations': 'Chi Nhánh Công',
    'about.stats.salesforce_specialists': 'Chuyên Gia Salesforce',
    
    // Services Section
    'services.title': 'Dịch Vụ Của Chúng Tôi',
    'services.subtitle': 'Cung cấp giải pháp chuyên sâu trong 4 lĩnh vực chính: Tài chính, Dịch vụ công, Hiện đại hóa hệ thống cũ và Salesforce',
    'services.finance.title': 'Dịch Vụ Tài Chính',
    'services.finance.desc': 'Phát triển hệ thống cốt lõi cho ngân hàng, bảo hiểm, chứng khoán từ hệ thống cơ sở đến thúc đẩy chuyển đổi số.',
    'services.legacy.title': 'Hiện Đại Hóa Hệ Thống Cũ',
    'services.legacy.desc': 'Với hơn 19 năm kinh nghiệm và đội ngũ nhân sự dồi dào, cung cấp dịch vụ di chuyển từ COBOL đến công nghệ hiện đại.',
    'services.public.title': 'Dịch Vụ Công',
    'services.public.desc': 'Cung cấp giải pháp ổn định cho cơ quan chính phủ, tự trị, giáo dục nhằm phát triển cơ sở hạ tầng xã hội và phúc lợi.',
    'services.salesforce.title': 'Giải Pháp Salesforce',
    'services.salesforce.desc': 'Với hơn 200 kỹ sư và chuyên gia tư vấn, cung cấp giải pháp Salesforce toàn diện từ Sales Cloud đến Service Cloud.',
    'services.learn_more': 'Tìm hiểu thêm →',
    'services.close_modal': 'Đóng',
    'services.modal_title': 'Chi tiết',
    'services.finance.stats': '500+ Kỹ sư',
    'services.legacy.stats': '19+ năm kinh nghiệm',
    'services.public.stats': '15 chi nhánh toàn quốc',
    'services.salesforce.stats': '200+ Chuyên gia',
    
    // Products Section - Changed to Achievements (実績)
    'products.title': 'Thành Tích Chính',
    'products.subtitle': 'Các dự án tiêu biểu trong 4 lĩnh vực chuyên môn của Phòng ban FSG',
    'products.finance.name': 'Phát Triển Hệ Thống Tài Chính',
    'products.finance.desc': 'Dẫn đầu trong phát triển hệ thống cốt lõi cho các ngân hàng lớn, công ty bảo hiểm và chứng khoán hàng đầu.',
    'products.legacy.name': 'Hiện Đại Hóa Legacy',
    'products.legacy.desc': 'Kinh nghiệm phong phú và chuyên môn sâu trong các dự án di chuyển COBOL/PL1.',
    'products.public.name': 'Xây Dựng Hệ Thống Công',
    'products.public.desc': 'Cung cấp dịch vụ cho cơ quan chính phủ, tự trị và giáo dục trên toàn quốc.',
    'products.salesforce.name': 'Giải Pháp Salesforce',
    'products.salesforce.desc': 'Chuyên gia hỗ trợ chuyển đổi CRM doanh nghiệp qua Sales Cloud, Service Cloud và MuleSoft.',
    'products.demo': 'Chi Tiết',
    'products.custom.title': 'Tìm kiếm giải pháp tùy chỉnh?',
    'products.custom.desc': 'Phòng ban FSG thiết kế và phát triển giải pháp tối ưu theo yêu cầu cụ thể của khách hàng. Sử dụng dịch vụ tư vấn miễn phí.',
    'products.custom.contact': 'Đăng Ký Tư Vấn Miễn Phí',
    'products.main_achievements': 'Thành tích chính',
    'products.finance.feature1': 'Phát triển hệ thống cốt lõi và kênh',
    'products.finance.feature2': 'Phát triển hệ thống kế toán và thanh toán',
    'products.finance.feature3': 'Thúc đẩy DX và BPO',
    'products.finance.feature4': 'Kiến thức nghiệp vụ ngân hàng, bảo hiểm, chứng khoán',
    'products.legacy.feature1': 'Di chuyển COBOL/PL1/Assembler',
    'products.legacy.feature2': 'Di chuyển cơ sở dữ liệu',
    'products.legacy.feature3': 'Di chuyển hệ thống trực tuyến',
    'products.legacy.feature4': 'Công cụ chuyển đổi tự động bằng AI',
    'products.public.feature1': 'Hệ thống cơ quan chính phủ và tự trị',
    'products.public.feature2': 'Quản lý giáo dục và tội phạm',
    'products.public.feature3': 'Thành phố thông minh và giao thông',
    'products.public.feature4': 'Vũ trụ, điện lực, phòng chống thiên tai',
    'products.salesforce.feature1': 'Sales Cloud・Service Cloud',
    'products.salesforce.feature2': 'Experience Cloud・Commerce Cloud',
    'products.salesforce.feature3': 'Data Cloud・MuleSoft・Tableau',
    'products.salesforce.feature4': 'Industries Cloud cho từng ngành',
    
    // Contact Section
    'contact.title': 'Liên Hệ Với Chúng Tôi',
    'contact.subtitle': 'Sẵn sàng tư vấn miễn phí và hỗ trợ bạn tìm ra giải pháp phù hợp nhất',
    'contact.info.title': 'Thông Tin Liên Hệ',
    'contact.address': 'Địa chỉ',
    'contact.phone': 'Điện thoại',
    'contact.email': 'Email',
    'contact.hours': 'Giờ làm việc',
    'contact.hours.weekday': 'T2-T6: 8:00 - 18:00',
    'contact.hours.saturday': 'T7: 8:00 - 12:00',
    'contact.follow': 'Theo dõi chúng tôi',
    'contact.form.name': 'Họ và tên *',
    'contact.form.email': 'Email *',
    'contact.form.phone': 'Số điện thoại',
    'contact.form.company': 'Tên công ty',
    'contact.form.service': 'Dịch vụ quan tâm',
    'contact.form.message': 'Nội dung tin nhắn *',
    'contact.form.submit': 'Gửi Yêu Cầu Tư Vấn',
    'contact.form.placeholder.name': 'Nhập họ và tên',
    'contact.form.placeholder.email': 'Nhập email',
    'contact.form.placeholder.phone': 'Nhập số điện thoại',
    'contact.form.placeholder.company': 'Nhập tên công ty',
    'contact.form.placeholder.message': 'Mô tả chi tiết nhu cầu của bạn...',
    'contact.form.select_service': 'Chọn dịch vụ',
    'contact.form.service.web': 'Phát triển Web',
    'contact.form.service.mobile': 'Ứng dụng Mobile',
    'contact.form.service.analytics': 'Phân tích dữ liệu',
    'contact.form.service.automation': 'Tự động hóa',
    'contact.form.service.security': 'Bảo mật hệ thống',
    'contact.form.service.cloud': 'Cloud Computing',
    'contact.form.service.consulting': 'Tư vấn chuyển đổi số',
    'contact.form.service.other': 'Khác',
    
    // Footer
    'footer.description': 'FSG Department của FPT Software Japan. Cung cấp các giải pháp chuyên nghiệp trong 4 lĩnh vực: Tài chính, Legacy, Công khai và Salesforce.',
    'footer.company': 'FPT Software Japan - FSG Department',
    'footer.business_domains': 'Lĩnh Vực Kinh Doanh',
    'footer.services': 'Dịch Vụ',
    'footer.contact': 'Liên Hệ',
    'footer.copyright': '© 2025 FPT Software Japan FSG Department. Tất cả quyền được bảo lưu.',
    
    // Partners
    'partners.title': 'Khách Hàng Tin Cậy',
    'partners.subtitle': 'Được tin tưởng bởi các doanh nghiệp lớn và cơ quan chính phủ trên toàn Nhật Bản, cùng nhau phát triển bền vững.',
    'partners.additional': 'Cùng nhiều doanh nghiệp và tổ chức khác trong mối quan hệ đối tác chiến lược',
    
    // Features - Finance Domain
    'features.banking_systems': 'Hệ thống ngân hàng',
    'features.insurance_systems': 'Hệ thống bảo hiểm',
    'features.securities_systems': 'Hệ thống chứng khoán',
    'features.payment_systems': 'Hệ thống thanh toán',
    
    // Features - Legacy Domain  
    'features.cobol_migration': 'Di chuyển COBOL',
    'features.db_migration': 'Di chuyển cơ sở dữ liệu',
    'features.system_modernization': 'Hiện đại hóa hệ thống',
    'features.legacy_assessment': 'Đánh giá hệ thống cũ',
    
    // Features - Public Domain
    'features.government_systems': 'Hệ thống chính phủ',
    'features.education_systems': 'Hệ thống giáo dục',
    'features.smart_city': 'Thành phố thông minh',
    'features.public_infrastructure': 'Cơ sở hạ tầng công',
    
    // Features - Salesforce Domain
    'features.sales_cloud': 'Sales Cloud',
    'features.service_cloud': 'Service Cloud',
    'features.mulesoft_integration': 'Tích hợp MuleSoft',
    'features.data_cloud': 'Data Cloud',
    'features.lead_management': 'Quản lý lead',
    'features.marketing_automation': 'Tự động hóa marketing',
    'features.customer_analysis': 'Phân tích khách hàng',
    'features.multichannel_integration': 'Tích hợp đa kênh',
    'features.ecommerce_website': 'Website bán hàng',
    'features.mobile_app': 'Ứng dụng mobile',
    'features.diverse_payments': 'Thanh toán đa dạng',
    'features.order_management': 'Quản lý đơn hàng',
    'features.responsive_design': 'Responsive Design',
    'features.seo_optimization': 'SEO Optimization',
    'features.fast_loading': 'Fast Loading',
    'features.modern_framework': 'Modern Framework',
    'features.cross_platform': 'Cross Platform',
    'features.native_performance': 'Native Performance',
    'features.push_notifications': 'Push Notifications',
    'features.offline_support': 'Offline Support',
    'features.big_data_processing': 'Big Data Processing',
    'features.realtime_analytics': 'Real-time Analytics',
    'features.custom_dashboards': 'Custom Dashboards',
    'features.ai_insights': 'AI Insights',
    'features.process_automation': 'Process Automation',
    'features.workflow_optimization': 'Workflow Optimization',
    'features.rpa_solutions': 'RPA Solutions',
    'features.integration_apis': 'Integration APIs',
    'features.cybersecurity': 'Cybersecurity',
    'features.data_encryption': 'Data Encryption',
    'features.access_control': 'Access Control',
    'features.security_audits': 'Security Audits',
    'features.cloud_migration': 'Cloud Migration',
    'features.infrastructure_management': 'Infrastructure Management',
    'features.cost_optimization': 'Cost Optimization',
    'features.multicloud_support': 'Multi-Cloud Support',
    'features.including_setup': 'Bao gồm setup',
  }
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('jp'); // Default to Japanese

  useEffect(() => {
    // Load saved language from localStorage or default to Japanese
    const savedLanguage = localStorage.getItem('language') as Language;
    if (savedLanguage && ['jp', 'vn'].includes(savedLanguage)) {
      setLanguage(savedLanguage);
    }
  }, []);

  // Update CSS variables when language changes
  useEffect(() => {
    const root = document.documentElement;
    if (language === 'vn') {
      // Vietnam theme - Light Green
      root.style.setProperty('--primary-color', '#10b981'); // emerald-500
      root.style.setProperty('--primary-hover', '#059669'); // emerald-600
      root.style.setProperty('--primary-light', '#d1fae5'); // emerald-100
      root.style.setProperty('--primary-dark', '#047857'); // emerald-700
    } else {
      // Japan theme - Blue (default)
      root.style.setProperty('--primary-color', '#2563eb'); // blue-600
      root.style.setProperty('--primary-hover', '#1d4ed8'); // blue-700
      root.style.setProperty('--primary-light', '#dbeafe'); // blue-100
      root.style.setProperty('--primary-dark', '#1e40af'); // blue-800
    }
  }, [language]);

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
  };

  const t = (key: string): string => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (translations[language] as any)[key] || key;
  };

  const themeColor = language === 'vn' ? 'emerald' : 'blue';

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t, themeColor }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
