import { promises as fs } from "fs";
import path from "path";
import { randomUUID } from "crypto";
import type { CreateLeadInput, Lead, LeadStatus } from "@/types/lead";

const DATA_DIR = path.join(process.cwd(), "data");
const LEADS_FILE = path.join(DATA_DIR, "leads.json");

async function ensureDataFile() {
  await fs.mkdir(DATA_DIR, { recursive: true });

  try {
    await fs.access(LEADS_FILE);
  } catch {
    await fs.writeFile(LEADS_FILE, "[]", "utf-8");
  }
}

async function readLeads(): Promise<Lead[]> {
  await ensureDataFile();
  const raw = await fs.readFile(LEADS_FILE, "utf-8");
  return JSON.parse(raw) as Lead[];
}

async function writeLeads(leads: Lead[]) {
  await ensureDataFile();
  await fs.writeFile(LEADS_FILE, JSON.stringify(leads, null, 2), "utf-8");
}

export async function getAllLeads(): Promise<Lead[]> {
  const leads = await readLeads();
  return leads.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
}

export async function createLead(input: CreateLeadInput): Promise<Lead> {
  const leads = await readLeads();

  const lead: Lead = {
    id: randomUUID(),
    ...input,
    status: "new",
    createdAt: new Date().toISOString(),
  };

  leads.unshift(lead);
  await writeLeads(leads);
  return lead;
}

export async function updateLeadStatus(
  id: string,
  status: LeadStatus,
): Promise<Lead | null> {
  const leads = await readLeads();
  const index = leads.findIndex((lead) => lead.id === id);

  if (index === -1) return null;

  leads[index] = { ...leads[index], status };
  await writeLeads(leads);
  return leads[index];
}

export async function deleteLead(id: string): Promise<boolean> {
  const leads = await readLeads();
  const filtered = leads.filter((lead) => lead.id !== id);

  if (filtered.length === leads.length) return false;

  await writeLeads(filtered);
  return true;
}

export async function getLeadStats() {
  const leads = await getAllLeads();

  return {
    total: leads.length,
    new: leads.filter((l) => l.status === "new").length,
    contacted: leads.filter((l) => l.status === "contacted").length,
    approved: leads.filter((l) => l.status === "approved").length,
    rejected: leads.filter((l) => l.status === "rejected").length,
  };
}
