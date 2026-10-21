import { languages } from './config';

type Locale = (typeof languages)[number]['value'];
// Advertisement, ready title, download hint, continue action, export error.
const copy: Record<Locale, readonly [string, string, string, string, string]> = {
  en: ['Advertisement', 'Your download is ready', 'The download has started. You can continue editing.', 'Continue editing', 'Could not download the images. Please wait for processing to finish and try again.'],
  zh: ['广告', '下载文件已生成', '已发起下载，你可以继续编辑。', '继续编辑', '无法下载图片，请等待处理完成后重试。'],
  hi: ['विज्ञापन', 'आपकी फ़ाइल तैयार है', 'डाउनलोड शुरू हो गया है। आप संपादन जारी रख सकते हैं।', 'संपादन जारी रखें', 'चित्र डाउनलोड नहीं हो सके। प्रोसेसिंग पूरी होने पर फिर कोशिश करें।'],
  es: ['Publicidad', 'Tu archivo está listo', 'La descarga ha comenzado. Puedes seguir editando.', 'Seguir editando', 'No se pudieron descargar las imágenes. Espera a que termine el procesamiento e inténtalo de nuevo.'],
  ar: ['إعلان', 'ملف التنزيل جاهز', 'بدأ التنزيل. يمكنك متابعة التعديل.', 'متابعة التعديل', 'تعذّر تنزيل الصور. انتظر اكتمال المعالجة ثم حاول مجددًا.'],
  bn: ['বিজ্ঞাপন', 'আপনার ফাইল প্রস্তুত', 'ডাউনলোড শুরু হয়েছে। আপনি সম্পাদনা চালিয়ে যেতে পারেন।', 'সম্পাদনা চালিয়ে যান', 'ছবিগুলো ডাউনলোড করা যায়নি। প্রক্রিয়াকরণ শেষ হলে আবার চেষ্টা করুন।'],
  pt: ['Publicidade', 'Seu arquivo está pronto', 'O download foi iniciado. Você pode continuar editando.', 'Continuar editando', 'Não foi possível baixar as imagens. Aguarde o processamento terminar e tente novamente.'],
  ru: ['Реклама', 'Файл готов к скачиванию', 'Скачивание началось. Можно продолжить редактирование.', 'Продолжить редактирование', 'Не удалось скачать изображения. Дождитесь завершения обработки и повторите попытку.'],
  ja: ['広告', 'ダウンロードの準備ができました', 'ダウンロードを開始しました。編集を続けられます。', '編集を続ける', '画像をダウンロードできませんでした。処理が完了してから再試行してください。'],
  de: ['Werbung', 'Deine Datei ist bereit', 'Der Download wurde gestartet. Du kannst weiter bearbeiten.', 'Weiter bearbeiten', 'Die Bilder konnten nicht heruntergeladen werden. Warte auf den Abschluss der Verarbeitung und versuche es erneut.'],
  fr: ['Publicité', 'Votre fichier est prêt', 'Le téléchargement a démarré. Vous pouvez continuer à modifier.', 'Continuer à modifier', 'Impossible de télécharger les images. Attendez la fin du traitement, puis réessayez.'],
  ur: ['اشتہار', 'آپ کی فائل تیار ہے', 'ڈاؤن لوڈ شروع ہو گیا ہے۔ آپ ترمیم جاری رکھ سکتے ہیں۔', 'ترمیم جاری رکھیں', 'تصاویر ڈاؤن لوڈ نہیں ہو سکیں۔ کارروائی مکمل ہونے کے بعد دوبارہ کوشش کریں۔'],
  id: ['Iklan', 'File Anda siap', 'Unduhan telah dimulai. Anda dapat melanjutkan pengeditan.', 'Lanjutkan mengedit', 'Gambar tidak dapat diunduh. Tunggu hingga pemrosesan selesai, lalu coba lagi.'],
  it: ['Pubblicità', 'Il file è pronto', 'Il download è iniziato. Puoi continuare a modificare.', 'Continua a modificare', 'Impossibile scaricare le immagini. Attendi la fine dell’elaborazione e riprova.'],
  ko: ['광고', '다운로드 파일이 준비되었습니다', '다운로드가 시작되었습니다. 편집을 계속할 수 있습니다.', '계속 편집하기', '이미지를 다운로드할 수 없습니다. 처리가 끝난 후 다시 시도해 주세요.'],
  tr: ['Reklam', 'Dosyanız hazır', 'İndirme başladı. Düzenlemeye devam edebilirsiniz.', 'Düzenlemeye devam et', 'Görseller indirilemedi. İşlemin tamamlanmasını bekleyip tekrar deneyin.'],
  vi: ['Quảng cáo', 'Tệp của bạn đã sẵn sàng', 'Đã bắt đầu tải xuống. Bạn có thể tiếp tục chỉnh sửa.', 'Tiếp tục chỉnh sửa', 'Không thể tải ảnh xuống. Vui lòng đợi xử lý xong rồi thử lại.'],
  th: ['โฆษณา', 'ไฟล์ของคุณพร้อมแล้ว', 'เริ่มดาวน์โหลดแล้ว คุณสามารถแก้ไขต่อได้', 'แก้ไขต่อ', 'ไม่สามารถดาวน์โหลดรูปภาพได้ โปรดรอให้ประมวลผลเสร็จแล้วลองอีกครั้ง'],
  nl: ['Advertentie', 'Je bestand is klaar', 'De download is gestart. Je kunt verder bewerken.', 'Verder bewerken', 'De afbeeldingen konden niet worden gedownload. Wacht tot de verwerking klaar is en probeer het opnieuw.'],
  pl: ['Reklama', 'Plik jest gotowy', 'Rozpoczęto pobieranie. Możesz kontynuować edycję.', 'Kontynuuj edycję', 'Nie udało się pobrać obrazów. Poczekaj na zakończenie przetwarzania i spróbuj ponownie.'],
  sv: ['Annons', 'Din fil är klar', 'Nedladdningen har startat. Du kan fortsätta redigera.', 'Fortsätt redigera', 'Bilderna kunde inte laddas ner. Vänta tills bearbetningen är klar och försök igen.'],
  nb: ['Annonse', 'Filen din er klar', 'Nedlastingen har startet. Du kan fortsette å redigere.', 'Fortsett å redigere', 'Bildene kunne ikke lastes ned. Vent til behandlingen er ferdig og prøv igjen.'],
  fi: ['Mainos', 'Tiedostosi on valmis', 'Lataus on alkanut. Voit jatkaa muokkaamista.', 'Jatka muokkaamista', 'Kuvia ei voitu ladata. Odota käsittelyn valmistumista ja yritä uudelleen.'],
  da: ['Annonce', 'Din fil er klar', 'Downloaden er startet. Du kan fortsætte med at redigere.', 'Fortsæt redigering', 'Billederne kunne ikke downloades. Vent, til behandlingen er færdig, og prøv igen.'],
};

export function getAdCopy(locale: string) {
  const [advertisement, title, hint, continueEditing, downloadError] = copy[locale as Locale] ?? copy.en;
  return { advertisement, title, hint, continueEditing, downloadError };
}
