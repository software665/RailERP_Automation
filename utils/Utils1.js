
import { randomBytes } from 'node:crypto';

/**
 * Generate a unique value using date, time, milliseconds and alphabets.
 *
 * @param {string} prefix - Optional prefix.
 * @returns {string} Generated unique value.
 */
export function generateUniqueValue(prefix = '') {

    const now = new Date();

    const date = [
        now.getFullYear(),
        String(now.getMonth() + 1).padStart(2, '0'),
        String(now.getDate()).padStart(2, '0')
    ].join('');

    const time = [
        String(now.getHours()).padStart(2, '0'),
        String(now.getMinutes()).padStart(2, '0'),
        String(now.getSeconds()).padStart(2, '0')
    ].join('');

    const milliseconds = String(now.getMilliseconds()).padStart(3, '0');

    const alphabets = randomBytes(3)
        .toString('hex')
        .slice(0, 3)
        .toUpperCase()
        .replace(/[0-9]/g, 'A');

    return `${prefix}${date}${time}${milliseconds}${alphabets}`;
}

/**
 * Generate unique District Name.
 *
 * @param {string} districtName - District Name from JSON.
 * @returns {string} Unique District Name.
 */
export function generateDistrictName(districtName) {

    return `${districtName} ${generateUniqueValue()}`;
}

/**
 * Generate unique District Code (maximum 10 characters).
 *
 * @returns {string} Generated District Code.
 */
export function generateDistrictCode() {

    const timestamp = Date.now()
        .toString(36)
        .slice(-6)
        .toUpperCase();

    const randomLetters = Array.from(randomBytes(4))
        .map(byte => String.fromCharCode(65 + byte % 26))
        .join('');

    return `${timestamp}${randomLetters}`;
}

/**
 * Create a new District using the District Page Object.
 *
 * @param {PageManagers} pm - Page Manager instance.
 * @param {string|number} stateId - Parent State ID.
 * @param {string} districtName - Generated District Name.
 * @param {string} districtCode - Generated District Code.
 * @param {string|number} status - District Active Status.
 */
export async function createDistrict(
    pm,
    stateId,
    districtName,
    districtCode,
    status
) {

    // Navigate to District page
    await pm.navigatepage.District();

    // Click Add New District
    await pm.districtPage.addNewDistrict();

    // Select Parent State
    await pm.districtPage.selectState(stateId);

    // Enter District Name
    await pm.districtPage.districtName(districtName);

    // Enter District Code
    await pm.districtPage.districtCode(districtCode);

    // Select Active Status
    await pm.districtPage.activeStatus(status);

    // Save District
    await pm.districtPage.saveDistrict();
}
