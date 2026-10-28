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
 * Generate unique State Name.
 *
 * @param {string} stateName - State Name from JSON.
 * @returns {string} Unique State Name.
 */
export function generateStateName(stateName) {

    return `${stateName} ${generateUniqueValue()}`;
}

/**
 * Generate unique State Code (maximum 10 characters).
 *
 * @returns {string} Generated State Code.
 */
export function generateStateCode() {

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
 * Create a new State using the State Page Object.
 *
 * @param {PageManagers} pm - Page Manager instance.
 * @param {string} stateName - Generated State Name.
 * @param {string} stateCode - Generated State Code.
 * @param {string|number} status - State Active Status.
 */
export async function createState(pm, stateName, stateCode, status) {

    // Navigate to State page
    await pm.navigatepage.State();

    // Click Add New State
    await pm.statePage.addNewState();

    // Enter State Name
    await pm.statePage.stateName(stateName);

    // Enter State Code
    await pm.statePage.stateCode(stateCode);

    // Select Active Status
    await pm.statePage.activeStatus(status);

    // Save State
    await pm.statePage.saveState();
}