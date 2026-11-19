import { OrganDonor, OrganRecipient } from '../types';

// ABO compatibility checker
export function isAboCompatible(donorBlood: string, recipientBlood: string): boolean {
  const cleanDonor = donorBlood.replace(/[^ABO]/g, '');
  const cleanRecipient = recipientBlood.replace(/[^ABO]/g, '');

  if (cleanDonor === 'O') return true; // Universal donor
  if (cleanRecipient === 'AB') return true; // Universal recipient
  if (cleanDonor === cleanRecipient) return true;
  return false;
}

export interface MatchResult {
  recipient: OrganRecipient;
  donor: OrganDonor;
  compatibilityScore: number; // 0 - 100%
  hlaMatchCount: number; // out of total markers
  hlaMatchPercentage: number;
  aboCompatible: boolean;
  ischemiaViabilityPercent: number;
  urgencyBoost: number;
  clinicalRecommendation: string;
}

export function computeOrganMatch(donor: OrganDonor, recipient: OrganRecipient): MatchResult {
  const abo = isAboCompatible(donor.bloodGroup, recipient.bloodGroup);
  
  if (!abo) {
    return {
      recipient,
      donor,
      compatibilityScore: 0,
      hlaMatchCount: 0,
      hlaMatchPercentage: 0,
      aboCompatible: false,
      ischemiaViabilityPercent: 0,
      urgencyBoost: 0,
      clinicalRecommendation: 'ABO Incompatible: Hyperacute rejection risk. Do not transplant.'
    };
  }

  // HLA Antigen Overlap
  let hlaMatches = 0;
  for (const marker of donor.hlaMarkers) {
    if (recipient.hlaMarkers.includes(marker)) {
      hlaMatches++;
    }
  }
  const maxHla = Math.max(donor.hlaMarkers.length, 1);
  const hlaPercentage = Math.round((hlaMatches / maxHla) * 100);

  // Cold Ischemia Time (CIT) remaining viability
  const hoursRemaining = Math.max(0, donor.coldIschemiaMaxHours - donor.coldIschemiaElapsedHours);
  const ischemiaViability = Math.round((hoursRemaining / donor.coldIschemiaMaxHours) * 100);

  // Urgency weight
  let urgencyBoost = 0;
  if (recipient.urgencyTier.includes('1A')) urgencyBoost = 25;
  else if (recipient.urgencyTier.includes('1B')) urgencyBoost = 15;
  else urgencyBoost = 5;

  // Composite formula: 40% HLA + 35% Cold Ischemia + 25% Urgency
  const finalScore = Math.min(
    100,
    Math.round(hlaPercentage * 0.40 + ischemiaViability * 0.35 + urgencyBoost)
  );

  let recommendation = 'Low compatibility. Explore alternative donors.';
  if (finalScore >= 80) recommendation = 'EXCELLENT MATCH: Prepare operating theater and harvest dispatch immediately.';
  else if (finalScore >= 65) recommendation = 'VIABLE MATCH: Initiate cross-matching antibody titer and notify transplant surgeon.';
  else if (finalScore >= 50) recommendation = 'MARGINAL MATCH: Secondary candidate if tier 1 candidates fail panel reactive antibodies.';

  return {
    recipient,
    donor,
    compatibilityScore: finalScore,
    hlaMatchCount: hlaMatches,
    hlaMatchPercentage: hlaPercentage,
    aboCompatible: true,
    ischemiaViabilityPercent: ischemiaViability,
    urgencyBoost,
    clinicalRecommendation: recommendation
  };
}
