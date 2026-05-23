export type LeadStatus = "new" | "contacted" | "approved" | "rejected";

export type Lead = {
  id: string;
  name: string;
  phone: string;
  telegram: string;
  city: string;
  profession: string;
  status: LeadStatus;
  createdAt: string;
};

export type CreateLeadInput = {
  name: string;
  phone: string;
  telegram: string;
  city: string;
  profession: string;
};

export const LEAD_STATUS_LABELS: Record<LeadStatus, string> = {
  new: "Новая",
  contacted: "Связались",
  approved: "Одобрена",
  rejected: "Отклонена",
};

export const LEAD_STATUS_STYLES: Record<LeadStatus, string> = {
  new: "bg-blue-50 text-blue-700 ring-blue-600/20",
  contacted: "bg-amber-50 text-amber-700 ring-amber-600/20",
  approved: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  rejected: "bg-red-50 text-red-700 ring-red-600/20",
};
