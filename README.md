# 🌌 Hasan Parlatır - İnteraktif Uzay Temalı Portfolyo (hsnprltr.com)

Bu proje, bağımsız oyun geliştiricisi, tasarımcısı ve programcısı **Hasan Parlatır** için özel olarak tasarlanmış ve geliştirilmiş; modern web teknolojilerini 3D grafiklerle harmanlayan interaktif, uzay temalı bir portfolyo web sitesidir. 

Kullanıcıyı ilk andan itibaren içine çeken sinematik bir açılış ekranı, Three.js ile oluşturulmuş dinamik bir gökyüzü (starfield) ve fare hareketlerine tepki veren 3D gezegen modelleriyle donatılmış, oyunlaştırılmış (gamified) bir kullanıcı deneyimi sunar.

---

## 🚀 Teknolojik Yapı (Tech Stack)

Proje, modern web standartlarına uygun şekilde yüksek performans, SEO optimizasyonu ve duyarlılık (responsiveness) hedeflenerek şu teknolojilerle inşa edilmiştir:

*   **Framework:** [Next.js 16 (App Router)](https://nextjs.org/) — Sunucu taraflı optimizasyonlar ve hızlı sayfa geçişleri için.
*   **Arayüz Kütüphanesi:** [React 19](https://react.dev/) — Bileşen tabanlı ve performanslı arayüz yönetimi için.
*   **3D Grafikler:** [Three.js](https://threejs.org/) — Özel WebGL renderers, shader-benzeri parçacık sistemleri ve 3D model yüklemeleri için.
*   **Modeller ve Optimizasyon:** `GLTFLoader` ve [Meshoptimizer (MeshoptDecoder)](https://github.com/zeux/meshoptimizer) — 3D modellerin (GLB) web ortamında son derece hızlı ve sıkıştırılmış şekilde yüklenmesi için.
*   **Animasyonlar:** [Framer Motion 12](https://www.framer.com/motion/) — Sayfa geçişleri, yay (spring) tabanlı fizik etkileşimleri ve mikro etkileşimler için.
*   **Styling:** [Tailwind CSS v4](https://tailwindcss.com/) — Modern, esnek ve hızlı CSS tasarımı için.
*   **İkonlar:** [Lucide React](https://lucide.dev/) & [React Icons](https://react-icons.github.io/react-icons/) — Minimalist ve modern vektörel ikonlar için.

---

## 🔮 Öne Çıkan İnteraktif Özellikler ve Nasıl Yapıldı?

### 1. Sinematik Açılış Yükleyicisi (`IntroVideoLoader.tsx`)
Ziyaretçiyi karşılayan kozmik bir açılış ekranıdır.
*   **Video & Ses Desteği:** Arka planda oynatılan kozmik patlama (`bigbang.mp4`) videosu ile birlikte kullanıcının ses açıp kapatabileceği interaktif bir müzik/efekt HUD paneli bulunur.
*   **CRT Scanline Efekti:** Eski tüplü ekran (CRT) hissi veren tarama çizgileri (scanlines) ve hafif renk sapmaları (chromatic aberration) CSS gradyanları ile simüle edilmiştir.
*   **Gerçekçi Yükleme Barı:** Tarayıcının sayfa yükleme durumunu (`document.readyState`) takip eder. Ancak kullanıcının açılış sinematiğini görebilmesi için asgari 5 saniyelik bir süre sınırı konulmuş, böylece ani arayüz sıçramaları (flash) engellenmiştir.
*   **Hasan OS Arayüzü:** Ekranın sol üstünde hayali bir işletim sistemi telemetri akışı (`HASAN_OS v2.6.8`) simüle edilerek projeye bilimkurgu ve siberpunk bir hava katılmıştır.

### 2. 3D İnteraktif Güneş Sistemi (`ThreeStarfield.tsx` & `PlanetModel.tsx`)
Portfolyonun ana ekranı (Hero Section), derinlik hissi veren dinamik bir uzay boşluğudur.
*   **Dinamik Yıldız Alanı (Starfield):** Masaüstü cihazlarda **45.000**, mobil cihazlarda ise performans optimizasyonu adına **10.000** adet yıldız parçacığı (Particles) render edilir. Yıldızlar farenin hareket yönüne göre hafifçe kayarak derinlik (parallax) hissi yaratır.
*   **Karadelik Çekim Kuvveti:** Merkezdeki karadelik (`blackhole.glb`) modelinin üzerine gelindiğinde (hover), yıldız alanı karadeliğin merkezine doğru çekilmeye başlar. Bu uzay-zaman bükülmesi Framer Motion interpolasyon değerleri üzerinden Three.js vertex koordinatlarına aktarılmıştır.
*   **GLB Gezegen Modelleri:** Projedeki her bir menü sekmesini temsil eden gezegenler (`dathomir.glb`, `tatooine.glb`, `purple_planet.glb` vb.) 3D formatta yüklenir.
*   **Fizik Tabanlı Fare Takibi:** Gezegenlerin boyutu ve tepkileri Framer Motion'ın `useMotionValue` ve `useSpring` kancaları kullanılarak farenin yaklaşma mesafesine göre dinamik olarak hesaplanır. Fare gezegene yaklaştıkça gezegen yumuşak bir yay (spring) efektiyle büyür.

### 3. Çoklu Dil Desteği (`LanguageContext.tsx` & `LanguageToggle.tsx`)
Tüm site yerelleştirme (localization) mimarisine uygun olarak geliştirilmiştir.
*   **Dil Değiştirici:** Tek tuşla tüm portfolyo Türkçe ve İngilizce dilleri arasında dinamik olarak geçiş yapar.
*   **Context Yapısı:** Çeviriler `translations.ts` dosyasında anahtar-değer çiftleri olarak tutulur ve React Context sayesinde tüm alt bileşenlere anlık olarak dağıtılır.

### 4. Gizli Paskalya Yumurtaları (Easter Eggs)
Kullanıcı keşfini artırmak amacıyla siteye iki adet etkileşimli kozmik araç eklenmiştir:
*   **Dolaşan Uydu (Moving Satellite):** Ekranda yatay eksende periyodik olarak uçan bir yapay uydu (`uydu.png`) bulunur. Üzerine gelindiğinde parıldayan uyduya tıklandığında, Hasan Parlatır'ın geliştirdiği sanatsal grafik çalışmalarından oluşan *"Inhaled Past"* galerisi açılır.
*   **Yüzen Gemi (Bobbing Ship):** Rastgele konumlarda dikey olarak salınan uzay gemisine tıklandığında, geliştirilmekte olan bir araba oyununun ekran görüntülerini ve detaylarını barındıran gizli bir galeri tetiklenir.

---

## 📂 Proje Dizin Yapısı

```text
hsnprltr.com/
├── public/                 # Statik dosyalar, 3D Modeller (.glb), Görseller ve Videolar
│   ├── 3dplanets/          # Gezegen GLB modelleri
│   ├── gallery/            # Oyun içi ekran görüntüleri ve videolar
│   └── Satellite/          # Uydu ve uzay gemisi görselleri
├── src/
│   ├── app/                # Next.js App Router sayfaları ve global stiller
│   │   ├── globals.css     # Özelleştirilmiş CSS animasyonları ve Tailwind v4 yönergeleri
│   │   ├── layout.tsx      # Global HTML yapısı ve meta etiketleri
│   │   └── page.tsx        # Ana sayfa (Tüm portfolyo bileşenlerinin birleştiği devasa dosya)
│   ├── components/         # Yeniden kullanılabilir React bileşenleri
│   │   ├── IntroVideoLoader.tsx   # Sinematik açılış ekranı
│   │   ├── ThreeStarfield.tsx     # Yıldız arka planı ve karadelik mekaniği
│   │   ├── PlanetModel.tsx        # Tekil 3D gezegen render bileşeni
│   │   ├── ProjectRow.tsx         # Oyun projelerini listeleyen detaylı satırlar
│   │   ├── LanguageToggle.tsx     # Dil geçiş butonu
│   │   └── SocialSection.tsx      # Sosyal medya butonları ve linkleri
│   ├── context/            # React Context dosyaları (Dil yönetimi)
│   ├── data/               # Proje verileri ve çeviri metinleri
│   │   ├── portfolioData.tsx      # Oyunlar, projeler, eğitimler ve sertifikaların listesi
│   │   └── translations.ts        # TR/EN dil sözlüğü
│   └── hooks/              # Özel React kancaları
└── package.json            # Bağımlılıklar ve çalıştırma scriptleri
```

---

## 🛠️ Kurulum ve Yerel Çalıştırma (Installation & Dev)

Projeyi yerel bilgisayarınızda çalıştırmak için aşağıdaki adımları takip edebilirsiniz:

1.  **Depoyu Klonlayın:**
    ```bash
    git clone https://github.com/HSNPRLTR/hsnprltr.com.git
    cd hsnprltr.com
    ```

2.  **Bağımlılıkları Yükleyin:**
    ```bash
    npm install
    ```

3.  **Geliştirme Sunucusunu Başlatın:**
    ```bash
    npm run dev
    ```
    Tarayıcınızda `http://localhost:3000` adresine giderek projeyi görüntüleyebilirsiniz.

4.  **Üretim Yapısını Oluşturun (Production Build):**
    ```bash
    npm run build
    npm run start
    ```

---

## ⚙️ Performans ve Mobil Cihaz Optimizasyonları

3D grafiklerin web ortamında sorunsuz çalışabilmesi için projede şu optimizasyonlar uygulanmıştır:

*   **Mobil Cihaz Tespiti:** Kullanıcının mobil cihaz kullanıp kullanmadığı (`navigator.userAgent` ve ekran genişliği üzerinden) tespit edilerek WebGL yükü dinamik olarak azaltılır.
*   **Gökyüzü Skybox Optimizasyonu:** Ağır bir VRAM ve render yükü getiren galaksi arka plan gökyüzü (`inside_galaxy_skybox_hdri_360_panorama.glb`) **yalnızca masaüstü cihazlarda** yüklenir; mobil cihazlarda devre dışı bırakılır.
*   **Parçacık Azaltımı:** Yıldız sayısı mobil cihazlarda 45.000'den 10.000'e çekilerek GPU darboğazı engellenmiştir.
*   **Mobil Geri Tuşu Entegrasyonu:** Mobil tarayıcılarda herhangi bir proje detay veya görsel galerisi (modal) açıkken kullanıcının telefonunun fiziksel geri tuşuna basması durumunda tüm sitenin geri gitmesi yerine yalnızca açık olan modalın kapanması sağlanmıştır (`popstate` yönetimi).

---

## ✍️ Lisans ve Telif Hakkı

Tüm tasarımlar, 3D sahnelerin entegrasyonu, oyun geliştirme belgeleri ve kod altyapısı **Hasan Parlatır** tarafından geliştirilmiştir. Tüm hakları saklıdır.