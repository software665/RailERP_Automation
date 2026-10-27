
import { randomBytes } from 'node:crypto';

export class Utils {

    // Generate unique value using date, time and alphabets
    static generateUniqueValue(prefix = '') {

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

    // Generate unique State Name
    static generateStateName(stateName) {

        return `${stateName} ${this.generateUniqueValue()}`;

    }

    // Generate unique State Code (maximum 10 characters)
    static generateStateCode() {

        const timestamp = Date.now()
            .toString(36)
            .slice(-6)
            .toUpperCase();

        const randomLetters = Array.from(randomBytes(4))
            .map(byte => String.fromCharCode(65 + byte % 26))
            .join('');

        return `${timestamp}${randomLetters}`;
    }

}
