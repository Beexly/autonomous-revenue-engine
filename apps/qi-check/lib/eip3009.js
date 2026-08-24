/**
 * EIP-3009 transferWithAuthorization — used by USDC-style tokens for x402 exact payments.
 * This module is the signature/domain layer only. Settlement goes through an x402 facilitator
 * (e.g. CDP /verify + /settle). We do not broadcast txs from the API route in v0.
 *
 * Reference: USDC on Base implements transferWithAuthorization(from, to, value, validAfter,
 * validBefore, nonce, v, r, s).
 */

/** EIP-712 domain for USDC-like EIP-3009 tokens (fill chainId + verifyingContract per network). */
export function eip3009Domain({ name = "USD Coin", version = "2", chainId, verifyingContract }) {
  return {
    name,
    version,
    chainId,
    verifyingContract,
  };
}

/** Typed data for TransferWithAuthorization */
export const TRANSFER_WITH_AUTHORIZATION_TYPES = {
  TransferWithAuthorization: [
    { name: "from", type: "address" },
    { name: "to", type: "address" },
    { name: "value", type: "uint256" },
    { name: "validAfter", type: "uint256" },
    { name: "validBefore", type: "uint256" },
    { name: "nonce", type: "bytes32" },
  ],
};

/**
 * Build the message object a wallet signs for an exact USDC pull.
 * value is in atomic units (USDC = 6 decimals).
 */
export function buildTransferWithAuthorizationMessage({
  from,
  to,
  valueAtomic,
  validAfter = 0,
  validBefore,
  nonce,
}) {
  if (!from || !to || valueAtomic == null || !nonce) {
    throw new Error("from, to, valueAtomic, nonce required");
  }
  const before =
    validBefore ??
    Math.floor(Date.now() / 1000) + 3600; // 1h default window
  return {
    from,
    to,
    value: String(valueAtomic),
    validAfter: String(validAfter),
    validBefore: String(before),
    nonce,
  };
}

/** Base mainnet + Sepolia USDC addresses (verify against Circle docs before production). */
export const USDC_ADDRESSES = {
  base: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
  baseSepolia: "0x036CbD53842c5426634e7929541eC2318f3dCF7e",
};

export const CHAIN_IDS = {
  base: 8453,
  baseSepolia: 84532,
};

/**
 * Placeholder: server-side we never take a user private key.
 * Client signs EIP-712; facilitator verifies/settles.
 * Integration point for x402 PAYMENT-SIGNATURE payload assembly lives in payments/x402.js later.
 */
export function paymentRequirementsTemplate({
  network = "base-sepolia",
  to,
  amountUsdc = "0.05",
}) {
  const chainId = network === "base" ? CHAIN_IDS.base : CHAIN_IDS.baseSepolia;
  const verifyingContract =
    network === "base" ? USDC_ADDRESSES.base : USDC_ADDRESSES.baseSepolia;
  const valueAtomic = Math.round(parseFloat(amountUsdc) * 1e6);
  return {
    scheme: "exact",
    network: `eip155:${chainId}`,
    asset: verifyingContract,
    payTo: to,
    maxAmountRequired: String(valueAtomic),
    resource: "/api/score",
    description: "qi-check score",
    mimeType: "application/json",
  };
}
