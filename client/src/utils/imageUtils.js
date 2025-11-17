// Get the API base URL from environment
const API_BASE =
  import.meta.env.VITE_API_BASE || "http://localhost:3000/api/v1";
const SERVER_URL = API_BASE.replace("/api/v1", "");

/**
 * Constructs the full URL for user avatar images
 * @param {string} avatarUrl - The avatar filename or full URL
 * @returns {string} - The full URL to the avatar image
 */
export const getAvatarUrl = avatarUrl => {
  if (!avatarUrl) return null;

  // If it's already a full URL, return as is
  if (avatarUrl.startsWith("http")) {
    return avatarUrl;
  }

  // Construct full URL with server base
  return `${SERVER_URL}/public/img/users/${avatarUrl}`;
};

/**
 * Constructs the full URL for eSign images
 * @param {string} eSignPath - The eSign filename or full URL
 * @returns {string} - The full URL to the eSign image
 */
export const getESignUrl = eSignPath => {
  if (!eSignPath) return null;

  if (eSignPath.startsWith("http")) {
    return eSignPath;
  }

  return `${SERVER_URL}/public/img/esigns/${eSignPath}`;
};

/**
 * Constructs the full URL for proof images
 * @param {string} proofPath - The proof filename or full URL
 * @returns {string} - The full URL to the proof image
 */
export const getProofUrl = proofPath => {
  if (!proofPath) return null;

  if (proofPath.startsWith("http")) {
    return proofPath;
  }

  return `${SERVER_URL}/public/img/proofs/${proofPath}`;
};

/**
 * Constructs the full URL for contract PDFs
 * @param {string} contractPath - The contract filename or full URL
 * @returns {string} - The full URL to the contract PDF
 */
export const getContractUrl = contractPath => {
  if (!contractPath) return null;

  if (contractPath.startsWith("http")) {
    return contractPath;
  }

  return `${SERVER_URL}/public/contracts/${contractPath}`;
};
