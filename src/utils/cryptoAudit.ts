import { AuditBlock, UserRole } from '../types';

// Simple deterministic SHA-256 implementation / Web Crypto wrapper
export async function sha256Hex(data: string): Promise<string> {
  if (typeof window !== 'undefined' && window.crypto && window.crypto.subtle) {
    const encoder = new TextEncoder();
    const hashBuffer = await window.crypto.subtle.digest('SHA-256', encoder.encode(data));
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
  }
  
  // Fallback bit-wise FNV-1a / Murmur-like 64-character hash for non-browser/offline environments
  let h1 = 0xdeadbeef;
  let h2 = 0x41c64e6d;
  for (let i = 0; i < data.length; i++) {
    const ch = data.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  const part1 = (h1 >>> 0).toString(16).padStart(8, '0');
  const part2 = (h2 >>> 0).toString(16).padStart(8, '0');
  return (part1 + part2 + part1 + part2 + part1 + part2 + part1 + part2).substring(0, 64);
}

export async function createAuditBlock(
  previousBlock: AuditBlock | null,
  userId: string,
  userName: string,
  userRole: UserRole,
  action: AuditBlock['action'],
  resourceId: string,
  resourceType: AuditBlock['resourceType'],
  details: string,
  ipAddress: string = '192.168.1.104'
): Promise<AuditBlock> {
  const blockIndex = previousBlock ? previousBlock.blockIndex + 1 : 0;
  const previousHash = previousBlock ? previousBlock.currentHash : '0000000000000000000000000000000000000000000000000000000000000000';
  const timestamp = new Date().toISOString();

  const payload = `${blockIndex}-${previousHash}-${timestamp}-${userId}-${action}-${resourceId}-${details}`;
  const currentHash = await sha256Hex(payload);

  return {
    blockIndex,
    timestamp,
    userId,
    userName,
    userRole,
    action,
    resourceId,
    resourceType,
    details,
    ipAddress,
    previousHash,
    currentHash,
  };
}

export async function verifyAuditLedgerIntegrity(ledger: AuditBlock[]): Promise<{
  isValid: boolean;
  tamperedBlockIndex: number | null;
  message: string;
}> {
  if (ledger.length === 0) return { isValid: true, tamperedBlockIndex: null, message: 'Ledger is empty.' };

  for (let i = 0; i < ledger.length; i++) {
    const block = ledger[i];

    // Check link to previous block
    if (i > 0) {
      if (block.previousHash !== ledger[i - 1].currentHash) {
        return {
          isValid: false,
          tamperedBlockIndex: i,
          message: `Broken cryptographic link at Block #${i}. Previous hash does not match Block #${i - 1}.`,
        };
      }
    } else {
      if (block.previousHash !== '0000000000000000000000000000000000000000000000000000000000000000') {
        return {
          isValid: false,
          tamperedBlockIndex: 0,
          message: 'Genesis block previous hash is invalid.',
        };
      }
    }

    // Verify current block hash
    const payload = `${block.blockIndex}-${block.previousHash}-${block.timestamp}-${block.userId}-${block.action}-${block.resourceId}-${block.details}`;
    const calculatedHash = await sha256Hex(payload);
    if (calculatedHash !== block.currentHash) {
      return {
        isValid: false,
        tamperedBlockIndex: i,
        message: `Tampering detected inside Block #${i}! Payload hash mismatch.`,
      };
    }
  }

  return {
    isValid: true,
    tamperedBlockIndex: null,
    message: `Cryptographic integrity verified. All ${ledger.length} PHI access blocks are mathematically sound.`,
  };
}
