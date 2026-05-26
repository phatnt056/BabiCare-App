export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  role: "user" | "admin";
  phase: "prepreg" | "pregnancy";
  motherAge: string;
  weightBefore: string;
  heightBefore: string;
  notes: string;
  lastPeriodDate: string;
  doctorDueDate: string;
  method: "LMP" | "EDD";
  createdAt?: string;
  updatedAt?: string;
}

export interface AppTextSettings {
  id: string;
  appTitle: string;
  homepageSubtitle: string;
  pregnancyTitle: string;
  countdownLabel: string;
  maternityHandbookTitle: string;
  aiDoctorTitle: string;
  aiDoctorSubtitle: string;
}

export interface AffiliateProduct {
  id: string;
  name: string;
  imageUrl: string;
  affiliateUrl: string;
  price: string;
  category?: "vitamin" | "stretch_mark" | "food_drink";
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}
