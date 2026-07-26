export type Invitation = {
  id: string;
  slug: string;
  partnerOne: string;
  partnerTwo: string;
  date: string;
  time: string;
  venue: string;
  address: string;
  mapUrl: string;
  cardNumber?: string;
  cardHolder?: string;
  themeStyle?: "classic" | "garden" | "midnight";
  coverUrl?: string;
  galleryUrls?: string[];
  musicUrl?: string;
  messageUz: string;
  messageRu: string;
  messageEn: string;
  defaultLanguage: "uz" | "ru" | "en";
  createdByEmail?: string;
  deletedAt?: string | null;
  status: "published" | "draft";
  guests: number;
  attending: number;
};

export const invitations: Invitation[] = [
  {
    id: "1", slug: "aziz-diyora", partnerOne: "Aziz", partnerTwo: "Diyora",
    date: "2026-09-18", time: "18:00", venue: "Zarafshon tantanalar saroyi",
    address: "Toshkent shahri, Amir Temur shoh ko‘chasi, 4", mapUrl: "https://maps.google.com",
    messageUz: "Hayotimizning eng go‘zal kunini siz bilan birga nishonlash biz uchun katta baxt.",
    messageRu: "Для нас большое счастье разделить с вами самый прекрасный день нашей жизни.",
    messageEn: "It would mean the world to us to celebrate the most beautiful day of our lives with you.",
    defaultLanguage: "uz",
    status: "published", guests: 148, attending: 128,
  },
  {
    id: "2", slug: "shahzod-malika", partnerOne: "Shahzod", partnerTwo: "Malika",
    date: "2026-10-03", time: "17:30", venue: "Versal tantanalar saroyi",
    address: "Samarqand shahri", mapUrl: "https://maps.google.com",
    messageUz: "Quvonchimizga sherik bo‘ling.", messageRu: "", messageEn: "", defaultLanguage: "uz",
    status: "draft", guests: 64, attending: 0,
  },
];

export function getInvitation(slug: string) {
  return invitations.find((item) => item.slug === slug);
}
